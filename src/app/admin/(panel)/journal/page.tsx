import { Suspense } from "react";
import { Plus } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { JournalFilters } from "@/components/admin/journal/journal-filters";
import { Pagination } from "@/components/admin/pagination";
import { ListSkeleton } from "@/components/admin/skeletons";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { createPostAction } from "@/app/admin/journal/actions";
import { JournalResults } from "./journal-results";

export const metadata = { title: "Journal" };

const PAGE_SIZE = 12;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function JournalAdminPage({ searchParams }: { searchParams: SearchParams }) {
    const raw = await searchParams;
    const q = first(raw.q).trim().slice(0, 100);
    const status = ["draft", "published"].includes(first(raw.status)) ? first(raw.status) : "";
    const requestedPage = Math.max(1, Math.min(10_000, Number.parseInt(first(raw.page), 10) || 1));

    const search: Prisma.PostWhereInput = q
        ? {
              OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { excerpt: { contains: q, mode: "insensitive" } },
                  { slug: { contains: q, mode: "insensitive" } },
              ],
          }
        : {};
    const where: Prisma.PostWhereInput = { ...search, ...(status && { status: status === "draft" ? "DRAFT" : "PUBLISHED" }) };

    const [grouped, total] = await Promise.all([
        prisma.post.groupBy({ by: ["status"], where: search, _count: { _all: true } }),
        prisma.post.count({ where }),
    ]);
    const counts = {
        draft: grouped.find((row) => row.status === "DRAFT")?._count._all ?? 0,
        published: grouped.find((row) => row.status === "PUBLISHED")?._count._all ?? 0,
        all: grouped.reduce((sum, row) => sum + row._count._all, 0),
    };
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(requestedPage, pages);
    const viewKey = JSON.stringify({ q, status, page });

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
                    <p className="text-sm text-muted-foreground">Articles shown on the website&apos;s Journal.</p>
                </div>
                <form action={createPostAction}>
                    <Button type="submit" className="h-10">
                        <Plus className="h-4 w-4" /> New article
                    </Button>
                </form>
            </div>

            <JournalFilters q={q} status={status} counts={counts} total={total} />

            <Suspense key={viewKey} fallback={<ListSkeleton rows={5} />}>
                <JournalResults where={where} page={page} pageSize={PAGE_SIZE} />
            </Suspense>

            <Pagination basePath="/admin/journal" params={{ q: q || undefined, status: status || undefined }} page={page} pages={pages} />
        </div>
    );
}
