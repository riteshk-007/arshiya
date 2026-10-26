"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { asDoc, EMPTY_DOC, referencedImageKeys } from "@/lib/journal/content";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/security";
import { ICON_NAMES } from "@/lib/category-options";
import { CATEGORY_CACHE_TAG, RESERVED_CATEGORY_SLUGS, defaultCategoryRows } from "@/lib/site-categories";
import { deleteObjects, deletePrefix, isStorageConfigured } from "@/lib/storage";

const idSchema = z.uuid();

async function assertSameOrigin() {
    if (!isSameOrigin(await headers())) {
        throw new Error("Request not allowed.");
    }
}

/** Public pages that show categories, refreshed right after any change. */
function refreshPublicPages(...slugs: (string | null | undefined)[]) {
    revalidateTag(CATEGORY_CACHE_TAG);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    for (const slug of new Set(slugs)) {
        if (slug) revalidatePath(`/${slug}`);
    }
    revalidatePath("/admin/categories", "layout");
}

/** Whether a stored image is one of our own uploads (a bucket key) and not a file shipped with the site. */
const isBucketKey = (value: string | null | undefined): value is string => Boolean(value) && !value!.startsWith("/");

/** Adds the four original categories, so an admin can start from them. Does nothing if any exist. */
export async function loadDefaultCategoriesAction() {
    await assertSameOrigin();
    await requireAdmin();
    if ((await prisma.siteCategory.count()) === 0) {
        await prisma.siteCategory.createMany({ data: defaultCategoryRows() });
    }
    refreshPublicPages();
    redirect("/admin/categories");
}

export async function createCategoryAction() {
    await assertSameOrigin();
    await requireAdmin();
    const last = await prisma.siteCategory.aggregate({ _max: { sortOrder: true } });
    const category = await prisma.siteCategory.create({
        data: {
            slug: `new-category-${randomBytes(3).toString("hex")}`,
            title: "New category",
            content: EMPTY_DOC as object,
            sortOrder: (last._max.sortOrder ?? 0) + 1,
            active: false,
        },
        select: { id: true },
    });
    redirect(`/admin/categories/${category.id}`);
}

const saveSchema = z.object({
    title: z.string().trim().min(2, "Please add a name.").max(60, "The name is too long (60 characters at most)."),
    navLabel: z.string().trim().max(30, "The menu name is too long (30 characters at most).").nullable(),
    slug: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, "The web address needs at least 3 characters.")
        .max(60, "The web address is too long.")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The web address can only use letters, numbers and single dashes.")
        .refine((slug) => !RESERVED_CATEGORY_SLUGS.has(slug), "That web address is used by another page. Please choose another."),
    icon: z.string().refine((value) => (ICON_NAMES as string[]).includes(value), "Please choose an icon."),
    summary: z.string().trim().max(120, "The home page line is too long (120 characters at most)."),
    imageSrc: z.string().max(300).nullable(),
    imagePosition: z.string().regex(/^[a-z0-9% ]{3,30}$/, "Invalid picture position."),
    alt: z.string().trim().max(200).nullable(),
    heading: z.string().trim().max(120, "The page heading is too long (120 characters at most)."),
    content: z.unknown(),
    note: z.string().trim().max(160, "The closing line is too long (160 characters at most)."),
    ctaLabel: z.string().trim().min(2, "Please add the button text.").max(50, "The button text is too long (50 characters at most)."),
    seoTitle: z.string().trim().max(70, "The search title is too long (70 characters at most).").nullable(),
    seoDescription: z.string().trim().max(170, "The search description is too long (170 characters at most).").nullable(),
    sortOrder: z.number().int().min(0).max(999),
    active: z.boolean(),
});

export type SaveCategoryInput = z.input<typeof saveSchema>;
export type SaveCategoryResult = { ok: true; savedAt: string; slug: string } | { ok: false; error: string };

export async function saveCategoryAction(id: string, input: SaveCategoryInput): Promise<SaveCategoryResult> {
    await assertSameOrigin();
    await requireAdmin();
    const categoryId = idSchema.safeParse(id);
    const parsed = saveSchema.safeParse(input);
    if (!categoryId.success) {
        return { ok: false, error: "Invalid request." };
    }
    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
    }
    const data = parsed.data;
    const doc = asDoc(data.content);

    const existing = await prisma.siteCategory.findUnique({ where: { id: categoryId.data }, select: { slug: true, imageSrc: true, content: true } });
    if (!existing) {
        return { ok: false, error: "This category no longer exists." };
    }
    if (data.active) {
        if (!data.imageSrc) return { ok: false, error: "Add a picture before showing this category on the website." };
        if (!data.alt) return { ok: false, error: "Describe the picture (alt text) before showing this category. It helps search engines and screen readers." };
        if (!data.summary) return { ok: false, error: "Add the short line for the home page card." };
    }
    // A picture must be one of this category's own uploads, or one of the files shipped with the site.
    if (isBucketKey(data.imageSrc) && !data.imageSrc.startsWith(`categories/${categoryId.data}/`)) {
        return { ok: false, error: "The picture could not be found. Please upload it again." };
    }

    try {
        const category = await prisma.siteCategory.update({
            where: { id: categoryId.data },
            data: {
                title: data.title,
                navLabel: data.navLabel || null,
                slug: data.slug,
                icon: data.icon,
                summary: data.summary,
                imageSrc: data.imageSrc,
                imagePosition: data.imagePosition,
                alt: data.alt || null,
                heading: data.heading,
                content: doc as object,
                note: data.note,
                ctaLabel: data.ctaLabel,
                seoTitle: data.seoTitle || null,
                seoDescription: data.seoDescription || null,
                sortOrder: data.sortOrder,
                active: data.active,
            },
            select: { slug: true, updatedAt: true },
        });

        // Delete files that are no longer used: a replaced main picture and pictures removed from the text.
        if (isStorageConfigured("public")) {
            const stillUsed = new Set([...referencedImageKeys(doc), ...(isBucketKey(data.imageSrc) ? [data.imageSrc] : [])]);
            const before = new Set([...referencedImageKeys(asDoc(existing.content)), ...(isBucketKey(existing.imageSrc) ? [existing.imageSrc] : [])]);
            const gone = [...before].filter((key) => !stillUsed.has(key));
            if (gone.length > 0) {
                await deleteObjects(gone, "public").catch((error) =>
                    console.error("[categories] Could not remove old pictures:", error instanceof Error ? error.message : error),
                );
            }
        }

        refreshPublicPages(existing.slug, category.slug);
        return { ok: true, savedAt: category.updatedAt.toISOString(), slug: category.slug };
    } catch (error) {
        if (typeof error === "object" && error && "code" in error && (error as { code: string }).code === "P2002") {
            return { ok: false, error: "Another category already uses this web address. Please change it." };
        }
        console.error("[categories] Could not save:", error instanceof Error ? error.message : error);
        return { ok: false, error: "Could not save. Please try again." };
    }
}

/** Removes the category and its pictures from cloud storage first; if that fails nothing is deleted. */
export async function deleteCategoryAction(id: string) {
    await assertSameOrigin();
    await requireAdmin();
    const categoryId = idSchema.safeParse(id);
    if (!categoryId.success) {
        throw new Error("Invalid request.");
    }
    const doomed = await prisma.siteCategory.findUnique({ where: { id: categoryId.data }, select: { slug: true, imageSrc: true } });
    if (doomed && (isBucketKey(doomed.imageSrc) || isStorageConfigured("public"))) {
        if (!isStorageConfigured("public")) {
            throw new Error("Image storage is not configured, so the pictures cannot be removed. Nothing was deleted.");
        }
        await deletePrefix(`categories/${categoryId.data}/`, "public");
    }
    await prisma.siteCategory.deleteMany({ where: { id: categoryId.data } });
    refreshPublicPages(doomed?.slug);
    redirect("/admin/categories");
}
