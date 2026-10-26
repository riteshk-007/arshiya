import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    if (await getSession()) {
        redirect("/admin");
    }

    return (
        <main className="flex min-h-svh items-center justify-center px-4 py-10">
            <div className="w-full max-w-sm">
                <div className="mb-6 text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-medium tracking-wide text-muted-foreground">
                        House of Arshiya
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Admin sign in</CardTitle>
                        <CardDescription>Authorised team members only.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Repeated failed attempts lock the account for 15 minutes.
                </p>
            </div>
        </main>
    );
}
