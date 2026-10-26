import { randomBytes } from "node:crypto";
import {
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 (S3 compatible) storage. The database only keeps object keys; the bytes live here.
 *
 * Two buckets, because they have opposite needs:
 *  - private (R2_BUCKET): enquiry attachments. Never public, admins get short-lived signed links.
 *  - public (R2_PUBLIC_BUCKET + R2_PUBLIC_URL): Journal images. Served to visitors, so they must be public.
 *
 * Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *      R2_PUBLIC_BUCKET, R2_PUBLIC_URL (public base URL of that bucket, e.g. https://cdn.arshiya.uk)
 *      (optional) R2_ENDPOINT to override https://<account>.r2.cloudflarestorage.com
 */

export type BucketKind = "private" | "public";

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
};

const env = () => ({
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    privateBucket: process.env.R2_BUCKET,
    publicBucket: process.env.R2_PUBLIC_BUCKET,
    publicUrl: process.env.R2_PUBLIC_URL,
    endpoint: process.env.R2_ENDPOINT,
});

function hasCredentials() {
    const config = env();
    return Boolean(config.accessKeyId && config.secretAccessKey && (config.accountId || config.endpoint));
}

export function isStorageConfigured(kind: BucketKind = "private") {
    const config = env();
    if (!hasCredentials()) {
        return false;
    }
    return kind === "private" ? Boolean(config.privateBucket) : Boolean(config.publicBucket && config.publicUrl);
}

let client: S3Client | undefined;

function getClient() {
    const config = env();
    if (!hasCredentials()) {
        throw new Error("File storage is not configured (set the R2_* environment variables).");
    }
    client ??= new S3Client({
        region: "auto",
        endpoint: config.endpoint ?? `https://${config.accountId}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        credentials: { accessKeyId: config.accessKeyId!, secretAccessKey: config.secretAccessKey! },
    });
    return client;
}

function bucketName(kind: BucketKind) {
    if (!isStorageConfigured(kind)) {
        throw new Error(`The ${kind} storage bucket is not configured (see .env.example).`);
    }
    const config = env();
    return (kind === "private" ? config.privateBucket : config.publicBucket)!;
}

/** Readable, unique file name part: lowercase a-z, 0-9 and dashes only, never longer than 40 characters. */
export function cleanFileName(originalName: string) {
    return (
        originalName
            .replace(/\.[^.]*$/, "")
            .normalize("NFKD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40)
            .replace(/-+$/g, "") || "file"
    );
}

/**
 * Builds a unique, readable key such as
 *   enquiries/ARS-00042/20261026-a1b2c3d4-gown-sketch.png
 * - the folder groups every file of one enquiry or post,
 * - the date and 8 random hex characters mean two uploads can never share a name,
 * - the visitor's name is cleaned (no spaces, slashes or odd characters),
 * - the extension comes from the verified file type, not from what the visitor typed.
 */
export function buildObjectKey(folder: string, originalName: string, contentType: string) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const extension = EXTENSIONS[contentType] ?? "bin";
    return `${folder}/${date}-${randomBytes(4).toString("hex")}-${cleanFileName(originalName)}.${extension}`;
}

export async function uploadObject(key: string, body: Uint8Array, contentType: string, kind: BucketKind = "private") {
    await getClient().send(
        new PutObjectCommand({
            Bucket: bucketName(kind),
            Key: key,
            Body: body,
            ContentType: contentType,
            // Public images never change (every upload has a new name), so browsers and the CDN can keep them for a year.
            CacheControl: kind === "public" ? "public, max-age=31536000, immutable" : "private, no-store",
        }),
    );
}

/** Removes objects from the bucket. Throws if R2 reports any failure, so callers never lose track of a file. */
export async function deleteObjects(keys: string[], kind: BucketKind = "private") {
    const unique = [...new Set(keys)];
    for (let start = 0; start < unique.length; start += 1000) {
        const batch = unique.slice(start, start + 1000);
        const result = await getClient().send(
            new DeleteObjectsCommand({
                Bucket: bucketName(kind),
                Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
            }),
        );
        if (result.Errors?.length) {
            throw new Error(`Could not delete ${result.Errors.length} file(s) from storage.`);
        }
    }
}

/** Deletes everything under a folder, which also catches leftovers of an interrupted upload. */
export async function deletePrefix(prefix: string, kind: BucketKind = "private") {
    let token: string | undefined;
    do {
        const page = await getClient().send(
            new ListObjectsV2Command({ Bucket: bucketName(kind), Prefix: prefix, ContinuationToken: token }),
        );
        const keys = (page.Contents ?? []).flatMap((item) => (item.Key ? [item.Key] : []));
        if (keys.length) {
            await deleteObjects(keys, kind);
        }
        token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
}

/** A short-lived private link for an admin to download one enquiry file. */
export function signedDownloadUrl(key: string, filename: string, contentType: string, seconds = 60) {
    return getSignedUrl(
        getClient(),
        new GetObjectCommand({
            Bucket: bucketName("private"),
            Key: key,
            ResponseContentType: contentType,
            ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        }),
        { expiresIn: seconds },
    );
}

/** True when private files and public images share one bucket (so the bucket's public address reaches both). */
export function isSharedBucket() {
    const config = env();
    return Boolean(config.privateBucket && config.privateBucket === config.publicBucket);
}

/**
 * Folder for one enquiry's files. With a separate private bucket the folder is just the reference.
 * If the bucket is shared with the public Journal images, a 128-bit random segment is added, so
 * a visitor's file can never be found by guessing a web address.
 */
export function enquiryFolder(reference: string) {
    return isSharedBucket() ? `enquiries/${reference}/${randomBytes(16).toString("hex")}` : `enquiries/${reference}`;
}

/** Public address of a Journal image. Safe to call without any storage configured (returns null). */
export function publicObjectUrl(key: string | null | undefined) {
    const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
    return key && base ? `${base}/${key}` : null;
}

/** The key behind one of our public image URLs, or null for anything that is not ours. */
export function publicKeyFromUrl(url: string | null | undefined) {
    const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
    return url && base && url.startsWith(`${base}/`) ? url.slice(base.length + 1) : null;
}
