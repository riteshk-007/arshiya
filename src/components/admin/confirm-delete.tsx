"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteProps = {
    /** A server action already bound to its arguments. */
    action: () => Promise<void>;
    title: string;
    description: string;
    /** "button" is a full destructive button; "icon" is a small icon-only button. */
    variant?: "button" | "icon";
    label?: string;
};

export function ConfirmDelete({ action, title, description, variant = "button", label = "Delete" }: ConfirmDeleteProps) {
    const [pending, startTransition] = useTransition();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {variant === "icon" ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={label}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="destructive" className="h-10 w-full sm:w-auto">
                        <Trash2 className="h-4 w-4" />
                        {label}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={pending}
                        className="bg-destructive text-white hover:bg-destructive/90"
                        onClick={(event) => {
                            event.preventDefault();
                            startTransition(() => action());
                        }}
                    >
                        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {label}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
