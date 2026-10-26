import Link from "next/link";
import { Paperclip } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";
import { StatusBadge } from "@/components/admin/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { enquiryRef, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type EnquiryResultsProps = {
    where: Prisma.EnquiryWhereInput;
    sort: "asc" | "desc";
    page: number;
    pageSize: number;
};

/** The list itself. Rendered inside <Suspense> so the page can show a skeleton meanwhile. */
export async function EnquiryResults({ where, sort, page, pageSize }: EnquiryResultsProps) {
    const rows = await prisma.enquiry.findMany({
        where,
        orderBy: [{ createdAt: sort }, { seq: sort }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
            id: true,
            seq: true,
            name: true,
            company: true,
            email: true,
            enquiryType: true,
            status: true,
            createdAt: true,
            _count: { select: { files: true } },
        },
    });

    if (rows.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    No enquiries match this view.
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            {/* Phones and small tablets: cards */}
            <ul className="space-y-3 md:hidden">
                {rows.map((item) => (
                    <li key={item.id}>
                        <Link href={`/admin/enquiries/${item.id}`} className="block">
                            <Card className="gap-2 py-4 transition-colors hover:bg-accent/50">
                                <CardContent className="space-y-2 px-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{item.name}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {item.company || item.email}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} className="shrink-0" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {enquiryRef(item.seq)} · {item.enquiryType ?? "General"}
                                        {item._count.files > 0 && (
                                            <span className="ml-2 inline-flex items-center gap-1">
                                                <Paperclip className="h-3 w-3" />
                                                {item._count.files}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Desktop: table. The whole row is clickable. */}
            <Card className="hidden py-0 md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6">Reference</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>Enquiry</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="pr-6 text-right">Received</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((item) => (
                            <TableRow key={item.id} className="relative cursor-pointer">
                                <TableCell className="pl-6">
                                    <Link
                                        href={`/admin/enquiries/${item.id}`}
                                        className="font-medium after:absolute after:inset-0 hover:underline"
                                    >
                                        {enquiryRef(item.seq)}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.company || item.email}</p>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {item.enquiryType ?? "General"}
                                    {item._count.files > 0 && (
                                        <span className="ml-2 inline-flex items-center gap-1 text-xs">
                                            <Paperclip className="h-3 w-3" />
                                            {item._count.files}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                                    {formatDateTime(item.createdAt)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}
