"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import {
    ENQUIRY_TYPES,
    MAX_FILES,
    MAX_FILE_BYTES,
    MAX_TOTAL_BYTES,
} from "@/lib/enquiry-types";

type EnquiryFormProps = {
    /** Where the form is shown, saved with the enquiry. */
    source: "popup" | "contact";
};

type Status =
    | { state: "idle" }
    | { state: "sending" }
    | { state: "error"; message: string }
    | { state: "success"; reference?: string };

const fieldLabel = "text-[9px] uppercase tracking-[0.25em] text-ivory/72";
const fieldInput =
    "mt-1 w-full border-b border-ivory/25 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/50 focus:border-gold";

/** The one enquiry form used by the popup and the contact page. Saves to the database. */
export function EnquiryForm({ source }: EnquiryFormProps) {
    const [status, setStatus] = useState<Status>({ state: "idle" });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status.state === "sending") {
            return;
        }

        const form = event.currentTarget;
        const data = new FormData(form);
        data.set("source", source);
        data.set("page", window.location.pathname);

        const files = data.getAll("references").filter((item): item is File => item instanceof File && item.size > 0);
        if (files.length > MAX_FILES) {
            setStatus({ state: "error", message: `Please attach at most ${MAX_FILES} files.` });
            return;
        }
        if (files.some((file) => file.size > MAX_FILE_BYTES)) {
            setStatus({ state: "error", message: "Each file must be under 3 MB." });
            return;
        }
        if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
            setStatus({ state: "error", message: "Attachments must be under 4 MB in total." });
            return;
        }

        setStatus({ state: "sending" });
        try {
            const response = await fetch("/api/enquiry", { method: "POST", body: data });
            const result = (await response.json().catch(() => null)) as
                | { ok: true; reference?: string }
                | { ok: false; error?: string }
                | null;

            if (response.ok && result?.ok) {
                form.reset();
                setStatus({ state: "success", reference: result.reference });
                return;
            }
            setStatus({
                state: "error",
                message: (result && !result.ok && result.error) || "Something went wrong. Please try again.",
            });
        } catch {
            setStatus({ state: "error", message: "Could not send. Please check your connection and try again." });
        }
    };

    if (status.state === "success") {
        return (
            <div role="status" className="py-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/60">
                    <Check className="h-5 w-5 text-gold" strokeWidth={1.25} />
                </span>
                <h3 className="mt-5 font-display text-3xl font-light">Thank you</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-ivory/80">
                    Your enquiry has reached our atelier. We aim to respond within 12 hours.
                </p>
                {status.reference && (
                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gold">
                        Reference {status.reference}
                    </p>
                )}
                <button
                    type="button"
                    onClick={() => setStatus({ state: "idle" })}
                    className="mt-7 text-[10px] uppercase tracking-[0.25em] text-ivory/75 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                    Send another enquiry
                </button>
            </div>
        );
    }

    const sending = status.state === "sending";

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Honeypot: hidden from people, tempting to bots. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                        Website
                        <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                </div>

                <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                    <label className="block">
                        <span className={fieldLabel}>Your name</span>
                        <input
                            name="name"
                            autoComplete="name"
                            required
                            maxLength={120}
                            className={fieldInput}
                            placeholder="Name"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Fashion house / company</span>
                        <input
                            name="company"
                            autoComplete="organization"
                            maxLength={160}
                            className={fieldInput}
                            placeholder="Company name"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Email address</span>
                        <input
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            maxLength={200}
                            className={fieldInput}
                            placeholder="you@example.com"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Country</span>
                        <input
                            name="country"
                            autoComplete="country-name"
                            maxLength={80}
                            className={fieldInput}
                            placeholder="Country"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Nature of enquiry</span>
                        <select
                            name="enquiry"
                            defaultValue=""
                            className={`${fieldInput} bg-espresso-deep [color-scheme:dark]`}
                        >
                            <option value="" disabled className="bg-espresso-deep text-ivory/65">
                                Select one
                            </option>
                            {ENQUIRY_TYPES.map((type) => (
                                <option key={type} className="bg-espresso-deep text-ivory">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Estimated timeline</span>
                        <input
                            name="timeline"
                            maxLength={120}
                            className={fieldInput}
                            placeholder="e.g. Autumn 2026"
                        />
                    </label>
                </div>

                <label className="block">
                    <span className={fieldLabel}>Project description</span>
                    <textarea
                        name="brief"
                        rows={2}
                        required
                        maxLength={5000}
                        className={`${fieldInput} resize-none`}
                        placeholder="Tell us about your design, materials or creative direction"
                    />
                </label>

                <label className="block">
                    <span className={fieldLabel}>Design references (JPG, PNG, WEBP or PDF, up to 4 MB)</span>
                    <input
                        name="references"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="mt-2 block w-full text-xs text-ivory/72 file:mr-3 file:border file:border-gold/40 file:bg-transparent file:px-3 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.12em] file:text-gold"
                    />
                </label>

                {status.state === "error" && (
                    <p role="alert" className="border border-red-400/40 px-3 py-2 text-xs leading-relaxed text-red-200">
                        {status.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-4 border border-gold/50 px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep disabled:cursor-wait disabled:opacity-60"
                >
                    {sending ? "Sending…" : "Send Enquiry"}
                    {!sending && (
                        <ArrowRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            strokeWidth={1.25}
                        />
                    )}
                </button>
            </form>

            <p className="mt-4 text-center text-[9px] leading-relaxed tracking-[0.1em] text-ivory/65">
                We aim to respond within 12 hours.
            </p>
        </>
    );
}
