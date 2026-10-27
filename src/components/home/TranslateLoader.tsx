"use client";

import { useEffect } from "react";
import { LANGUAGES, currentLanguage } from "@/lib/translate";

declare global {
    interface Window {
        googleTranslateInit?: () => void;
        google?: { translate: { TranslateElement: new (options: object, element: string) => unknown } };
    }
}

const SCRIPT_URL = "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
const SCRIPT_TRIES = 3;
const CHECK_EVERY_MS = 1500;
const CHECK_TRIES = 10;

/**
 * Loads Google Translate only for visitors who picked a language other than English, so everyone else
 * downloads nothing extra. Its own toolbar is hidden (see globals.css); the site's language menu replaces it.
 *
 * Google's script sometimes loads but does not translate (slow network, a busy page, a blocked request).
 * So after loading it, this checks that the page really was translated and asks Google again if not.
 */
export function TranslateLoader() {
    useEffect(() => {
        const language = currentLanguage();
        if (language === "en") return;

        let cancelled = false;
        const timers: number[] = [];
        const isTranslated = () => /translated-(ltr|rtl)/.test(document.documentElement.className);

        /** Asks Google's hidden language box to switch, the same thing a click on its own menu does. */
        const nudge = () => {
            const box = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
            if (!box) return;
            const wanted = [...box.options].find((option) => option.value === language)?.value;
            if (wanted && box.value !== wanted) {
                box.value = wanted;
                box.dispatchEvent(new Event("change"));
            }
        };

        const watch = (attempt = 0) => {
            if (cancelled || isTranslated() || attempt >= CHECK_TRIES) return;
            if (attempt > 0) nudge();
            timers.push(window.setTimeout(() => watch(attempt + 1), CHECK_EVERY_MS));
        };

        const load = (attempt = 0) => {
            document.getElementById("google-translate-script")?.remove();
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = `${SCRIPT_URL}&t=${attempt}`;
            script.async = true;
            script.onerror = () => {
                if (!cancelled && attempt + 1 < SCRIPT_TRIES) timers.push(window.setTimeout(() => load(attempt + 1), 1500 * (attempt + 1)));
            };
            document.body.appendChild(script);
        };

        window.googleTranslateInit = () => {
            const box = document.getElementById("google_translate_element");
            if (box) box.innerHTML = "";
            new window.google!.translate.TranslateElement(
                { pageLanguage: "en", includedLanguages: LANGUAGES.map((item) => item.code).join(","), autoDisplay: false },
                "google_translate_element",
            );
            watch();
        };

        if (window.google?.translate?.TranslateElement) {
            window.googleTranslateInit();
        } else {
            load();
        }

        return () => {
            cancelled = true;
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, []);

    return <div id="google_translate_element" className="hidden" aria-hidden />;
}
