"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Friendly message instead of a crash page, e.g. when cloud storage cannot be reached. */
export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <Card className="mx-auto mt-10 max-w-md">
            <CardContent className="space-y-4 py-8 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" />
                <div className="space-y-1">
                    <p className="font-medium">Something went wrong</p>
                    <p className="text-sm text-muted-foreground">
                        {process.env.NODE_ENV === "development" ? error.message : "Please try again. Nothing was changed if the action did not finish."}
                    </p>
                </div>
                <Button onClick={reset}>Try again</Button>
            </CardContent>
        </Card>
    );
}
