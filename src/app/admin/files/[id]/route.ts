import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isStorageConfigured, signedDownloadUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Signed-in admins only. The bucket stays private: this hands the admin a link that works for
 * one minute and forces a download, so files never open inside the site's own origin.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!(await getSession())) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    if (!z.uuid().safeParse(id).success) {
        return new Response("Not found", { status: 404 });
    }

    const file = await prisma.enquiryFile.findUnique({
        where: { id },
        select: { filename: true, contentType: true, storageKey: true },
    });
    if (!file || !ALLOWED_TYPES.has(file.contentType)) {
        return new Response("Not found", { status: 404 });
    }
    if (!isStorageConfigured()) {
        return new Response("File storage is not configured.", { status: 503 });
    }

    const url = await signedDownloadUrl(file.storageKey, file.filename, file.contentType, 60);
    const response = NextResponse.redirect(url, 302);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
}
