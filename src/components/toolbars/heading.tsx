"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { cn } from "@/lib/utils";

const levels = [2, 3, 4] as const;

/** Paragraph / Heading dropdown, in the style of the other shadcn-tiptap toolbars. */
const HeadingToolbar = () => {
	const { editor } = useToolbar();
	const active = levels.find((level) => editor?.isActive("heading", { level }));

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 gap-1 px-2 text-sm font-normal">
					{active ? `Heading ${active - 1}` : "Paragraph"}
					<ChevronDown className="h-3.5 w-3.5 opacity-60" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem
					onSelect={() => editor?.chain().focus().setParagraph().run()}
					className={cn(!active && "bg-accent")}
				>
					Paragraph
				</DropdownMenuItem>
				{levels.map((level) => (
					<DropdownMenuItem
						key={level}
						onSelect={() => editor?.chain().focus().toggleHeading({ level }).run()}
						className={cn(active === level && "bg-accent", level === 2 ? "text-lg" : level === 3 ? "text-base" : "text-sm")}
					>
						Heading {level - 1}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { HeadingToolbar };
