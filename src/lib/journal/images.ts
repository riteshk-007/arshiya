import sharp from "sharp";

/** What an admin may upload. Everything is converted to WebP, so nothing odd is ever stored. */
export const JOURNAL_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_EDGE = 2000;
const MAX_PIXELS = 60_000_000;

export type ProcessedImage = { data: Buffer; width: number; height: number; contentType: "image/webp" };

/** Real type from the first bytes, ignoring what the browser claimed. */
export function sniffImageType(bytes: Buffer): (typeof JOURNAL_IMAGE_TYPES)[number] | null {
    if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
    if (bytes.subarray(0, 4).toString("latin1") === "RIFF" && bytes.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
    return null;
}

/**
 * Turns an upload into a web-ready image: rotated upright, shrunk to at most 2000px on the longest side,
 * stripped of metadata (camera, GPS) and saved as WebP. Smaller files make the pages load faster.
 */
export async function processImage(input: Buffer): Promise<ProcessedImage> {
    const { data, info } = await sharp(input, { limitInputPixels: MAX_PIXELS })
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });

    return { data, width: info.width, height: info.height, contentType: "image/webp" };
}
