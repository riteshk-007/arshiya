import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_STYLES, type EnquiryStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusDot({ status, className }: { status: EnquiryStatus; className?: string }) {
    return <span aria-hidden className={cn("inline-block h-2 w-2 shrink-0 rounded-full", STATUS_STYLES[status].dot, className)} />;
}

export function StatusBadge({ status, className }: { status: EnquiryStatus; className?: string }) {
    return (
        <Badge variant="outline" className={cn("gap-1.5 font-medium", STATUS_STYLES[status].badge, className)}>
            <StatusDot status={status} />
            {STATUS_LABELS[status]}
        </Badge>
    );
}
