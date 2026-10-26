"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { asDoc, EMPTY_DOC, plainText, readingMinutes, referencedImageKeys } from "@/lib/journal/content";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/security";
import { deleteObjects, deletePrefix, isStorageConfigured } from "@/lib/storage";

const idSchema = z.uuid();
const RESERVED_SLUGS = new Set(["page", "feed", "feed-xml", "new", "admin"]);
/** Images removed from an article are cleaned up only after this long, so a second open tab can never lose a fresh upload. */
const ORPHAN_GRACE_MS = 60 * 60 * 1000;

async function assertSameOrigin() {
    if (!isSameOrigin(await headers())) {
        throw new Error("Request not allowed.");
    }
}

/** Public pages that show Journal content, refreshed right after any change (old and new address of the article). */
function refreshPublicPages(...slugs: (string | null | undefined)[]) {
    revalidatePath("/journal");
    revalidatePath("/journal/page/[page]", "page");
    revalidatePath("/journal/[slug]", "page");
    revalidatePath("/journal/feed.xml");
    revalidatePath("/sitemap.xml");
    for (const slug of new Set(slugs)) {
        if (slug) revalidatePath(`/journal/${slug}`);
    }
    revalidatePath("/admin/journal", "layout");
}

/** Creates an empty draft and opens the editor, so images can be uploaded against a real post from the start. */
export async function createPostAction() {
    await assertSameOrigin();
    await requireAdmin();
    const post = await prisma.post.create({
        data: {
            title: "Untitled article",
            slug: `untitled-${randomBytes(4).toString("hex")}`,
            excerpt: "",
            content: EMPTY_DOC as object,
        },
        select: { id: true },
    });
    redirect(`/admin/journal/${post.id}`);
}

const saveSchema = z.object({
    title: z.string().trim().min(1, "Please add a title.").max(140, "The title is too long (140 characters at most)."),
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, "The web address needs at least 3 characters.")
        .max(90, "The web address is too long.")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The web address can only use letters, numbers and single dashes.")
        .refine((slug) => !RESERVED_SLUGS.has(slug), "That web address is reserved. Please choose another."),
    excerpt: z.string().trim().max(320, "The summary is too long (320 characters at most)."),
    category: z.string().trim().max(120).nullable(),
    coverKey: z.string().max(300).nullable(),
    coverAlt: z.string().trim().max(200).nullable(),
    seoTitle: z.string().trim().max(70, "The search title is too long (70 characters at most).").nullable(),
    seoDescription: z.string().trim().max(170, "The search description is too long (170 characters at most).").nullable(),
    content: z.unknown(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    /** ISO date-time; only used when publishing. */
    publishedAt: z.string().datetime().nullable(),
});

export type SavePostInput = z.input<typeof saveSchema>;
export type SavePostResult =
    | { ok: true; savedAt: string; slug: string; status: "DRAFT" | "PUBLISHED"; readingMinutes: number }
    | { ok: false; error: string };

export async function savePostAction(id: string, input: SavePostInput): Promise<SavePostResult> {
    await assertSameOrigin();
    await requireAdmin();
    const postId = idSchema.safeParse(id);
    const parsed = saveSchema.safeParse(input);
    if (!postId.success) {
        return { ok: false, error: "Invalid request." };
    }
    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
    }
    const data = parsed.data;
    const doc = asDoc(data.content);

    // A cover can only be one of this post's own uploads.
    let cover: { width: number; height: number } | null = null;
    if (data.coverKey) {
        const image = await prisma.postImage.findFirst({
            where: { postId: postId.data, storageKey: data.coverKey },
            select: { width: true, height: true },
        });
        if (!image) {
            return { ok: false, error: "The cover image could not be found. Please upload it again." };
        }
        cover = image;
    }

    if (data.status === "PUBLISHED") {
        if (data.excerpt.length < 40) return { ok: false, error: "Add a short summary (at least 40 characters) before publishing." };
        if (!cover) return { ok: false, error: "Add a cover image before publishing." };
        if (plainText(doc).split(" ").filter(Boolean).length < 30) return { ok: false, error: "The article is too short to publish yet." };
        if (!data.coverAlt) return { ok: false, error: "Describe the cover image (alt text) before publishing. It helps search engines and screen readers." };
    }

    const existing = await prisma.post.findUnique({ where: { id: postId.data }, select: { publishedAt: true, slug: true } });
    if (!existing) {
        return { ok: false, error: "This article no longer exists." };
    }
    const publishedAt =
        data.status === "PUBLISHED" ? (data.publishedAt ? new Date(data.publishedAt) : (existing.publishedAt ?? new Date())) : existing.publishedAt;

    try {
        const post = await prisma.post.update({
            where: { id: postId.data },
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                category: data.category || null,
                coverKey: data.coverKey,
                coverWidth: cover?.width ?? null,
                coverHeight: cover?.height ?? null,
                coverAlt: data.coverAlt || null,
                seoTitle: data.seoTitle || null,
                seoDescription: data.seoDescription || null,
                content: doc as object,
                readingMinutes: readingMinutes(doc),
                status: data.status,
                publishedAt,
            },
            select: { slug: true, status: true, readingMinutes: true, updatedAt: true },
        });

        // Clean out images that were uploaded but are no longer used anywhere in the article.
        if (isStorageConfigured("public")) {
            const used = referencedImageKeys(doc);
            if (data.coverKey) used.add(data.coverKey);
            const stale = await prisma.postImage.findMany({
                where: {
                    postId: postId.data,
                    storageKey: { notIn: [...used] },
                    createdAt: { lt: new Date(Date.now() - ORPHAN_GRACE_MS) },
                },
                select: { id: true, storageKey: true },
            });
            if (stale.length > 0) {
                await deleteObjects(stale.map((image) => image.storageKey), "public");
                await prisma.postImage.deleteMany({ where: { id: { in: stale.map((image) => image.id) } } });
            }
        }

        refreshPublicPages(existing.slug, post.slug);
        return { ok: true, savedAt: post.updatedAt.toISOString(), slug: post.slug, status: post.status, readingMinutes: post.readingMinutes };
    } catch (error) {
        if (typeof error === "object" && error && "code" in error && (error as { code: string }).code === "P2002") {
            return { ok: false, error: "Another article already uses this web address. Please change it." };
        }
        console.error("[journal] Could not save article:", error instanceof Error ? error.message : error);
        return { ok: false, error: "Could not save. Please try again." };
    }
}

/** Removes the article's images from cloud storage first; if that fails nothing is deleted. */
export async function deletePostAction(id: string) {
    await assertSameOrigin();
    await requireAdmin();
    const postId = idSchema.safeParse(id);
    if (!postId.success) {
        throw new Error("Invalid request.");
    }

    const doomed = await prisma.post.findUnique({ where: { id: postId.data }, select: { slug: true } });
    const images = await prisma.postImage.findMany({ where: { postId: postId.data }, select: { storageKey: true } });
    if (images.length > 0) {
        if (!isStorageConfigured("public")) {
            throw new Error("Image storage is not configured, so the article's images cannot be removed. Nothing was deleted.");
        }
        await deleteObjects(images.map((image) => image.storageKey), "public");
        await deletePrefix(`journal/${postId.data}/`, "public");
    }
    await prisma.post.deleteMany({ where: { id: postId.data } });
    refreshPublicPages(doomed?.slug);
    redirect("/admin/journal");
}
