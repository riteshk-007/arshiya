"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

type ImageUploadToolbarProps = {
	/** Uploads one image and inserts it into the article. Throws a readable Error on failure. */
	onPick: (file: File) => Promise<void>;
	busy: boolean;
	error: string;
};

/** Opens the file picker; the editor decides how the file is stored (our own R2 upload, never inline data). */
const ImageUploadToolbar = ({ onPick, busy, error }: ImageUploadToolbarProps) => {
	const { editor } = useToolbar();
	const input = React.useRef<HTMLInputElement>(null);

	return (
		<>
			<input
				ref={input}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (file) void onPick(file);
				}}
			/>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						disabled={busy || !editor}
						onClick={() => input.current?.click()}
						aria-label="Insert image"
					>
						{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>{error || "Insert image"}</span>
				</TooltipContent>
			</Tooltip>
		</>
	);
};

export { ImageUploadToolbar };
