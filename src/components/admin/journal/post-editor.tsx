"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Check, ExternalLink, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deletePostAction, savePostAction } from "@/app/admin/journal/actions";
import { uploadJournalImage } from "@/lib/journal/client-image";
import { cn } from "@/lib/utils";
import { RichEditor } from "./rich-editor";

export type EditablePost = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    content: JSONContent;
    coverKey: string | null;
    coverUrl: string | null;
    coverAlt: string;
    seoTitle: string;
    seoDescription: string;
    status: "DRAFT" | "PUBLISHED";
    /** ISO date-time or null */
    publishedAt: string | null;
};

type PostEditorProps = {
    post: EditablePost;
    siteUrl: string;
    categories: string[];
    storageReady: boolean;
};

const PRESET_CATEGORIES = ["Haute Couture", "Bridal", "Couture Accessories", "Half-Scale", "Sampling", "Craft", "Atelier", "Design", "Inspiration"];

const slugify = (value: string) =>
    value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
        .replace(/-+$/g, "");

/** ISO string to the value a <input type="datetime-local"> expects, in the browser's own time zone. */
function toLocalInput(iso: string | null) {
    if (!iso) return "";
    const date = new Date(iso);
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function Counter({ value, ideal, max }: { value: number; ideal?: number; max: number }) {
    return (
        <span className={cn("text-xs tabular-nums text-muted-foreground", value > max && "text-destructive", ideal && value > 0 && value <= ideal && "text-emerald-700")}>
            {value}/{max}
        </span>
    );
}

export function PostEditor({ post, siteUrl, categories, storageReady }: PostEditorProps) {
    const [title, setTitle] = useState(post.title);
    const [slug, setSlug] = useState(post.slug);
    // New articles start with a placeholder address that follows the title until the writer sets their own.
    const [slugTouched, setSlugTouched] = useState(!post.slug.startsWith("untitled-"));
    const [excerpt, setExcerpt] = useState(post.excerpt);
    const [category, setCategory] = useState(post.category);
    const [cover, setCover] = useState({ key: post.coverKey, url: post.coverUrl });
    const [coverAlt, setCoverAlt] = useState(post.coverAlt);
    const [coverBusy, setCoverBusy] = useState(false);
    const [coverError, setCoverError] = useState("");
    const [seoTitle, setSeoTitle] = useState(post.seoTitle);
    const [seoDescription, setSeoDescription] = useState(post.seoDescription);
    const [status, setStatus] = useState(post.status);
    const [publishDate, setPublishDate] = useState(toLocalInput(post.publishedAt));
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
    const [pending, startTransition] = useTransition();
    const content = useRef<JSONContent>(post.content);
    const coverInput = useRef<HTMLInputElement>(null);

    const touch = () => {
        setDirty(true);
        setMessage(null);
    };

    const save = useCallback(
        (nextStatus: "DRAFT" | "PUBLISHED") => {
            startTransition(async () => {
                setMessage(null);
                const result = await savePostAction(post.id, {
                    title,
                    slug,
                    excerpt,
                    category: category || null,
                    coverKey: cover.key,
                    coverAlt: coverAlt || null,
                    seoTitle: seoTitle || null,
                    seoDescription: seoDescription || null,
                    // Tiptap's JSON holds null-prototype objects, which server actions refuse; a JSON round-trip makes them plain.
                    content: JSON.parse(JSON.stringify(content.current)),
                    status: nextStatus,
                    publishedAt: nextStatus === "PUBLISHED" && publishDate ? new Date(publishDate).toISOString() : null,
                });
                if (!result.ok) {
                    setMessage({ kind: "error", text: result.error });
                    return;
                }
                setSlug(result.slug);
                setStatus(result.status);
                setDirty(false);
                setMessage({
                    kind: "ok",
                    text: result.status === "PUBLISHED" ? "Saved and live on the website." : "Draft saved.",
                });
            });
        },
        [post.id, title, slug, excerpt, category, cover.key, coverAlt, seoTitle, seoDescription, publishDate],
    );

    // Ctrl/Cmd + S saves in the current state; leaving with unsaved changes asks first.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
                event.preventDefault();
                if (!pending) save(status);
            }
        };
        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            if (dirty) event.preventDefault();
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, [dirty, pending, save, status]);

    async function onCoverPicked(file: File) {
        setCoverError("");
        setCoverBusy(true);
        try {
            const image = await uploadJournalImage(post.id, file);
            setCover({ key: image.key, url: image.url });
            touch();
        } catch (error) {
            setCoverError(error instanceof Error ? error.message : "Upload failed.");
        } finally {
            setCoverBusy(false);
        }
    }

    const published = status === "PUBLISHED";
    const previewUrl = `${siteUrl.replace(/\/$/, "")}/journal/${slug || "your-article"}`;

    const actionButtons = (
        <>
            {published ? (
                <>
                    <Button className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save("PUBLISHED")}>
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Update
                    </Button>
                    <Button variant="outline" className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save("DRAFT")}>
                        Unpublish
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="outline" className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save("DRAFT")}>
                        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save draft
                    </Button>
                    <Button className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save("PUBLISHED")}>
                        Publish
                    </Button>
                </>
            )}
        </>
    );

    return (
        <div className="min-w-0 space-y-5 pb-28 lg:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
                        <Link href="/admin/journal">← All articles</Link>
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit article</h1>
                </div>
                {published && (
                    <Button asChild variant="outline" size="sm">
                        <a href={`/journal/${slug}`} target="_blank" rel="noreferrer">
                            View live <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                )}
            </div>

            {!storageReady && (
                <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Image storage is not set up yet, so images cannot be uploaded. Add R2_PUBLIC_BUCKET and R2_PUBLIC_URL to the environment (see .env.example).
                </p>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="min-w-0 space-y-5 lg:col-span-2">
                    <Card>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    maxLength={140}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                        if (!slugTouched) setSlug(slugify(event.target.value) || post.slug);
                                        touch();
                                    }}
                                    className="h-12 text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Web address</Label>
                                <div className="flex items-center rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring">
                                    <span className="hidden whitespace-nowrap pl-3 text-sm text-muted-foreground sm:block">/journal/</span>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        maxLength={90}
                                        onChange={(event) => {
                                            setSlug(slugify(event.target.value));
                                            setSlugTouched(true);
                                            touch();
                                        }}
                                        className="border-0 shadow-none focus-visible:ring-0"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    The article's page link, made from the title automatically. Keep it short, e.g. <span className="font-medium">hand-embroidery-vs-machine</span>. Changing it after publishing breaks old links.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="excerpt">Summary</Label>
                                    <Counter value={excerpt.length} ideal={160} max={320} />
                                </div>
                                <Textarea
                                    id="excerpt"
                                    rows={3}
                                    value={excerpt}
                                    maxLength={320}
                                    onChange={(event) => {
                                        setExcerpt(event.target.value);
                                        touch();
                                    }}
                                    placeholder="Two sentences that make someone want to read on. Shown on the article card and in search results."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Cover image</CardTitle>
                            <CardDescription>Best size: 1600 × 1200 px (4:3 landscape), under 5 MB. Shown as a 4:3 card and at the top of the article. JPG, PNG or WEBP.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                ref={coverInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    event.target.value = "";
                                    if (file) void onCoverPicked(file);
                                }}
                            />
                            {cover.url ? (
                                <div className="space-y-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={cover.url} alt={coverAlt || "Cover preview"} className="max-h-72 w-full rounded-md border object-cover" />
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" disabled={coverBusy} onClick={() => coverInput.current?.click()}>
                                            {coverBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                                            Replace
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setCover({ key: null, url: null });
                                                touch();
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    disabled={coverBusy || !storageReady}
                                    onClick={() => coverInput.current?.click()}
                                    className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed text-sm text-muted-foreground transition-colors hover:bg-accent/50 disabled:opacity-60"
                                >
                                    {coverBusy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                                    {coverBusy ? "Uploading…" : "Click to upload a cover image"}
                                </button>
                            )}
                            {coverError && (
                                <p role="alert" className="text-sm text-destructive">
                                    {coverError}
                                </p>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="coverAlt">Describe the image</Label>
                                <Input
                                    id="coverAlt"
                                    value={coverAlt}
                                    maxLength={200}
                                    onChange={(event) => {
                                        setCoverAlt(event.target.value);
                                        touch();
                                    }}
                                    placeholder="e.g. Artisan stitching pearls onto an ivory bridal bodice"
                                />
                                <p className="text-xs text-muted-foreground">Helps search engines and screen readers. Required to publish.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <RichEditor
                        postId={post.id}
                        initialContent={post.content}
                        onChange={(next) => {
                            content.current = next;
                            touch();
                        }}
                    />
                </div>

                <div className="min-w-0 space-y-5 lg:sticky lg:top-20 lg:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base">
                                Publish
                                <span
                                    className={cn(
                                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                        published ? "border-emerald-300 bg-emerald-100 text-emerald-900" : "border-slate-300 bg-slate-100 text-slate-700",
                                    )}
                                >
                                    {published ? "Published" : "Draft"}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="publishDate">Publish date</Label>
                                <Input
                                    id="publishDate"
                                    type="datetime-local"
                                    className="w-full min-w-0 appearance-none"
                                    value={publishDate}
                                    onChange={(event) => {
                                        setPublishDate(event.target.value);
                                        touch();
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">Leave empty to publish now. A future date schedules the article.</p>
                            </div>
                            {message && (
                                <p
                                    role={message.kind === "error" ? "alert" : "status"}
                                    className={cn(
                                        "rounded-md border px-3 py-2 text-sm",
                                        message.kind === "error"
                                            ? "border-destructive/30 bg-destructive/5 text-destructive"
                                            : "border-emerald-300 bg-emerald-50 text-emerald-800",
                                    )}
                                >
                                    {message.text}
                                </p>
                            )}
                            {dirty && !message && <p className="text-xs text-amber-700">You have unsaved changes.</p>}
                            <div className="hidden gap-2 lg:flex lg:flex-col">{actionButtons}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {[...new Set([...PRESET_CATEGORIES, ...categories.flatMap((item) => item.split(",").map((part) => part.trim()))])]
                                    .filter(Boolean)
                                    .map((item) => {
                                        const selected = category.split(",").map((part) => part.trim()).includes(item);
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() => {
                                                    const current = category.split(",").map((part) => part.trim()).filter(Boolean);
                                                    const next = selected ? current.filter((part) => part !== item) : [...current, item];
                                                    setCategory(next.join(", ").slice(0, 120));
                                                    touch();
                                                }}
                                                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${selected ? "border-foreground bg-foreground text-background" : "hover:bg-muted"}`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                            </div>
                            <p className="mt-3 text-xs text-muted-foreground">Tap to select one or more. The first one is the main category.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Search appearance</CardTitle>
                            <CardDescription>Optional. Leave empty to use the title and summary.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-md border bg-background p-3">
                                <p className="truncate text-xs text-emerald-800">{previewUrl}</p>
                                <p className="mt-0.5 line-clamp-2 text-base text-blue-700">{seoTitle || title || "Your article title"}</p>
                                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{seoDescription || excerpt || "Your summary appears here."}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="seoTitle">Search title</Label>
                                    <Counter value={seoTitle.length} ideal={60} max={70} />
                                </div>
                                <Input
                                    id="seoTitle"
                                    value={seoTitle}
                                    maxLength={70}
                                    onChange={(event) => {
                                        setSeoTitle(event.target.value);
                                        touch();
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="seoDescription">Search description</Label>
                                    <Counter value={seoDescription.length} ideal={160} max={170} />
                                </div>
                                <Textarea
                                    id="seoDescription"
                                    rows={3}
                                    value={seoDescription}
                                    maxLength={170}
                                    onChange={(event) => {
                                        setSeoDescription(event.target.value);
                                        touch();
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/30">
                        <CardHeader>
                            <CardTitle className="text-base text-destructive">Delete article</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">Removes the article and all its images from cloud storage.</p>
                            <ConfirmDelete
                                label="Delete article"
                                title="Delete this article?"
                                description="The article and its images will be permanently removed and the page will stop working."
                                action={deletePostAction.bind(null, post.id)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Phones: the main buttons stay within reach at the bottom of the screen. */}
            <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t bg-background/95 p-3 backdrop-blur lg:hidden">{actionButtons}</div>
        </div>
    );
}
