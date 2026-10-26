import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
    basePath: string;
    /** Current filters, kept in every page link. */
    params: Record<string, string | undefined>;
    page: number;
    pages: number;
};

function hrefFor(basePath: string, params: PaginationProps["params"], page: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value) query.set(key, value);
    }
    if (page > 1) query.set("page", String(page));
    const text = query.toString();
    return text ? `${basePath}?${text}` : basePath;
}

/** 1 … 4 5 [6] 7 8 … 20 */
function visiblePages(page: number, pages: number): (number | "gap")[] {
    const wanted = new Set([1, pages, page - 1, page, page + 1]);
    const sorted = [...wanted].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    const result: (number | "gap")[] = [];
    sorted.forEach((n, index) => {
        if (index > 0 && n - sorted[index - 1] > 1) result.push("gap");
        result.push(n);
    });
    return result;
}

export function Pagination({ basePath, params, page, pages }: PaginationProps) {
    if (pages <= 1) {
        return null;
    }

    return (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-2">
            <Button asChild variant="outline" size="sm" className={cn(page <= 1 && "pointer-events-none opacity-50")}>
                <Link href={hrefFor(basePath, params, page - 1)} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </Link>
            </Button>

            {/* Phones: short "Page x of y". Larger screens: numbered pages. */}
            <span className="text-sm text-muted-foreground sm:hidden">
                Page {page} of {pages}
            </span>
            <ul className="hidden items-center gap-1 sm:flex">
                {visiblePages(page, pages).map((item, index) =>
                    item === "gap" ? (
                        <li key={`gap-${index}`} className="px-1 text-muted-foreground">
                            …
                        </li>
                    ) : (
                        <li key={item}>
                            <Button asChild variant={item === page ? "default" : "ghost"} size="sm" className="h-9 min-w-9 px-2">
                                <Link href={hrefFor(basePath, params, item)} aria-current={item === page ? "page" : undefined}>
                                    {item}
                                </Link>
                            </Button>
                        </li>
                    ),
                )}
            </ul>

            <Button asChild variant="outline" size="sm" className={cn(page >= pages && "pointer-events-none opacity-50")}>
                <Link href={hrefFor(basePath, params, page + 1)} aria-disabled={page >= pages} tabIndex={page >= pages ? -1 : undefined}>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
        </nav>
    );
}
