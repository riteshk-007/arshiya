import { notFound } from "next/navigation";
import { z } from "zod";
import { CategoryEditor, type EditableCategory } from "@/components/admin/categories/category-editor";
import { asDoc } from "@/lib/journal/content";
import { prisma } from "@/lib/prisma";
import { categoryImageUrl } from "@/lib/site-categories";
import { isStorageConfigured } from "@/lib/storage";

export const metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!z.uuid().safeParse(id).success) {
        notFound();
    }
    const row = await prisma.siteCategory.findUnique({ where: { id } });
    if (!row) {
        notFound();
    }

    const category: EditableCategory = {
        id: row.id,
        slug: row.slug,
        icon: row.icon,
        title: row.title,
        navLabel: row.navLabel ?? "",
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        summary: row.summary,
        imageSrc: row.imageSrc,
        imageUrl: categoryImageUrl(row.imageSrc),
        imagePosition: row.imagePosition,
        alt: row.alt ?? "",
        heading: row.heading,
        content: asDoc(row.content),
        note: row.note,
        ctaLabel: row.ctaLabel,
        sortOrder: row.sortOrder,
        active: row.active,
    };

    return <CategoryEditor category={category} storageReady={isStorageConfigured("public")} />;
}
