import { after, NextResponse } from "next/server";
import { z } from "zod";
import { sendEnquiryNotification } from "@/lib/email";
import {
    ENQUIRY_SOURCES,
    ENQUIRY_TYPES,
    MAX_FILES,
    MAX_FILE_BYTES,
    MAX_TOTAL_BYTES,
} from "@/lib/enquiry-types";
import { enquiryRef } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { clientIp, hashIp, isSameOrigin } from "@/lib/security";
import { buildObjectKey, deleteObjects, enquiryFolder, isStorageConfigured, uploadObject } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_BODY_BYTES = MAX_TOTAL_BYTES + 200_000;
const MAX_PER_IP_PER_HOUR = 5;

const text = (max: number) => z.string().trim().max(max);

const schema = z.object({
    name: text(120).min(1, "Please enter your name."),
    company: text(160),
    email: z.string().trim().toLowerCase().max(200).pipe(z.email("Please enter a valid email address.")),
    country: text(80),
    enquiry: z.union([z.literal(""), z.enum(ENQUIRY_TYPES)], "Please choose a valid enquiry type."),
    timeline: text(120),
    brief: text(5000).min(1, "Please describe your project."),
    source: z.enum(ENQUIRY_SOURCES).catch("popup"),
    page: text(120),
});

/** Identify the real file type from its first bytes, ignoring whatever the browser claims. */
function sniffType(bytes: Buffer): string | null {
    if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
    if (bytes.subarray(0, 4).toString("latin1") === "RIFF" && bytes.subarray(8, 12).toString("latin1") === "WEBP")
        return "image/webp";
    if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
    return null;
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

type PreparedFile = { filename: string; contentType: string; sizeBytes: number; data: Uint8Array };

export async function POST(request: Request) {
    if (!isSameOrigin(request.headers)) {
        return fail("Request not allowed.", 403);
    }
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
        return fail("Attachments are too large. Please keep them under 4 MB in total.", 413);
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return fail("Could not read the form. Please try again.", 400);
    }

    // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
    if (String(form.get("website") ?? "").trim() !== "") {
        return NextResponse.json({ ok: true });
    }

    const field = (name: string) => String(form.get(name) ?? "");
    const parsed = schema.safeParse({
        name: field("name"),
        company: field("company"),
        email: field("email"),
        country: field("country"),
        enquiry: field("enquiry"),
        timeline: field("timeline"),
        brief: field("brief"),
        source: field("source"),
        page: field("page"),
    });
    if (!parsed.success) {
        return fail(parsed.error.issues[0]?.message ?? "Please check the form and try again.", 400);
    }
    const data = parsed.data;

    const ipHash = hashIp(clientIp(request.headers));
    const recent = await prisma.enquiry.count({
        where: { ipHash, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    if (recent >= MAX_PER_IP_PER_HOUR) {
        return fail("Too many enquiries from this connection. Please try again later.", 429);
    }

    // Validate every file before anything is saved.
    const uploads = form.getAll("references").filter((item): item is File => item instanceof File && item.size > 0);
    if (uploads.length > MAX_FILES) {
        return fail(`Please attach at most ${MAX_FILES} files.`, 400);
    }
    if (uploads.length > 0 && !isStorageConfigured()) {
        return fail("Attachments are temporarily unavailable. Please send your message without files.", 503);
    }
    let total = 0;
    const files: PreparedFile[] = [];
    for (const upload of uploads) {
        if (upload.size > MAX_FILE_BYTES) {
            return fail("Each file must be under 3 MB.", 413);
        }
        total += upload.size;
        if (total > MAX_TOTAL_BYTES) {
            return fail("Attachments are too large. Please keep them under 4 MB in total.", 413);
        }
        const bytes = Buffer.from(await upload.arrayBuffer());
        const contentType = sniffType(bytes);
        if (!contentType) {
            return fail("Only JPG, PNG, WEBP or PDF files can be attached.", 400);
        }
        files.push({
            filename: upload.name.replace(/[^\w.\- ()]/g, "_").slice(-120) || "file",
            contentType,
            sizeBytes: bytes.length,
            data: new Uint8Array(bytes),
        });
    }

    // 1) Save the enquiry, which gives it its reference number (used to name the file folder).
    const enquiry = await prisma.enquiry.create({
        data: {
            name: data.name,
            company: data.company || null,
            email: data.email,
            country: data.country || null,
            enquiryType: data.enquiry || null,
            timeline: data.timeline || null,
            brief: data.brief,
            source: data.source === "contact" ? "CONTACT" : "POPUP",
            page: data.page || null,
            ipHash,
            userAgent: (request.headers.get("user-agent") ?? "").slice(0, 300),
        },
        select: { id: true, seq: true },
    });
    const reference = enquiryRef(enquiry.seq);

    // 2) Upload the files to R2. If anything fails, undo everything so no half-saved enquiry or stray file is left.
    if (files.length > 0) {
        const folder = enquiryFolder(reference);
        const settled = await Promise.allSettled(
            files.map(async (file) => {
                const storageKey = buildObjectKey(folder, file.filename, file.contentType);
                await uploadObject(storageKey, file.data, file.contentType);
                return { enquiryId: enquiry.id, storageKey, filename: file.filename, contentType: file.contentType, sizeBytes: file.sizeBytes };
            }),
        );
        const stored = settled.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));

        try {
            if (stored.length !== files.length) {
                throw new Error("One or more uploads failed.");
            }
            await prisma.enquiryFile.createMany({ data: stored });
        } catch (error) {
            console.error("[enquiry] Attachment upload failed, rolling back:", error instanceof Error ? error.message : error);
            await deleteObjects(stored.map((file) => file.storageKey)).catch((cleanupError) =>
                console.error("[enquiry] Could not remove uploaded files:", cleanupError),
            );
            await prisma.enquiry.delete({ where: { id: enquiry.id } }).catch(() => undefined);
            return fail("We could not upload your files. Please try again.", 502);
        }
    }

    // 3) Tell the team by email after the response is sent, so a slow mail service never delays the visitor.
    after(() =>
        sendEnquiryNotification({
            id: enquiry.id,
            reference,
            name: data.name,
            email: data.email,
            company: data.company || null,
            country: data.country || null,
            enquiryType: data.enquiry || null,
            timeline: data.timeline || null,
            brief: data.brief,
            source: data.source,
            files: files.map((file) => ({ filename: file.filename, sizeBytes: file.sizeBytes })),
        }),
    );

    return NextResponse.json({ ok: true, reference });
}
