import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, processImage, sniffImageType } from "@/lib/journal/images";
import { prisma } from "@/lib/prisma";
import { isSameOrigin } from "@/lib/security";
import { buildObjectKey, isStorageConfigured, publicObjectUrl, uploadObject } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

/** Signed-in admins only. Stores a category's picture (or a picture inside its details) in the public bucket. */
export async function POST(request: Request) {
    if (!isSameOrigin(request.headers)) {
        return fail("Request not allowed.", 403);
    }
    if (!(await getSession())) {
        return fail("Please sign in again.", 401);
    }
    if (!isStorageConfigured("public")) {
        return fail("Image storage is not set up yet (R2_PUBLIC_BUCKET and R2_PUBLIC_URL).", 503);
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return fail("Could not read the upload.", 400);
    }

    const categoryId = z.uuid().safeParse(String(form.get("categoryId") ?? ""));
    const file = form.get("file");
    if (!categoryId.success || !(file instanceof File)) {
        return fail("Invalid upload.", 400);
    }
    if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
        return fail("Images must be under 4 MB.", 413);
    }
    if (!(await prisma.siteCategory.findUnique({ where: { id: categoryId.data }, select: { id: true } }))) {
        return fail("This category no longer exists.", 404);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (!sniffImageType(bytes)) {
        return fail("Please upload a JPG, PNG or WEBP image.", 400);
    }

    let processed;
    try {
        processed = await processImage(bytes);
    } catch {
        return fail("That image could not be read. Please try another file.", 400);
    }

    const key = buildObjectKey(`categories/${categoryId.data}`, file.name, processed.contentType);
    await uploadObject(key, processed.data, processed.contentType, "public");

    return NextResponse.json({ ok: true, key, url: publicObjectUrl(key), width: processed.width, height: processed.height });
}
