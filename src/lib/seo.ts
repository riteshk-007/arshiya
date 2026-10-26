/** Shared SEO constants. Only public pages use these; the admin area is never indexed. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.arshiya.uk";
export const SITE_NAME = "House of Arshiya";
export const SITE_TITLE = "House of Arshiya | Haute Couture Hand Embroidery";
export const SITE_DESCRIPTION =
    "An independent hand-embroidery atelier collaborating with international fashion houses and designers on haute couture, bridal embroidery, couture accessories and half-scale exploration.";

export const SITE_KEYWORDS = [
    "haute couture embroidery",
    "hand embroidery atelier",
    "bridal embroidery",
    "couture accessories",
    "half-scale couture sampling",
    "embroidery for fashion houses",
    "Indian embroidery",
    "bespoke hand embroidery",
];

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
