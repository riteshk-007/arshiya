"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ENQUIRY_TYPES } from "@/lib/enquiry-types";
import { ENQUIRY_STATUSES, STATUS_LABELS, STATUS_STYLES, statusToParam, type EnquiryStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;
const ALL = "all";

type EnquiryFiltersProps = {
    q: string;
    status: EnquiryStatus | undefined;
    type: string;
    source: string;
    sort: string;
    /** Number of enquiries per status for the current search/type/source. */
    counts: Partial<Record<EnquiryStatus, number>>;
    total: number;
};

/**
 * Search and filters live in the URL, so a filtered list can be bookmarked or shared.
 * Typing is debounced; every change goes back to page 1.
 */
export function EnquiryFilters({ q, status, type, source, sort, counts, total }: EnquiryFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [text, setText] = useState(q);

    function update(patch: Record<string, string | undefined>) {
        const next = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(patch)) {
            if (value && value !== ALL) next.set(key, value);
            else next.delete(key);
        }
        next.delete("page");
        const query = next.toString();
        startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    }

    // Keep the box in sync when the URL changes from outside (back button, clear filters).
    useEffect(() => setText(q), [q]);

    useEffect(() => {
        if (text.trim() === q) {
            return;
        }
        const timer = window.setTimeout(() => update({ q: text.trim() || undefined }), SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(timer);
        // `update` only reads the latest search params; re-running on `text` is what we want.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const hasFilters = Boolean(q || status || type || source || sort === "asc");

    return (
        <div className="space-y-3" aria-busy={pending}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Search name, email, company or message"
                    aria-label="Search enquiries"
                    maxLength={100}
                    className="h-11 pl-9 pr-10"
                />
                {pending ? (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : text ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                            setText("");
                            update({ q: undefined });
                        }}
                        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null}
            </div>

            {/* Status chips: each status keeps its own colour */}
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
                <button
                    type="button"
                    onClick={() => update({ status: undefined })}
                    aria-pressed={!status}
                    className={cn(
                        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors",
                        !status ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                >
                    All <span className="text-xs opacity-70">{Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0)}</span>
                </button>
                {ENQUIRY_STATUSES.map((value) => {
                    const active = status === value;

                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => update({ status: statusToParam(value) })}
                            aria-pressed={active}
                            className={cn(
                                "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors",
                                active ? STATUS_STYLES[value].badge : "bg-card text-muted-foreground hover:text-foreground",
                                active && "ring-1 ring-current/30",
                            )}
                        >
                            <span className={cn("h-2 w-2 rounded-full", STATUS_STYLES[value].dot)} />
                            {STATUS_LABELS[value]}
                            <span className="text-xs opacity-70">{counts[value] ?? 0}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <Select value={type || ALL} onValueChange={(value) => update({ type: value })}>
                    <SelectTrigger className="h-10 w-full sm:w-56" aria-label="Filter by enquiry type">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All enquiry types</SelectItem>
                        {ENQUIRY_TYPES.map((value) => (
                            <SelectItem key={value} value={value}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={source || ALL} onValueChange={(value) => update({ source: value })}>
                    <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Filter by form">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All forms</SelectItem>
                        <SelectItem value="popup">Enquiry popup</SelectItem>
                        <SelectItem value="contact">Contact page</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sort === "asc" ? "asc" : "desc"} onValueChange={(value) => update({ sort: value === "asc" ? "asc" : undefined })}>
                    <SelectTrigger className="h-10 w-full sm:w-40" aria-label="Sort order">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest first</SelectItem>
                        <SelectItem value="asc">Oldest first</SelectItem>
                    </SelectContent>
                </Select>

                <div className="col-span-2 flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                    <p className="text-sm text-muted-foreground" aria-live="polite">
                        {total} result{total === 1 ? "" : "s"}
                    </p>
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setText("");
                                startTransition(() => router.replace(pathname, { scroll: false }));
                            }}
                        >
                            <X className="h-4 w-4" /> Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
