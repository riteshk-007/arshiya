import { Suspense } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { EnquiryFilters } from "@/components/admin/enquiry-filters";
import { Pagination } from "@/components/admin/pagination";
import { ListSkeleton } from "@/components/admin/skeletons";
import { ENQUIRY_TYPES } from "@/lib/enquiry-types";
import { prisma } from "@/lib/prisma";
import { statusFromParam, statusToParam } from "@/lib/status";
import { EnquiryResults } from "./enquiry-results";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 15;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function EnquiriesPage({ searchParams }: { searchParams: SearchParams }) {
    const raw = await searchParams;
    const q = first(raw.q).trim().slice(0, 100);
    const status = statusFromParam(first(raw.status));
    const type = (ENQUIRY_TYPES as readonly string[]).includes(first(raw.type)) ? first(raw.type) : "";
    const source = ["popup", "contact"].includes(first(raw.source)) ? first(raw.source) : "";
    const sort = first(raw.sort) === "asc" ? "asc" : "desc";
    const requestedPage = Math.max(1, Math.min(10_000, Number.parseInt(first(raw.page), 10) || 1));

    // Everything except the status, so the status chips can show how many each one would return.
    const base: Prisma.EnquiryWhereInput = {
        ...(type && { enquiryType: type }),
        ...(source && { source: source === "contact" ? "CONTACT" : "POPUP" }),
        ...(q && {
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
                { brief: { contains: q, mode: "insensitive" } },
            ],
        }),
    };
    const where: Prisma.EnquiryWhereInput = { ...base, ...(status && { status }) };

    const [grouped, total] = await Promise.all([
        prisma.enquiry.groupBy({ by: ["status"], where: base, _count: { _all: true } }),
        prisma.enquiry.count({ where }),
    ]);
    const counts = Object.fromEntries(grouped.map((row) => [row.status, row._count._all]));
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(requestedPage, pages);

    const params = {
        q: q || undefined,
        status: status ? statusToParam(status) : undefined,
        type: type || undefined,
        source: source || undefined,
        sort: sort === "asc" ? "asc" : undefined,
    };
    // A new key per view shows the skeleton while the next results load.
    const viewKey = JSON.stringify({ ...params, page });

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Enquiries</h1>
                <p className="text-sm text-muted-foreground">Everything sent through the website forms.</p>
            </div>

            <EnquiryFilters q={q} status={status} type={type} source={source} sort={sort} counts={counts} total={total} />

            <Suspense key={viewKey} fallback={<ListSkeleton rows={6} />}>
                <EnquiryResults where={where} sort={sort} page={page} pageSize={PAGE_SIZE} />
            </Suspense>

            <Pagination basePath="/admin/enquiries" params={params} page={page} pages={pages} />
        </div>
    );
}
