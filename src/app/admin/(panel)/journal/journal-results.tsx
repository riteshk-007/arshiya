import Link from "next/link";
import { ImageIcon } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { PostStatusBadge } from "@/components/admin/post-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { publicObjectUrl } from "@/lib/storage";

/** Small preview picture, or a neutral box when the article has no cover yet. */
function Thumb({ url }: { url: string | null }) {
    return url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-md border object-cover" loading="lazy" />
    ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
            <ImageIcon className="h-5 w-5" />
        </span>
    );
}

export async function JournalResults({ where, page, pageSize }: { where: Prisma.PostWhereInput; page: number; pageSize: number }) {
    const posts = await prisma.post.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, title: true, slug: true, category: true, coverKey: true, status: true, publishedAt: true, updatedAt: true },
    });

    if (posts.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    No articles yet. Click &ldquo;New article&rdquo; to write the first one.
                </CardContent>
            </Card>
        );
    }

    return (
        <ul className="space-y-3">
            {posts.map((post) => (
                <li key={post.id}>
                    <Link href={`/admin/journal/${post.id}`} className="block">
                        <Card className="py-3 transition-colors hover:bg-accent/50">
                            <CardContent className="flex items-center gap-4 px-4">
                                <Thumb url={publicObjectUrl(post.coverKey)} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">{post.title}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        /journal/{post.slug}
                                        {post.category ? ` · ${post.category}` : ""}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {post.status === "PUBLISHED" && post.publishedAt ? `Published ${formatDate(post.publishedAt)}` : `Edited ${formatDate(post.updatedAt)}`}
                                    </p>
                                </div>
                                <PostStatusBadge status={post.status} publishedAt={post.publishedAt} className="shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
