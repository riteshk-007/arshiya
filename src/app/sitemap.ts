import type { MetadataRoute } from "next";
import { categories } from "@/components/home/categories";
import { getSitemapPosts } from "@/lib/journal/posts";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

/** Public pages only. Admin and API routes are deliberately never listed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  // The sitemap must never fail because of the database, so articles are optional here.
  const posts = await getSitemapPosts().catch(() => []);

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/journal"), lastModified, changeFrequency: "daily", priority: 0.8 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/journal/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
