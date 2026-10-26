import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PostStatusBadgeProps = {
    status: "DRAFT" | "PUBLISHED";
    publishedAt: Date | null;
    className?: string;
};

/** Draft (grey), Scheduled (blue: published with a future date) or Published (green). */
export function PostStatusBadge({ status, publishedAt, className }: PostStatusBadgeProps) {
    const scheduled = status === "PUBLISHED" && publishedAt !== null && publishedAt.getTime() > Date.now();
    const label = status === "DRAFT" ? "Draft" : scheduled ? "Scheduled" : "Published";
    const style =
        status === "DRAFT"
            ? { badge: "border-slate-300 bg-slate-100 text-slate-700", dot: "bg-slate-400" }
            : scheduled
              ? { badge: "border-blue-300 bg-blue-100 text-blue-900", dot: "bg-blue-500" }
              : { badge: "border-emerald-300 bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" };

    return (
        <Badge variant="outline" className={cn("gap-1.5 font-medium", style.badge, className)}>
            <span aria-hidden className={cn("h-2 w-2 rounded-full", style.dot)} />
            {label}
        </Badge>
    );
}
