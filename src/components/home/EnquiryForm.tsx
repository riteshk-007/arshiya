"use client";

import type { FormEvent } from "react";
import { ArrowRight } from "lucide-react";

/** Enquiries are sent by opening the visitor's email app with the details filled in. */
const ENQUIRY_EMAIL = "hautecouture@arshiya.uk";

export const enquiryTypes = [
    "Haute couture embroidery",
    "Bridal embroidery",
    "Couture accessories",
    "Half-scale exploration",
    "Sampling and development",
    "Other collaboration",
];

const fieldLabel = "text-[9px] uppercase tracking-[0.25em] text-ivory/72";
const fieldInput =
    "mt-1 w-full border-b border-ivory/25 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/50 focus:border-gold";

/** The one enquiry form used by the popup and the contact page. Dark-background styling. */
export function EnquiryForm() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const field = (name: string) => String(formData.get(name) ?? "").trim();
        const references = Array.from((formData.getAll("references") as File[]) ?? [])
            .map((file) => file.name)
            .filter(Boolean)
            .join(", ");
        const enquiry = field("enquiry") || "General enquiry";
        const subject = encodeURIComponent(`${enquiry} — House of Arshiya`);
        const body = encodeURIComponent(
            `Name: ${field("name")}\nFashion house / company: ${field("company")}\nEmail: ${field("email")}\nCountry: ${field("country")}\nNature of enquiry: ${field("enquiry")}\nEstimated timeline: ${field("timeline")}\n\nProject description:\n${field("brief")}\n\nSelected design reference files (please attach them to this email):\n${references || "None selected"}`,
        );

        window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${subject}&body=${body}`;
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                    <label className="block">
                        <span className={fieldLabel}>Your name</span>
                        <input
                            name="name"
                            autoComplete="name"
                            required
                            className={fieldInput}
                            placeholder="Name"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Fashion house / company</span>
                        <input
                            name="company"
                            autoComplete="organization"
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
                            className={fieldInput}
                            placeholder="you@example.com"
                        />
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Country</span>
                        <input
                            name="country"
                            autoComplete="country-name"
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
                            {enquiryTypes.map((type) => (
                                <option key={type} className="bg-espresso-deep text-ivory">
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block">
                        <span className={fieldLabel}>Estimated timeline</span>
                        <input name="timeline" className={fieldInput} placeholder="e.g. Autumn 2026" />
                    </label>
                </div>

                <label className="block">
                    <span className={fieldLabel}>Project description</span>
                    <textarea
                        name="brief"
                        rows={2}
                        required
                        className={`${fieldInput} resize-none`}
                        placeholder="Tell us about your design, materials or creative direction"
                    />
                </label>

                <label className="block">
                    <span className={fieldLabel}>Design references</span>
                    <input
                        name="references"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        className="mt-2 block w-full text-xs text-ivory/72 file:mr-3 file:border file:border-gold/40 file:bg-transparent file:px-3 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.12em] file:text-gold"
                    />
                </label>

                <button
                    type="submit"
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-4 border border-gold/50 px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep"
                >
                    Send Enquiry
                    <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={1.25}
                    />
                </button>
            </form>

            <p className="mt-4 text-center text-[9px] leading-relaxed tracking-[0.1em] text-ivory/65">
                Your email app will open. Please attach your reference files before sending.
            </p>
        </>
    );
}
