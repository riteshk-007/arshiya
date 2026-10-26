"use client";

import { Link2, Link2Off } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { cn } from "@/lib/utils";

/** Adds https:// when missing and refuses anything that is not a web, mail or phone link. */
function cleanHref(value: string) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const withProtocol = /^(https?:|mailto:|tel:)/i.test(trimmed) ? trimmed : trimmed.includes("@") && !trimmed.includes("/") ? `mailto:${trimmed}` : `https://${trimmed}`;
	try {
		const url = new URL(withProtocol);
		return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.toString() : null;
	} catch {
		return null;
	}
}

const LinkToolbar = () => {
	const { editor } = useToolbar();
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [error, setError] = React.useState("");

	function onOpenChange(next: boolean) {
		if (next) {
			setValue(editor?.getAttributes("link").href ?? "");
			setError("");
		}
		setOpen(next);
	}

	function apply() {
		const href = cleanHref(value);
		if (!href) {
			setError("Enter a valid web address, e.g. https://example.com");
			return;
		}
		editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
		setOpen(false);
	}

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<Tooltip>
				<TooltipTrigger asChild>
					<PopoverTrigger asChild>
						<Button variant="ghost" size="icon" className={cn("h-8 w-8", editor?.isActive("link") && "bg-accent")}>
							<Link2 className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
				</TooltipTrigger>
				<TooltipContent>
					<span>Link</span>
				</TooltipContent>
			</Tooltip>
			<PopoverContent align="start" className="w-80 space-y-3">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						apply();
					}}
					className="space-y-3"
				>
					<Input
						value={value}
						onChange={(event) => setValue(event.target.value)}
						placeholder="https://"
						aria-label="Link address"
						autoFocus
					/>
					{error && <p className="text-xs text-destructive">{error}</p>}
					<div className="flex justify-between gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={!editor?.isActive("link")}
							onClick={() => {
								editor?.chain().focus().extendMarkRange("link").unsetLink().run();
								setOpen(false);
							}}
						>
							<Link2Off className="h-4 w-4" /> Remove
						</Button>
						<Button type="submit" size="sm">
							Apply
						</Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	);
};

export { LinkToolbar };
