import Link from "next/link";
import { ArrowRight, CalendarDays, CircleDot, Inbox, Loader } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enquiryRef, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
    const [grouped, lastWeek, recent] = await Promise.all([
        prisma.enquiry.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.enquiry.count({ where: { createdAt: { gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
        prisma.enquiry.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            select: { id: true, seq: true, name: true, company: true, enquiryType: true, status: true, createdAt: true },
        }),
    ]);

    const byStatus = Object.fromEntries(grouped.map((row) => [row.status, row._count._all]));
    const total = grouped.reduce((sum, row) => sum + row._count._all, 0);

    const stats = [
        { label: "Total enquiries", value: total, icon: Inbox, tone: "text-foreground" },
        { label: "New", value: byStatus.NEW ?? 0, icon: CircleDot, tone: "text-orange-600" },
        { label: "In progress", value: byStatus.IN_PROGRESS ?? 0, icon: Loader, tone: "text-blue-600" },
        { label: "Last 7 days", value: lastWeek, icon: CalendarDays, tone: "text-foreground" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Enquiries from the website forms.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {stats.map(({ label, value, icon: Icon, tone }) => (
                    <Card key={label} className="gap-2 py-4">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                            <Icon className={`h-4 w-4 ${tone}`} />
                        </CardHeader>
                        <CardContent className="px-4">
                            <p className={`text-3xl font-semibold tabular-nums ${tone}`}>{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Latest enquiries</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/enquiries">
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="px-0">
                    {recent.length === 0 ? (
                        <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                            No enquiries yet. They will appear here as soon as someone submits a form.
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {recent.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={`/admin/enquiries/${item.id}`}
                                        className="flex items-center justify-between gap-3 px-6 py-3 hover:bg-accent/60"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {item.name}
                                                {item.company ? ` · ${item.company}` : ""}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {enquiryRef(item.seq)} · {item.enquiryType ?? "General"} ·{" "}
                                                {formatDateTime(item.createdAt)}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} className="shrink-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
