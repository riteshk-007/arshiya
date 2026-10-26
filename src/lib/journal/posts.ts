import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const JOURNAL_PAGE_SIZE = 9;

/** Only posts that are published and whose publish time has arrived are public. */
const isLive = (): Prisma.PostWhereInput => ({ status: "PUBLISHED", publishedAt: { lte: new Date() } });

const cardSelect = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    category: true,
    coverKey: true,
    coverWidth: true,
    coverHeight: true,
    coverAlt: true,
    publishedAt: true,
    readingMinutes: true,
} satisfies Prisma.PostSelect;

export type PostCard = Prisma.PostGetPayload<{ select: typeof cardSelect }>;

export async function getLivePosts(page: number) {
    try {
        return await queryLivePosts(page);
    } catch (error) {
        // While the site is being built the database may not be reachable; show an empty list and refresh soon.
        if (process.env.NEXT_PHASE === "phase-production-build") {
            return { posts: [] as PostCard[], total: 0, pages: 1 };
        }
        throw error;
    }
}

async function queryLivePosts(page: number) {
    const where = isLive();
    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
            skip: (page - 1) * JOURNAL_PAGE_SIZE,
            take: JOURNAL_PAGE_SIZE,
            select: cardSelect,
        }),
        prisma.post.count({ where }),
    ]);
    return { posts, total, pages: Math.max(1, Math.ceil(total / JOURNAL_PAGE_SIZE)) };
}

/** Cached per request, so the page and its metadata share one query. */
export const getLivePost = cache(async (slug: string) =>
    prisma.post.findFirst({ where: { slug, ...isLive() } }),
);

export async function getRelatedPosts(postId: string, category: string | null, limit = 3) {
    const base = { ...isLive(), id: { not: postId } };
    const sameCategory = category
        ? await prisma.post.findMany({
              where: { ...base, category: { contains: category.split(",")[0].trim(), mode: "insensitive" } },
              orderBy: { publishedAt: "desc" },
              take: limit,
              select: cardSelect,
          })
        : [];
    if (sameCategory.length >= limit) {
        return sameCategory;
    }
    const others = await prisma.post.findMany({
        where: { ...base, id: { not: postId, notIn: sameCategory.map((post) => post.id) } },
        orderBy: { publishedAt: "desc" },
        take: limit - sameCategory.length,
        select: cardSelect,
    });
    return [...sameCategory, ...others];
}

/** Newer and older neighbours for the "Previous / Next" links. */
export async function getNeighbours(publishedAt: Date) {
    const [newer, older] = await Promise.all([
        prisma.post.findFirst({
            where: { ...isLive(), publishedAt: { gt: publishedAt, lte: new Date() } },
            orderBy: { publishedAt: "asc" },
            select: { slug: true, title: true },
        }),
        prisma.post.findFirst({
            where: { ...isLive(), publishedAt: { lt: publishedAt } },
            orderBy: { publishedAt: "desc" },
            select: { slug: true, title: true },
        }),
    ]);
    return { newer, older };
}

export async function getSitemapPosts() {
    return prisma.post.findMany({
        where: isLive(),
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
    });
}
