import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createCategoryAction, loadDefaultCategoriesAction } from "@/app/admin/categories/actions";
import { prisma } from "@/lib/prisma";
import { categoryImageUrl } from "@/lib/site-categories";

export const metadata = { title: "Categories" };

export default async function CategoriesAdminPage() {
    const rows = await prisma.siteCategory.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, slug: true, title: true, summary: true, imageSrc: true, active: true, sortOrder: true },
    });

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
                    <p className="text-sm text-muted-foreground">
                        The service pages shown on the home page, in the menu and as their own pages. Edit the picture, text and details of each.
                    </p>
                </div>
                <form action={createCategoryAction}>
                    <Button type="submit" className="h-10">
                        <Plus className="h-4 w-4" /> New category
                    </Button>
                </form>
            </div>

            {rows.length === 0 ? (
                <Card>
                    <CardContent className="space-y-4 py-10 text-center">
                        <p className="text-sm text-muted-foreground">
                            Nothing is saved here yet, so the website is showing its four built-in categories (Haute Couture, Bridal, Couture Accessories and Half-Scale).
                            Load them to start editing them here.
                        </p>
                        <form action={loadDefaultCategoriesAction}>
                            <Button type="submit">Load the 4 default categories</Button>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <ul className="space-y-3">
                    {rows.map((row) => {
                        const image = categoryImageUrl(row.imageSrc);
                        return (
                            <li key={row.id}>
                                <Link href={`/admin/categories/${row.id}`} className="block">
                                    <Card className="py-3 transition-colors hover:bg-accent/50">
                                        <CardContent className="flex items-center gap-4 px-4">
                                            {image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={image} alt="" className="h-16 w-14 shrink-0 rounded-md border object-cover" loading="lazy" />
                                            ) : (
                                                <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                                                    <ImageIcon className="h-5 w-5" />
                                                </span>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium">{row.title}</p>
                                                <p className="truncate text-xs text-muted-foreground">/{row.slug}</p>
                                                <p className="mt-1 truncate text-xs text-muted-foreground">{row.summary}</p>
                                            </div>
                                            <div className="flex shrink-0 flex-col items-end gap-1">
                                                <Badge variant={row.active ? "default" : "secondary"}>{row.active ? "Shown" : "Hidden"}</Badge>
                                                <span className="text-xs text-muted-foreground">Order {row.sortOrder}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
