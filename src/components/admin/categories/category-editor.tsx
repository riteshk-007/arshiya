"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { JSONContent } from "@tiptap/react";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { RichEditor } from "@/components/admin/journal/rich-editor";
import { Icon, type IconName } from "@/components/home/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/categories/actions";
import { uploadCategoryImage } from "@/lib/journal/client-image";
import { ICON_NAMES, IMAGE_POSITIONS } from "@/lib/site-categories";
import { cn } from "@/lib/utils";

export type EditableCategory = {
    id: string;
    slug: string;
    icon: string;
    title: string;
    navLabel: string;
    seoTitle: string;
    seoDescription: string;
    summary: string;
    imageSrc: string | null;
    imageUrl: string;
    imagePosition: string;
    alt: string;
    heading: string;
    content: JSONContent;
    note: string;
    ctaLabel: string;
    sortOrder: number;
    active: boolean;
};

const slugify = (value: string) =>
    value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60)
        .replace(/-+$/g, "");

const selectClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function Field({ label, hint, count, children }: { label: string; hint?: string; count?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
                {count && <span className="text-xs text-muted-foreground">{count}</span>}
            </div>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

export function CategoryEditor({ category, storageReady }: { category: EditableCategory; storageReady: boolean }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState(category);
    const [slugTouched, setSlugTouched] = useState(!category.slug.startsWith("new-category-"));
    const [dirty, setDirty] = useState(false);
    const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
    const [imageBusy, setImageBusy] = useState(false);
    const [imageError, setImageError] = useState("");
    const content = useRef<JSONContent>(category.content);
    const fileInput = useRef<HTMLInputElement>(null);

    const set = <K extends keyof EditableCategory>(key: K, value: EditableCategory[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
        setDirty(true);
        setMessage(null);
    };

    const uploadInsideText = useCallback((file: File) => uploadCategoryImage(category.id, file), [category.id]);

    async function onImagePicked(file: File) {
        setImageError("");
        setImageBusy(true);
        try {
            const image = await uploadCategoryImage(category.id, file);
            setForm((current) => ({ ...current, imageSrc: image.key, imageUrl: image.url }));
            setDirty(true);
        } catch (error) {
            setImageError(error instanceof Error ? error.message : "Upload failed.");
        } finally {
            setImageBusy(false);
        }
    }

    function save(active: boolean) {
        setMessage(null);
        startTransition(async () => {
            const result = await saveCategoryAction(category.id, {
                title: form.title,
                navLabel: form.navLabel || null,
                slug: form.slug,
                icon: form.icon,
                summary: form.summary,
                imageSrc: form.imageSrc,
                imagePosition: form.imagePosition,
                alt: form.alt || null,
                heading: form.heading,
                // Tiptap documents have null-prototype objects that cannot cross the server boundary as they are.
                content: JSON.parse(JSON.stringify(content.current)),
                note: form.note,
                ctaLabel: form.ctaLabel,
                seoTitle: form.seoTitle || null,
                seoDescription: form.seoDescription || null,
                sortOrder: Number.isFinite(form.sortOrder) ? form.sortOrder : 0,
                active,
            });
            if (result.ok) {
                setForm((current) => ({ ...current, slug: result.slug, active }));
                setDirty(false);
                setMessage({ kind: "ok", text: active ? "Saved. It is live on the website." : "Saved. It is hidden from the website." });
                router.refresh();
            } else {
                setMessage({ kind: "error", text: result.error });
            }
        });
    }

    const buttons = (
        <>
            <Button className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save(true)}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {form.active ? "Save changes" : "Save and show"}
            </Button>
            {form.active ? (
                <Button variant="outline" className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save(false)}>
                    Hide from website
                </Button>
            ) : (
                <Button variant="outline" className="h-11 flex-1 lg:h-10 lg:w-full" disabled={pending} onClick={() => save(false)}>
                    Save as hidden
                </Button>
            )}
        </>
    );

    return (
        <div className="min-w-0 space-y-5 pb-28 lg:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 mb-1">
                        <Link href="/admin/categories">← All categories</Link>
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit category</h1>
                </div>
                {form.active && (
                    <Button asChild variant="outline" size="sm">
                        <a href={`/${form.slug}`} target="_blank" rel="noreferrer">
                            View live <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                )}
            </div>

            {!storageReady && (
                <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Image storage is not set up yet, so pictures cannot be uploaded (R2_PUBLIC_BUCKET and R2_PUBLIC_URL).
                </p>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="min-w-0 space-y-5 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Name and home page card</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Field label="Name" count={`${form.title.length}/60`}>
                                <Input
                                    value={form.title}
                                    maxLength={60}
                                    className="h-11"
                                    onChange={(event) => {
                                        set("title", event.target.value);
                                        if (!slugTouched) setForm((current) => ({ ...current, slug: slugify(event.target.value) || current.slug }));
                                    }}
                                />
                            </Field>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Name in the top menu" hint="A shorter version if the name is long, e.g. Bridal.">
                                    <Input value={form.navLabel} maxLength={30} placeholder={form.title} onChange={(event) => set("navLabel", event.target.value)} />
                                </Field>
                                <Field label="Web address" hint="Changing it after publishing breaks old links.">
                                    <div className="flex items-center rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring">
                                        <span className="pl-3 text-sm text-muted-foreground">/</span>
                                        <Input
                                            value={form.slug}
                                            maxLength={60}
                                            className="border-0 shadow-none focus-visible:ring-0"
                                            onChange={(event) => {
                                                set("slug", slugify(event.target.value));
                                                setSlugTouched(true);
                                            }}
                                        />
                                    </div>
                                </Field>
                            </div>
                            <Field label="Short line on the home page card" count={`${form.summary.length}/120`}>
                                <Input value={form.summary} maxLength={120} placeholder="e.g. The poetry of detail." onChange={(event) => set("summary", event.target.value)} />
                            </Field>
                            <Field label="Icon">
                                <div className="flex flex-wrap gap-2">
                                    {ICON_NAMES.map((name) => (
                                        <button
                                            key={name}
                                            type="button"
                                            title={name}
                                            aria-label={`Icon ${name}`}
                                            aria-pressed={form.icon === name}
                                            onClick={() => set("icon", name)}
                                            className={cn(
                                                "flex h-14 w-14 items-center justify-center rounded-md border transition-colors",
                                                form.icon === name ? "border-foreground bg-foreground text-background" : "border-input bg-background text-foreground hover:bg-muted",
                                            )}
                                        >
                                            <Icon name={name as IconName} className="h-8 w-8" />
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Picture</CardTitle>
                            <CardDescription>
                                Best size: 1600 × 2000 px (4:5 portrait), under 4 MB. It is used on the home page card and as the large picture on the category page.
                                JPG, PNG or WEBP.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    event.target.value = "";
                                    if (file) void onImagePicked(file);
                                }}
                            />
                            {form.imageUrl ? (
                                <div className="space-y-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={form.imageUrl}
                                        alt={form.alt || "Category picture"}
                                        className="aspect-[4/5] max-h-80 w-auto max-w-full rounded-md border object-cover"
                                        style={{ objectPosition: form.imagePosition }}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <Button type="button" variant="outline" size="sm" disabled={imageBusy || !storageReady} onClick={() => fileInput.current?.click()}>
                                            {imageBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                                            Replace
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => {
                                                setForm((current) => ({ ...current, imageSrc: null, imageUrl: "" }));
                                                setDirty(true);
                                            }}>
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    disabled={imageBusy || !storageReady}
                                    onClick={() => fileInput.current?.click()}
                                    className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed text-sm text-muted-foreground transition-colors hover:bg-accent/50 disabled:opacity-60"
                                >
                                    {imageBusy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                                    {imageBusy ? "Uploading…" : "Click to upload a picture"}
                                </button>
                            )}
                            {imageError && (
                                <p role="alert" className="text-sm text-destructive">
                                    {imageError}
                                </p>
                            )}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Which part to keep in view" hint="Used when the picture is cropped on cards and phones.">
                                    <select className={selectClass} value={form.imagePosition} onChange={(event) => set("imagePosition", event.target.value)}>
                                        {IMAGE_POSITIONS.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                        {!IMAGE_POSITIONS.some((item) => item.value === form.imagePosition) && <option value={form.imagePosition}>Custom ({form.imagePosition})</option>}
                                    </select>
                                </Field>
                                <Field label="Describe the picture" hint="Helps search engines and screen readers. Required to show it.">
                                    <Input value={form.alt} maxLength={200} onChange={(event) => set("alt", event.target.value)} placeholder="e.g. Bride in a beaded lace gown" />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Category page</CardTitle>
                            <CardDescription>What visitors read when they open this category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Field label="Page heading" count={`${form.heading.length}/120`}>
                                <Input value={form.heading} maxLength={120} className="h-11" onChange={(event) => set("heading", event.target.value)} />
                            </Field>
                            <div className="space-y-2">
                                <Label>Details</Label>
                                <RichEditor
                                    upload={uploadInsideText}
                                    initialContent={category.content}
                                    onChange={(next) => {
                                        content.current = next;
                                        setDirty(true);
                                        setMessage(null);
                                    }}
                                />
                            </div>
                            <Field label="Closing line" count={`${form.note.length}/160`} hint="Shown in gold italics below the details. Optional.">
                                <Input value={form.note} maxLength={160} onChange={(event) => set("note", event.target.value)} />
                            </Field>
                            <Field label="Button text" count={`${form.ctaLabel.length}/50`}>
                                <Input value={form.ctaLabel} maxLength={50} onChange={(event) => set("ctaLabel", event.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Search appearance</CardTitle>
                            <CardDescription>What Google shows. Left empty, the name and the start of the details are used.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <Field label="Search title" count={`${form.seoTitle.length}/70`}>
                                <Input value={form.seoTitle} maxLength={70} placeholder={form.title} onChange={(event) => set("seoTitle", event.target.value)} />
                            </Field>
                            <Field label="Search description" count={`${form.seoDescription.length}/170`}>
                                <Textarea rows={3} value={form.seoDescription} maxLength={170} onChange={(event) => set("seoDescription", event.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                </div>

                <div className="min-w-0 space-y-5 lg:sticky lg:top-20 lg:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base">
                                Website
                                <span
                                    className={cn(
                                        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                        form.active ? "border-emerald-300 bg-emerald-100 text-emerald-900" : "border-slate-300 bg-slate-100 text-slate-700",
                                    )}
                                >
                                    {form.active ? "Shown" : "Hidden"}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field label="Position" hint="1 comes first on the home page and in the menu.">
                                <Input
                                    type="number"
                                    min={0}
                                    max={999}
                                    value={Number.isFinite(form.sortOrder) ? form.sortOrder : ""}
                                    onChange={(event) => set("sortOrder", Number.parseInt(event.target.value, 10))}
                                />
                            </Field>
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
                            <div className="hidden gap-2 lg:flex lg:flex-col">{buttons}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Delete</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">Removes this category and its pictures from cloud storage.</p>
                            <ConfirmDelete
                                label="Delete category"
                                title="Delete this category?"
                                description="The category page, its card and its pictures will be permanently removed."
                                action={deleteCategoryAction.bind(null, category.id)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t bg-background/95 p-3 backdrop-blur lg:hidden">{buttons}</div>
        </div>
    );
}
