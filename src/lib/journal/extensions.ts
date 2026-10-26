import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";

/**
 * The one definition of what a Journal article may contain. The admin editor and the public page
 * both build from this, so what an editor can write is exactly what the page can render, and nothing else.
 */

export const imageAttributes = {
    src: { default: null },
    alt: { default: null },
    title: { default: null },
    /** Displayed width: "100%" or a pixel number after the editor resizes it. */
    width: {
        default: "100%",
        renderHTML: (attributes: Record<string, unknown>) => {
            const width = attributes.width;
            const css = typeof width === "number" ? `${width}px` : typeof width === "string" && width ? width : "100%";
            return { style: `width:${css};max-width:100%;height:auto` };
        },
    },
    height: { default: null, renderHTML: () => ({}) },
    align: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") ?? "center",
        renderHTML: (attributes: Record<string, unknown>) => ({ "data-align": String(attributes.align ?? "center") }),
    },
    /** Original size of the stored file, so browsers can reserve space and avoid layout jumps. */
    naturalWidth: {
        default: null,
        parseHTML: (element: HTMLElement) => Number(element.getAttribute("data-w")) || null,
        renderHTML: (attributes: Record<string, unknown>) => (attributes.naturalWidth ? { "data-w": String(attributes.naturalWidth) } : {}),
    },
    naturalHeight: {
        default: null,
        parseHTML: (element: HTMLElement) => Number(element.getAttribute("data-h")) || null,
        renderHTML: (attributes: Record<string, unknown>) => (attributes.naturalHeight ? { "data-h": String(attributes.naturalHeight) } : {}),
    },
};

/** Plain image node (no React), used to render articles on the server. */
export const ImageNode = Image.extend({
    addAttributes() {
        return imageAttributes;
    },
});

export const starterKit = StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    codeBlock: false,
    code: false,
    link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
});
