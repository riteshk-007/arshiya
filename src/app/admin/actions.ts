"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { changePassword, login, logout, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enquiryRef } from "@/lib/format";
import { isSameOrigin } from "@/lib/security";
import { deleteObjects, deletePrefix, isStorageConfigured } from "@/lib/storage";
import { ENQUIRY_STATUSES } from "@/lib/status";

export type FormState = { error?: string; success?: string } | undefined;

const idSchema = z.uuid();

async function assertSameOrigin() {
    if (!isSameOrigin(await headers())) {
        throw new Error("Request not allowed.");
    }
}

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
    await assertSameOrigin();
    const result = await login(String(formData.get("username") ?? ""), String(formData.get("password") ?? ""));
    if (!result.ok) {
        return { error: result.error };
    }
    redirect("/admin");
}

export async function logoutAction() {
    await assertSameOrigin();
    await logout();
    redirect("/admin/login");
}

export async function updateStatusAction(id: string, status: string) {
    await assertSameOrigin();
    await requireAdmin();
    const parsedId = idSchema.safeParse(id);
    const parsedStatus = z.enum(ENQUIRY_STATUSES as [string, ...string[]]).safeParse(status);
    if (!parsedId.success || !parsedStatus.success) {
        throw new Error("Invalid request.");
    }
    await prisma.enquiry.update({
        where: { id: parsedId.data },
        data: { status: parsedStatus.data as (typeof ENQUIRY_STATUSES)[number] },
    });
    revalidatePath("/admin", "layout");
}

export async function addNoteAction(_previous: FormState, formData: FormData): Promise<FormState> {
    await assertSameOrigin();
    const session = await requireAdmin();
    const id = idSchema.safeParse(String(formData.get("enquiryId") ?? ""));
    const body = z.string().trim().min(1, "Please write a note.").max(2000, "Notes can be up to 2000 characters.");
    const parsedBody = body.safeParse(String(formData.get("body") ?? ""));
    if (!id.success) {
        return { error: "Invalid request." };
    }
    if (!parsedBody.success) {
        return { error: parsedBody.error.issues[0]?.message };
    }
    await prisma.$transaction([
        prisma.enquiryNote.create({
            data: { enquiryId: id.data, author: session.username, body: parsedBody.data },
        }),
        prisma.enquiry.update({ where: { id: id.data }, data: { updatedAt: new Date() } }),
    ]);
    revalidatePath(`/admin/enquiries/${id.data}`);
    return { success: "Note added." };
}

export async function deleteNoteAction(noteId: string, enquiryId: string) {
    await assertSameOrigin();
    await requireAdmin();
    const note = idSchema.safeParse(noteId);
    const enquiry = idSchema.safeParse(enquiryId);
    if (!note.success || !enquiry.success) {
        throw new Error("Invalid request.");
    }
    await prisma.enquiryNote.deleteMany({ where: { id: note.data, enquiryId: enquiry.data } });
    revalidatePath(`/admin/enquiries/${enquiry.data}`);
}

/** Files are removed from Cloudflare R2 first; if that fails nothing is deleted, so no file is ever orphaned. */
export async function deleteEnquiryAction(id: string) {
    await assertSameOrigin();
    await requireAdmin();
    const parsed = idSchema.safeParse(id);
    if (!parsed.success) {
        throw new Error("Invalid request.");
    }

    const enquiry = await prisma.enquiry.findUnique({
        where: { id: parsed.data },
        select: { seq: true, files: { select: { storageKey: true } } },
    });
    if (enquiry && enquiry.files.length > 0) {
        if (!isStorageConfigured()) {
            throw new Error("File storage is not configured, so the attachments cannot be removed. Nothing was deleted.");
        }
        await deleteObjects(enquiry.files.map((file) => file.storageKey));
        // Also sweep the enquiry's folder in case an earlier upload left something behind.
        await deletePrefix(`enquiries/${enquiryRef(enquiry.seq)}/`);
    }
    await prisma.enquiry.deleteMany({ where: { id: parsed.data } });
    revalidatePath("/admin", "layout");
    redirect("/admin/enquiries");
}

export async function deleteAttachmentAction(fileId: string, enquiryId: string) {
    await assertSameOrigin();
    await requireAdmin();
    const file = idSchema.safeParse(fileId);
    const enquiry = idSchema.safeParse(enquiryId);
    if (!file.success || !enquiry.success) {
        throw new Error("Invalid request.");
    }

    const record = await prisma.enquiryFile.findFirst({
        where: { id: file.data, enquiryId: enquiry.data },
        select: { storageKey: true },
    });
    if (record) {
        if (!isStorageConfigured()) {
            throw new Error("File storage is not configured, so the file cannot be removed. Nothing was deleted.");
        }
        await deleteObjects([record.storageKey]);
        await prisma.enquiryFile.deleteMany({ where: { id: file.data } });
    }
    revalidatePath(`/admin/enquiries/${enquiry.data}`);
}

export async function changePasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
    await assertSameOrigin();
    const session = await requireAdmin();
    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (next !== confirm) {
        return { error: "The new passwords do not match." };
    }
    const result = await changePassword(session, current, next);
    return result.ok
        ? { success: "Password updated. Other devices have been signed out." }
        : { error: result.error };
}
