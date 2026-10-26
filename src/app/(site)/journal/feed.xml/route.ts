import { getLivePosts } from "@/lib/journal/posts";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";
import { publicObjectUrl } from "@/lib/storage";

export const revalidate = 600;

const escapeXml = (value: string) =>
    value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);

/** RSS feed of the latest articles, for readers and aggregators. */
export async function GET() {
    const { posts } = await getLivePosts(1);

    const items = posts
        .map((post) => {
            const cover = publicObjectUrl(post.coverKey);
            return `<item>
<title>${escapeXml(post.title)}</title>
<link>${absoluteUrl(`/journal/${post.slug}`)}</link>
<guid isPermaLink="true">${absoluteUrl(`/journal/${post.slug}`)}</guid>
<pubDate>${(post.publishedAt ?? new Date()).toUTCString()}</pubDate>
${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
<description>${escapeXml(post.excerpt)}</description>
${cover ? `<enclosure url="${escapeXml(cover)}" type="image/webp" length="0" />` : ""}
</item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(`${SITE_NAME} Journal`)}</title>
<link>${absoluteUrl("/journal")}</link>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<language>en</language>
<atom:link href="${absoluteUrl("/journal/feed.xml")}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
    });
}
