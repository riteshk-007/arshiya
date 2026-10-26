import { EnquiryStatus } from "@/generated/prisma/enums";

export { EnquiryStatus };

/** Display order. Plain module (no database client), so client components can import it. */
export const ENQUIRY_STATUSES: EnquiryStatus[] = [
    EnquiryStatus.NEW,
    EnquiryStatus.IN_PROGRESS,
    EnquiryStatus.REPLIED,
    EnquiryStatus.CLOSED,
    EnquiryStatus.SPAM,
];

export const STATUS_LABELS: Record<EnquiryStatus, string> = {
    NEW: "New",
    IN_PROGRESS: "In progress",
    REPLIED: "Replied",
    CLOSED: "Closed",
    SPAM: "Spam",
};

/** One-glance meaning for each status, shown in menus. */
export const STATUS_HINTS: Record<EnquiryStatus, string> = {
    NEW: "Not looked at yet",
    IN_PROGRESS: "We are working on it",
    REPLIED: "Answer sent to the customer",
    CLOSED: "Finished",
    SPAM: "Junk or irrelevant",
};

/** Each status has its own colour so the list can be scanned at a glance. */
export const STATUS_STYLES: Record<EnquiryStatus, { badge: string; dot: string }> = {
    NEW: { badge: "border-orange-300 bg-orange-100 text-orange-900", dot: "bg-orange-500" },
    IN_PROGRESS: { badge: "border-blue-300 bg-blue-100 text-blue-900", dot: "bg-blue-500" },
    REPLIED: { badge: "border-emerald-300 bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" },
    CLOSED: { badge: "border-slate-300 bg-slate-100 text-slate-700", dot: "bg-slate-400" },
    SPAM: { badge: "border-red-300 bg-red-100 text-red-900", dot: "bg-red-500" },
};

/** URL values, e.g. /admin/enquiries?status=in_progress */
export const statusToParam = (status: EnquiryStatus) => status.toLowerCase();

export function statusFromParam(value: string | undefined | null): EnquiryStatus | undefined {
    return ENQUIRY_STATUSES.find((status) => status.toLowerCase() === value?.toLowerCase());
}
