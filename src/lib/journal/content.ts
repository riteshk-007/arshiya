import { generateHTML } from "@tiptap/html/server";
import type { JSONContent } from "@tiptap/core";
import { publicKeyFromUrl } from "@/lib/storage";
import { ImageNode, starterKit } from "./extensions";

export type { JSONContent };

export const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

function walk(node: JSONContent | undefined, visit: (node: JSONContent) => void) {
    if (!node) return;
    visit(node);
    node.content?.forEach((child) => walk(child, visit));
}

/** Accepts only a well-formed document; anything else becomes an empty one. */
export function asDoc(value: unknown): JSONContent {
    if (value && typeof value === "object" && (value as JSONContent).type === "doc") {
        return value as JSONContent;
    }
    return EMPTY_DOC;
}

/** Keys of our own images used inside the article. Used to find images that are no longer referenced. */
export function referencedImageKeys(doc: JSONContent) {
    const keys = new Set<string>();
    walk(doc, (node) => {
        if (node.type === "image") {
            const key = publicKeyFromUrl(String(node.attrs?.src ?? ""));
            if (key) keys.add(key);
        }
    });
    return keys;
}

/** Plain text of the article, for reading time and a search-friendly summary. */
export function plainText(doc: JSONContent) {
    const parts: string[] = [];
    walk(doc, (node) => {
        if (node.type === "text" && node.text) parts.push(node.text);
        if (node.type === "paragraph" || node.type === "heading" || node.type === "listItem") parts.push(" ");
    });
    return parts.join("").replace(/\s+/g, " ").trim();
}

export const readingMinutes = (doc: JSONContent) =>
    Math.max(1, Math.round(plainText(doc).split(" ").filter(Boolean).length / 200));

/**
 * Renders an article to HTML on the server. Only nodes our editor defines can appear, and images
 * from anywhere other than our own storage are dropped, so the output is safe to inject.
 */
export function renderArticleHtml(doc: JSONContent) {
    const cleaned = structuredClone(doc);
    const strip = (node: JSONContent) => {
        node.content = node.content
            ?.filter((child) => child.type !== "image" || publicKeyFromUrl(String(child.attrs?.src ?? "")))
            .map((child) => {
                strip(child);
                return child;
            });
    };
    strip(cleaned);

    const html = generateHTML(cleaned, [starterKit, ImageNode]);
    // Images load lazily, and carry their real size so the page does not jump while they load.
    const base = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");
    const optimised = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

    return html.replace(/<img\s[^>]*>/g, (tag) => {
        const width = /data-w="(\d+)"/.exec(tag)?.[1];
        const height = /data-h="(\d+)"/.exec(tag)?.[1];
        const size = width && height ? ` width="${width}" height="${height}"` : "";
        let result = tag.replace(/^<img\s/, `<img loading="lazy" decoding="async"${size} `);

        // Serve right-sized WebP/AVIF copies (cached by the CDN) instead of the full 2000px file.
        const src = /\ssrc="([^"]+)"/.exec(result);
        if (base && src && src[1].startsWith(`${base}/`)) {
            const srcset = [640, 1080, 1920].map((w) => `${optimised(src[1], w)} ${w}w`).join(", ");
            result = result.replace(
                src[0],
                ` src="${optimised(src[1], 1080)}" srcset="${srcset}" sizes="(min-width: 768px) 768px, 100vw"`,
            );
        }
        return result;
    });
}
