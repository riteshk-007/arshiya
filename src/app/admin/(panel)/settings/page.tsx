import { KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { PasswordForm } from "./password-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
    const session = await requireAdmin();
    const user = await prisma.adminUser.findUnique({
        where: { id: session.userId },
        select: { lastLoginAt: true },
    });

    return (
        <div className="max-w-xl space-y-5">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Signed in as <span className="font-medium text-foreground">{session.username}</span>
                    {user?.lastLoginAt && <> · last sign in {formatDateTime(user.lastLoginAt)}</>}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <KeyRound className="h-4 w-4" /> Change password
                    </CardTitle>
                    <CardDescription>
                        Use at least 12 characters. Changing it signs out every other device.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PasswordForm />
                </CardContent>
            </Card>
        </div>
    );
}
