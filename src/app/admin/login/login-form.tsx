"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../actions";

export function LoginForm() {
    const [state, formAction, pending] = useActionState(loginAction, undefined);
    const [show, setShow] = useState(false);

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    maxLength={64}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={show ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        maxLength={128}
                        className="h-11 pr-11"
                    />
                    <button
                        type="button"
                        onClick={() => setShow((value) => !value)}
                        aria-label={show ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {state?.error && (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {state.error}
                </p>
            )}

            <Button type="submit" className="h-11 w-full" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                {pending ? "Signing in…" : "Sign in"}
            </Button>
        </form>
    );
}
