import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Image as ImageIcon, Mail } from "lucide-react";
import { z } from "zod";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { NoteForm } from "@/components/admin/note-form";
import { StatusMenu } from "@/components/admin/status-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { enquiryRef, formatBytes, formatDateTime } from "@/lib/format";
import { deleteAttachmentAction, deleteEnquiryAction, deleteNoteAction } from "@/app/admin/actions";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
    const { id } = await params;
    return { title: z.uuid().safeParse(id).success ? "Enquiry" : "Not found" };
}

export default async function EnquiryDetailPage({ params }: { params: Params }) {
    const { id } = await params;
    if (!z.uuid().safeParse(id).success) {
        notFound();
    }

    // Attachment bytes are not loaded here, only their names and sizes.
    const enquiry = await prisma.enquiry.findUnique({
        where: { id },
        include: {
            files: {
                select: { id: true, filename: true, contentType: true, sizeBytes: true },
                orderBy: { createdAt: "asc" },
            },
            notes: { orderBy: { createdAt: "desc" } },
        },
    });
    if (!enquiry) {
        notFound();
    }
    const { files, notes } = enquiry;

    const details: [string, React.ReactNode][] = [
        ["Name", enquiry.name],
        [
            "Email",
            <a key="email" href={`mailto:${enquiry.email}`} className="break-all underline-offset-4 hover:underline">
                {enquiry.email}
            </a>,
        ],
        ["Company", enquiry.company],
        ["Country", enquiry.country],
        ["Enquiry type", enquiry.enquiryType],
        ["Timeline", enquiry.timeline],
        ["Received", formatDateTime(enquiry.createdAt)],
        ["From", enquiry.source === "CONTACT" ? "Contact page" : "Enquiry popup"],
    ];

    return (
        <div className="space-y-5">
            <div>
                <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
                    <Link href="/admin/enquiries">
                        <ArrowLeft className="h-4 w-4" /> All enquiries
                    </Link>
                </Button>
                <h1 className="text-2xl font-semibold tracking-tight">{enquiry.name}</h1>
                <p className="text-sm text-muted-foreground">{enquiryRef(enquiry.seq)}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{enquiry.brief}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                                {details.map(([label, value]) => (
                                    <div key={label}>
                                        <dt className="text-xs text-muted-foreground">{label}</dt>
                                        <dd className="mt-0.5 text-sm">{value || <span className="text-muted-foreground">—</span>}</dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Attachments ({files.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No files were attached.</p>
                            ) : (
                                <ul className="divide-y rounded-md border">
                                    {files.map((file) => (
                                        <li key={file.id} className="flex items-center gap-1 pr-1">
                                            <a
                                                href={`/admin/files/${file.id}`}
                                                className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-sm hover:bg-accent/60"
                                            >
                                                {file.contentType.startsWith("image/") ? (
                                                    <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                ) : (
                                                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                )}
                                                <span className="min-w-0 flex-1 truncate">{file.filename}</span>
                                                <span className="shrink-0 text-xs text-muted-foreground">
                                                    {formatBytes(file.sizeBytes)}
                                                </span>
                                            </a>
                                            <ConfirmDelete
                                                variant="icon"
                                                label="Delete file"
                                                title="Delete this file?"
                                                description="It will be removed from cloud storage and cannot be recovered."
                                                action={deleteAttachmentAction.bind(null, file.id, enquiry.id)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <StatusMenu id={enquiry.id} status={enquiry.status} />
                            <Button asChild variant="outline" className="h-10 w-full">
                                <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent("Re: your enquiry to House of Arshiya")}`}>
                                    <Mail className="h-4 w-4" /> Reply by email
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <NoteForm enquiryId={enquiry.id} />
                            {notes.length > 0 && (
                                <ul className="space-y-3 border-t pt-4">
                                    {notes.map((note) => (
                                        <li key={note.id} className="rounded-md bg-muted/60 p-3">
                                            <p className="whitespace-pre-wrap break-words text-sm">{note.body}</p>
                                            <div className="mt-2 flex items-center justify-between gap-2">
                                                <p className="text-xs text-muted-foreground">
                                                    {note.author} · {formatDateTime(note.createdAt)}
                                                </p>
                                                <ConfirmDelete
                                                    variant="icon"
                                                    label="Delete note"
                                                    title="Delete this note?"
                                                    description="This cannot be undone."
                                                    action={deleteNoteAction.bind(null, note.id, enquiry.id)}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="text-base text-destructive">Delete enquiry</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Removes this enquiry together with its notes and attachments.
                            </p>
                            <ConfirmDelete
                                label="Delete enquiry"
                                title="Delete this enquiry?"
                                description="The enquiry, its notes and attachments will be permanently removed."
                                action={deleteEnquiryAction.bind(null, enquiry.id)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
