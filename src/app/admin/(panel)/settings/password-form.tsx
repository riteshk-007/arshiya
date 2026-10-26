"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "../../actions";

export function PasswordForm() {
    const [state, formAction, pending] = useActionState(changePasswordAction, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" name="current" type="password" autoComplete="current-password" required maxLength={128} className="h-11" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="next">New password</Label>
                <Input id="next" name="next" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className="h-11" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm">Confirm new password</Label>
                <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className="h-11" />
            </div>

            {state?.error && (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {state.error}
                </p>
            )}
            {state?.success && (
                <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {state.success}
                </p>
            )}

            <Button type="submit" className="h-11 w-full sm:w-auto" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Update password
            </Button>
        </form>
    );
}
