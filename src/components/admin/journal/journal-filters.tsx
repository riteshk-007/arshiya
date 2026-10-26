"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;

const tabs = [
    { value: "", label: "All", dot: "" },
    { value: "draft", label: "Drafts", dot: "bg-slate-400" },
    { value: "published", label: "Published", dot: "bg-emerald-500" },
];

type JournalFiltersProps = {
    q: string;
    status: string;
    counts: { all: number; draft: number; published: number };
    total: number;
};

/** Search and status live in the URL. Typing is debounced and every change returns to page 1. */
export function JournalFilters({ q, status, counts, total }: JournalFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [text, setText] = useState(q);

    function update(patch: Record<string, string | undefined>) {
        const next = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(patch)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        next.delete("page");
        const query = next.toString();
        startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
    }

    useEffect(() => setText(q), [q]);

    useEffect(() => {
        if (text.trim() === q) return;
        const timer = window.setTimeout(() => update({ q: text.trim() || undefined }), SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    return (
        <div className="space-y-3" aria-busy={pending}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Search by title or summary"
                    aria-label="Search articles"
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

            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => {
                        const active = status === tab.value;
                        const count = tab.value === "" ? counts.all : counts[tab.value as "draft" | "published"];

                        return (
                            <button
                                key={tab.value || "all"}
                                type="button"
                                aria-pressed={active}
                                onClick={() => update({ status: tab.value || undefined })}
                                className={cn(
                                    "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-sm transition-colors",
                                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {tab.dot && <span className={cn("h-2 w-2 rounded-full", tab.dot)} />}
                                {tab.label} <span className="text-xs opacity-70">{count}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                    {total} result{total === 1 ? "" : "s"}
                </p>
            </div>
        </div>
    );
}
