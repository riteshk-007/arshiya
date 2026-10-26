const zone = "Asia/Kolkata";

export function formatDateTime(value: string | Date) {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: zone,
    }).format(new Date(value));
}

export function formatDate(value: string | Date) {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: zone }).format(new Date(value));
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Enquiry reference shown to visitors and staff, e.g. ARS-00042. */
export const enquiryRef = (seq: string | number | bigint) => `ARS-${String(seq).padStart(5, "0")}`;
