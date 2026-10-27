/** Languages offered in the website's language menu. `code` is the Google Translate language code. */
export const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Português" },
    { code: "nl", label: "Nederlands" },
    { code: "ru", label: "Русский" },
    { code: "tr", label: "Türkçe" },
    { code: "ar", label: "العربية" },
    { code: "hi", label: "हिन्दी" },
    { code: "ja", label: "日本語" },
    { code: "zh-CN", label: "中文" },
] as const;

const COOKIE = "googtrans";
/** Backup copy of the choice, in case something clears the cookie. */
export const STORAGE_KEY = "arshiya-language";

const isKnown = (code: string | null | undefined): code is string => Boolean(code) && LANGUAGES.some((language) => language.code === code);

/** Every domain a cookie of this site could have been set on: the host and each parent (www.arshiya.uk, arshiya.uk). */
function cookieDomains() {
    const parts = location.hostname.split(".");
    const domains: (string | undefined)[] = [undefined];
    if (parts.length > 1) {
        for (let index = 0; index < parts.length - 1; index++) domains.push(`.${parts.slice(index).join(".")}`);
    }
    return domains;
}

function writeCookie(code: string) {
    for (const domain of cookieDomains()) {
        const scope = domain ? `; domain=${domain}` : "";
        document.cookie =
            code === "en"
                ? `${COOKIE}=; path=/; max-age=0${scope}`
                : `${COOKIE}=/en/${code}; path=/; max-age=31536000; samesite=lax${scope}`;
    }
}

function savedLanguage() {
    try {
        const code = localStorage.getItem(STORAGE_KEY);
        return isKnown(code) ? code : null;
    } catch {
        return null;
    }
}

/** The language currently chosen ("en" when the site is shown as written). Browser only. */
export function currentLanguage(): string {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=/[^/]*/([^;]+)`));
    const fromCookie = match ? decodeURIComponent(match[1]) : null;
    if (isKnown(fromCookie)) return fromCookie;

    // The cookie is gone but the visitor had chosen a language: bring it back.
    const saved = savedLanguage();
    if (saved && saved !== "en") {
        writeCookie(saved);
        return saved;
    }
    return "en";
}

/** Remembers the choice and reloads, so the whole page (and later pages) are translated from the start. */
export function chooseLanguage(code: string) {
    try {
        localStorage.setItem(STORAGE_KEY, code);
    } catch {
        // Private mode: the cookie alone still works.
    }
    writeCookie(code);
    location.reload();
}
