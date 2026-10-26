"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor, type JSONContent } from "@tiptap/react";
import { ImageExtension } from "@/components/extensions/image";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { HeadingToolbar } from "@/components/toolbars/heading";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ImageUploadToolbar } from "@/components/toolbars/image-upload";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { LinkToolbar } from "@/components/toolbars/link";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { UndoToolbar } from "@/components/toolbars/undo";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { starterKit } from "@/lib/journal/extensions";
import { uploadJournalImage, type UploadedImage } from "@/lib/journal/client-image";

/** The shadcn-tiptap image node, plus the stored size so published pages can reserve space for it. */
const EditorImage = ImageExtension.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            naturalWidth: { default: null },
            naturalHeight: { default: null },
        };
    },
});

type RichEditorProps = {
    /** Journal article the images belong to. Not needed when a custom upload function is given. */
    postId?: string;
    /** Where pasted or picked images go. Defaults to the Journal upload. */
    upload?: (file: File) => Promise<UploadedImage>;
    initialContent: JSONContent;
    onChange: (content: JSONContent) => void;
};

export function RichEditor({ postId, upload, initialContent, onChange }: RichEditorProps) {
    const [uploading, setUploading] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const editorRef = useRef<Editor | null>(null);

    const insertImage = useCallback(
        async (file: File) => {
            const editor = editorRef.current;
            if (!editor) return;
            setUploadError("");
            setUploading((count) => count + 1);
            try {
                const image = upload ? await upload(file) : await uploadJournalImage(postId ?? "", file);
                editor
                    .chain()
                    .focus()
                    .insertContent({
                        type: "image",
                        attrs: { src: image.url, alt: "", naturalWidth: image.width, naturalHeight: image.height },
                    })
                    .run();
            } catch (error) {
                setUploadError(error instanceof Error ? error.message : "Upload failed.");
            } finally {
                setUploading((count) => count - 1);
            }
        },
        [postId, upload],
    );

    const editor = useEditor({
        extensions: [starterKit, EditorImage],
        content: initialContent,
        immediatelyRender: false,
        // Toolbar buttons (heading, bold, lists) must show the state of the text under the cursor.
        shouldRerenderOnTransaction: true,
        editorProps: {
            attributes: {
                class: "journal-prose prose max-w-none min-h-[420px] px-4 py-5 sm:px-6 focus:outline-none [&_img]:max-w-full",
                "aria-label": "Article body",
            },
            handlePaste: (_view, event) => {
                const files = Array.from(event.clipboardData?.files ?? []).filter((file) => file.type.startsWith("image/"));
                files.forEach((file) => void insertImage(file));
                return files.length > 0;
            },
            handleDrop: (_view, event) => {
                const files = Array.from(event.dataTransfer?.files ?? []).filter((file) => file.type.startsWith("image/"));
                files.forEach((file) => void insertImage(file));
                return files.length > 0;
            },
        },
        onCreate: ({ editor: created }) => {
            editorRef.current = created;
        },
        onUpdate: ({ editor: updated }) => onChange(updated.getJSON()),
    });

    if (!editor) {
        return <div className="min-h-[480px] animate-pulse rounded-md border bg-muted/40" aria-label="Loading editor" />;
    }

    return (
        <div className="overflow-x-clip rounded-md border bg-card">
            <TooltipProvider delayDuration={300}>
                <ToolbarProvider editor={editor}>
                    {/* One scrolling row on phones so every button stays reachable. */}
                    <div className="sticky top-14 z-20 flex items-center gap-0.5 overflow-x-auto border-b bg-card/95 px-2 py-1.5 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <UndoToolbar />
                        <RedoToolbar />
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <HeadingToolbar />
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <BoldToolbar />
                        <ItalicToolbar />
                        <StrikeThroughToolbar />
                        <LinkToolbar />
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <BulletListToolbar />
                        <OrderedListToolbar />
                        <BlockquoteToolbar />
                        <HorizontalRuleToolbar />
                        <Separator orientation="vertical" className="mx-1 h-6" />
                        <ImageUploadToolbar onPick={insertImage} busy={uploading > 0} error={uploadError} />
                    </div>
                </ToolbarProvider>
            </TooltipProvider>
            {uploadError && (
                <p role="alert" className="border-b border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
                    {uploadError}
                </p>
            )}
            <EditorContent editor={editor} />
            <p className="border-t px-4 py-2 text-xs text-muted-foreground">
                Tip: paste or drag an image straight into the text. Click an image to resize or align it.
            </p>
        </div>
    );
}
