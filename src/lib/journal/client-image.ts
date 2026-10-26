/** Browser-side helpers for Journal images. */

export type UploadedImage = { key: string; url: string; width: number; height: number };

const SHRINK_ABOVE_BYTES = 1.5 * 1024 * 1024;
const MAX_EDGE = 2400;

/**
 * Phone and camera photos are often 5 to 10 MB. Shrinking them in the browser first keeps the upload
 * fast and under the hosting request limit; the server then optimises them again.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        throw new Error("Please choose a JPG, PNG or WEBP image.");
    }
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
        if (file.size <= SHRINK_ABOVE_BYTES && scale === 1) {
            bitmap.close();
            return file;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
        return blob ? new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" }) : file;
    } catch {
        // Could not decode here; let the server decide.
        return file;
    }
}

async function uploadTo(endpoint: string, field: string, id: string, original: File): Promise<UploadedImage> {
    const file = await prepareImageForUpload(original);
    if (file.size > 4 * 1024 * 1024) {
        throw new Error("That image is still over 4 MB. Please choose a smaller one.");
    }
    const body = new FormData();
    body.set(field, id);
    body.set("file", file);

    const response = await fetch(endpoint, { method: "POST", body });
    const result = (await response.json().catch(() => null)) as
        | ({ ok: true } & UploadedImage)
        | { ok: false; error?: string }
        | null;
    if (!response.ok || !result?.ok) {
        throw new Error((result && !result.ok && result.error) || "Upload failed. Please try again.");
    }
    return { key: result.key, url: result.url, width: result.width, height: result.height };
}

export const uploadJournalImage = (postId: string, file: File) => uploadTo("/admin/journal/upload", "postId", postId, file);
export const uploadCategoryImage = (categoryId: string, file: File) => uploadTo("/admin/categories/upload", "categoryId", categoryId, file);
