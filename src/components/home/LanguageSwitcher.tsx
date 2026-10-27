"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LANGUAGES, chooseLanguage, currentLanguage } from "@/lib/translate";

/** Language menu. "menu" is a small dropdown for the top bar; "list" shows every language, for the phone menu. */
export function LanguageSwitcher({ variant = "menu" }: { variant?: "menu" | "list" }) {
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState("en");
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => setLanguage(currentLanguage()), []);

    useEffect(() => {
        if (!open) return;
        const onMouse = (event: MouseEvent) => {
            if (!box.current?.contains(event.target as Node)) setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onMouse);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onMouse);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const pick = (code: string) => {
        setOpen(false);
        if (code !== language) chooseLanguage(code);
    };

    if (variant === "list") {
        return (
            <div className="notranslate mt-2 flex max-w-xs flex-wrap justify-center gap-2" translate="no">
                {LANGUAGES.map((item) => (
                    <button
                        key={item.code}
                        type="button"
                        onClick={() => pick(item.code)}
                        aria-pressed={language === item.code}
                        className={`border px-3 py-1.5 text-xs transition-colors ${
                            language === item.code ? "border-gold bg-gold text-espresso-deep" : "border-gold/35 text-ivory/85 hover:border-gold"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div ref={box} className="notranslate relative" translate="no">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Choose language"
                className="flex items-center gap-1.5 whitespace-nowrap py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory/85 transition-colors hover:text-gold"
            >
                <Globe className="h-4 w-4" strokeWidth={1.25} />
                {language.split("-")[0]}
            </button>
            {open && (
                <ul
                    role="listbox"
                    aria-label="Language"
                    className="absolute right-0 top-full z-10 max-h-[70svh] w-44 overflow-y-auto border border-gold/25 bg-espresso-deep py-2 shadow-xl"
                >
                    {LANGUAGES.map((item) => (
                        <li key={item.code} role="option" aria-selected={language === item.code}>
                            <button
                                type="button"
                                onClick={() => pick(item.code)}
                                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-ivory/90 transition-colors hover:bg-gold/15 hover:text-gold"
                            >
                                {item.label}
                                {language === item.code && <Check className="h-3.5 w-3.5 text-gold" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
