import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Editor } from "@tiptap/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Used by the Tiptap image node's "duplicate" action: inserts a copy right after the selection. */
export function duplicateContent(editor: Editor) {
  const { selection } = editor.view.state;
  const node = selection.content().content.firstChild;
  if (!node) {
    return;
  }
  editor.chain().insertContentAt(selection.to, node.toJSON(), { updateSelection: true }).focus(selection.to).run();
}
