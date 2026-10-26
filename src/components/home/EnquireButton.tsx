"use client";

import { useState, type ReactNode } from "react";
import { FirstStitchPopup } from "./FirstStitchPopup";

type EnquireButtonProps = {
    children: ReactNode;
    className?: string;
};

/** Button that opens the enquiry form popup. */
export function EnquireButton({ children, className }: EnquireButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={className}>
                {children}
            </button>
            {isOpen && <FirstStitchPopup onClose={() => setIsOpen(false)} />}
        </>
    );
}
