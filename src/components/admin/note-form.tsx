"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNoteAction } from "@/app/admin/actions";

export function NoteForm({ enquiryId }: { enquiryId: string }) {
    const [state, formAction, pending] = useActionState(addNoteAction, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-3">
            <input type="hidden" name="enquiryId" value={enquiryId} />
            <Textarea
                name="body"
                required
                rows={3}
                maxLength={2000}
                placeholder="Add a private note, e.g. called on Monday, sent price list…"
                aria-label="Note"
            />
            {state?.error && (
                <p role="alert" className="text-sm text-destructive">
                    {state.error}
                </p>
            )}
            <Button type="submit" className="h-10 w-full sm:w-auto" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Add note
            </Button>
        </form>
    );
}
