"use client";

import { useTransition } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateStatusAction } from "@/app/admin/actions";
import { ENQUIRY_STATUSES, STATUS_HINTS, STATUS_LABELS, type EnquiryStatus } from "@/lib/status";
import { StatusBadge, StatusDot } from "./status-badge";

export function StatusMenu({ id, status }: { id: string; status: EnquiryStatus }) {
    const [pending, startTransition] = useTransition();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-full justify-between" disabled={pending}>
                    <StatusBadge status={status} />
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Change status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ENQUIRY_STATUSES.map((value) => (
                    <DropdownMenuItem
                        key={value}
                        className="h-12 gap-3"
                        onSelect={() => startTransition(() => updateStatusAction(id, value))}
                    >
                        <StatusDot status={value} className="h-2.5 w-2.5" />
                        <span className="flex flex-col leading-tight">
                            <span className="text-sm font-medium">{STATUS_LABELS[value]}</span>
                            <span className="text-xs text-muted-foreground">{STATUS_HINTS[value]}</span>
                        </span>
                        {value === status && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
