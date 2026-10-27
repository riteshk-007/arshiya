import { unstable_cache } from "next/cache";
import { defaultCategories } from "@/components/home/categories";
import type { IconName } from "@/components/home/Icon";
import { asDoc, plainText, renderArticleHtml, type JSONContent } from "@/lib/journal/content";
import { ICON_NAMES } from "@/lib/category-options";
import { prisma } from "@/lib/prisma";
import { publicObjectUrl } from "@/lib/storage";

export const CATEGORY_CACHE_TAG = "site-categories";

/** Everything a public page needs to show one category. */
export type PublicCategory = {
    slug: string;
    icon: IconName;
    title: string;
    /** Short name for the top menu. */
    navLabel: string;
    seoTitle: string;
    description: string;
    summary: string;
    imageUrl: string;
    /** CSS object-position, e.g. "center 55%". */
    imagePosition: string;
    alt: string;
    heading: string;
    /** Already-safe HTML of the details text. */
    bodyHtml: string;
    note: string;
    ctaLabel: string;
};


/** Slugs that already belong to other pages of the website. */
export const RESERVED_CATEGORY_SLUGS = new Set([
    "about", "contact", "journal", "admin", "api", "sitemap", "robots", "feed", "new", "login", "_next", "favicon", "icon", "opengraph-image",
]);

const SHORT_LABELS: Record<string, string> = { "haute-couture": "Haute Couture", bridal: "Bridal", accessories: "Accessories", "half-scale": "Half-Scale" };

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** Old class-style positions ("object-[center_55%]") to a CSS value. */
const toPosition = (value: string) => (value.startsWith("object-") ? value.replace(/^object-\[?/, "").replace(/\]$/, "").replace(/_/g, " ") : value);

/** The built-in four, used when nothing has been saved in the database yet. */
export function fallbackCategories(): PublicCategory[] {
    return defaultCategories.map((item) => ({
        slug: item.slug,
        icon: item.icon,
        title: item.title,
        navLabel: SHORT_LABELS[item.slug] ?? item.title,
        seoTitle: item.seoTitle,
        description: `${item.paragraphs[0]} ${item.paragraphs[1]}`,
        summary: item.summary,
        imageUrl: item.image,
        imagePosition: toPosition(item.imagePosition),
        alt: item.alt,
        heading: item.heading,
        bodyHtml: item.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
        note: item.note,
        ctaLabel: item.ctaLabel,
    }));
}

/** The four defaults as rows to insert, so an admin can start from them. */
export function defaultCategoryRows() {
    return defaultCategories.map((item, index) => ({
        slug: item.slug,
        icon: item.icon,
        title: item.title,
        navLabel: SHORT_LABELS[item.slug] ?? item.title,
        seoTitle: item.seoTitle,
        seoDescription: `${item.paragraphs[0]} ${item.paragraphs[1]}`.slice(0, 170),
        summary: item.summary,
        imageSrc: item.image,
        imagePosition: toPosition(item.imagePosition),
        alt: item.alt,
        heading: item.heading,
        content: {
            type: "doc",
            content: item.paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
        } as object,
        note: item.note,
        ctaLabel: item.ctaLabel,
        sortOrder: index + 1,
    }));
}

/** Address of a stored image: a file in /public, or an object in the public bucket. */
export function categoryImageUrl(imageSrc: string | null | undefined) {
    if (!imageSrc) return "";
    return imageSrc.startsWith("/") ? imageSrc : (publicObjectUrl(imageSrc) ?? "");
}

async function loadCategories(): Promise<PublicCategory[]> {
    let rows;
    try {
        rows = await prisma.siteCategory.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
    } catch (error) {
        console.error("[categories] Could not read categories, showing the defaults:", error instanceof Error ? error.message : error);
        return fallbackCategories();
    }
    // Nothing switched on yet (empty, or only hidden drafts): keep the original four so the site is never empty.
    if (rows.length === 0) {
        return fallbackCategories();
    }

    return rows.map((row) => {
        const doc: JSONContent = asDoc(row.content);
        return {
            slug: row.slug,
            icon: (ICON_NAMES as string[]).includes(row.icon) ? (row.icon as IconName) : "couture",
            title: row.title,
            navLabel: row.navLabel || row.title,
            seoTitle: row.seoTitle || row.title,
            description: row.seoDescription || plainText(doc).slice(0, 160),
            summary: row.summary,
            imageUrl: categoryImageUrl(row.imageSrc),
            imagePosition: row.imagePosition,
            alt: row.alt || row.title,
            heading: row.heading || row.title,
            bodyHtml: renderArticleHtml(doc),
            note: row.note,
            ctaLabel: row.ctaLabel,
        };
    });
}

/** Shared by the home page, menu, footer, sitemap and category pages. Refreshed whenever an admin saves. */
export const getSiteCategories = unstable_cache(loadCategories, ["site-categories-v1"], { tags: [CATEGORY_CACHE_TAG], revalidate: 600 });

export async function getSiteCategory(slug: string) {
    return (await getSiteCategories()).find((item) => item.slug === slug);
}
