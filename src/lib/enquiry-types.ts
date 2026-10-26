/** Options for "Nature of enquiry". Used by the form and validated again on the server. */
export const ENQUIRY_TYPES = [
    "Haute couture embroidery",
    "Bridal embroidery",
    "Couture accessories",
    "Half-scale exploration",
    "Sampling and development",
    "Other collaboration",
] as const;

export const ENQUIRY_SOURCES = ["popup", "contact"] as const;

/** Attachment limits (kept under the ~4.5 MB request cap of serverless hosts). */
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
