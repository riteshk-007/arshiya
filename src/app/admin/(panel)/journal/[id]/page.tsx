import { notFound } from "next/navigation";
import { z } from "zod";
import { PostEditor, type EditablePost } from "@/components/admin/journal/post-editor";
import { asDoc } from "@/lib/journal/content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { isStorageConfigured, publicObjectUrl } from "@/lib/storage";

export const metadata = { title: "Edit article" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!z.uuid().safeParse(id).success) {
        notFound();
    }

    const [post, categoryRows] = await Promise.all([
        prisma.post.findUnique({ where: { id } }),
        prisma.post.findMany({ where: { category: { not: null } }, distinct: ["category"], select: { category: true } }),
    ]);
    if (!post) {
        notFound();
    }

    const editable: EditablePost = {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category ?? "",
        content: asDoc(post.content),
        coverKey: post.coverKey,
        coverUrl: publicObjectUrl(post.coverKey),
        coverAlt: post.coverAlt ?? "",
        seoTitle: post.seoTitle ?? "",
        seoDescription: post.seoDescription ?? "",
        status: post.status,
        publishedAt: post.publishedAt?.toISOString() ?? null,
    };

    return (
        <PostEditor
            // A fresh editor per article, so switching between articles never mixes content.
            key={post.id}
            post={editable}
            siteUrl={SITE_URL}
            categories={categoryRows.flatMap((row) => (row.category ? [row.category] : []))}
            storageReady={isStorageConfigured("public")}
        />
    );
}
