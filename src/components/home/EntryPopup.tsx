"use client";

import { useEffect, useState } from "react";
import { FirstStitchPopup } from "./FirstStitchPopup";

const POPUP_SEEN_KEY = "arshiya-first-stitch-popup-seen";
const POPUP_DELAY_MS = 5000;

/**
 * Opens the enquiry popup once per visit, whichever page the visitor lands on.
 * Lives in the root layout so it also covers visitors who arrive on an inner page.
 */
export function EntryPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Storage can be blocked, so fail quietly.
        let popupSeen = false;
        try {
            popupSeen = window.sessionStorage.getItem(POPUP_SEEN_KEY) !== null;
        } catch {}

        if (popupSeen) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            try {
                window.sessionStorage.setItem(POPUP_SEEN_KEY, String(Date.now()));
            } catch {}
            setIsOpen(true);
        }, POPUP_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
    }, []);

    return isOpen ? <FirstStitchPopup onClose={() => setIsOpen(false)} /> : null;
}
