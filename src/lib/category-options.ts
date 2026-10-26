import type { IconName } from "@/components/home/Icon";

/** Choices shared by the admin form and the server. Kept free of server-only imports so the browser can use it. */
export const ICON_NAMES: IconName[] = ["couture", "bridal", "accessories", "half-scale", "sketch", "materials", "sampling", "collaboration"];

export const IMAGE_POSITIONS = [
    { value: "center top", label: "Top" },
    { value: "center 25%", label: "Upper middle" },
    { value: "center", label: "Middle" },
    { value: "center 60%", label: "Lower middle" },
    { value: "center bottom", label: "Bottom" },
] as const;
