"use client";

import Image from "next/image";
import { useEffect, useRef, type FormEvent } from "react";
import { ArrowRight, X } from "lucide-react";

type FirstStitchProps = {
    onClose: () => void;
};

const enquiryTypes = [
    "Haute couture embroidery",
    "Bridal embroidery",
    "Couture accessories",
    "Sampling and development",
    "Other collaboration",
];

const fieldLabel = "text-[9px] uppercase tracking-[0.25em] text-ivory/60";
const fieldInput =
    "mt-1 w-full border-b border-ivory/25 bg-transparent py-2 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-gold";

export function FirstStitchPopup({ onClose }: FirstStitchProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const brief = String(formData.get("brief") ?? "").trim();
        const subject = encodeURIComponent("First Stitch — Introductory Sampling Enquiry");
        const references = Array.from(
            (formData.get("references") as FileList | null) ?? [],
        )
            .map((file) => file.name)
            .join(", ");
        const body = encodeURIComponent(
            `Name: ${name}\nFashion house / company: ${String(formData.get("company") ?? "").trim()}\nEmail: ${email}\nCountry: ${String(formData.get("country") ?? "").trim()}\nNature of enquiry: ${String(formData.get("enquiry") ?? "").trim()}\nEstimated timeline: ${String(formData.get("timeline") ?? "").trim()}\n\nProject description:\n${brief}\n\nSelected design reference files (please attach them to this email):\n${references || "None selected"}`,
        );

        window.location.href = `mailto:hautecouture@arshiya.uk?subject=${subject}&body=${body}`;
    };

    return (
        <dialog
            ref={dialogRef}
            aria-modal="true"
            aria-labelledby="first-stitch-title"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClose={onClose}
            className="fixed inset-0 m-auto max-h-[94svh] w-[min(94vw,920px)] max-w-none overflow-y-auto border border-gold/25 bg-espresso-deep p-0 text-ivory shadow-2xl [scrollbar-color:var(--gold-antique)_transparent] [scrollbar-width:thin] backdrop:bg-espresso-deep/80 backdrop:backdrop-blur-sm"
        >
            <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                <div className="relative hidden md:block">
                    <Image
                        src="/photo-bride-peonies-veil.jpg"
                        alt="Bride in a beaded lace gown, photographed in profile"
                        fill
                        sizes="(min-width: 768px) 40vw, 0vw"
                        className="object-cover object-[center_30%]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/75 via-transparent to-espresso-deep/10" />
                    <p className="absolute bottom-8 left-8 right-8 font-display text-2xl italic leading-snug text-ivory">
                        Your vision, thoughtfully brought to life.
                    </p>
                </div>

                <div className="relative px-6 py-8 sm:px-10 sm:py-9">
                    <button
                        type="button"
                        aria-label="Close sample request"
                        onClick={onClose}
                        className="absolute right-4 top-4 text-ivory/70 transition-colors hover:text-gold"
                    >
                        <X className="h-5 w-5" strokeWidth={1.25} />
                    </button>

                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
                        An Invitation from Our Atelier
                    </p>
                    <h2
                        id="first-stitch-title"
                        className="mt-3 font-display text-3xl font-light leading-tight sm:text-4xl"
                    >
                        The First Stitch
                    </h2>
                    <p className="mt-1 font-display text-xl italic text-gold">
                        Your Vision. Our First Stitch.
                    </p>
                    <p className="mt-3 text-[13px] font-light leading-relaxed text-ivory/65">
                        Share a sketch, reference or early idea. We welcome selected introductory
                        sampling enquiries from fashion houses and designers.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
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
                                    <option value="" disabled className="bg-espresso-deep text-ivory/50">
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
                                <input
                                    name="timeline"
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
                                className="mt-2 block w-full text-xs text-ivory/60 file:mr-3 file:border file:border-gold/40 file:bg-transparent file:px-3 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.12em] file:text-gold"
                            />
                        </label>

                        <button
                            type="submit"
                            className="group inline-flex min-h-12 w-full items-center justify-center gap-4 border border-gold/50 px-6 py-3 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep"
                        >
                            Send Sampling Enquiry
                            <ArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                strokeWidth={1.25}
                            />
                        </button>
                    </form>

                    <p className="mt-4 text-center text-[9px] leading-relaxed tracking-[0.1em] text-ivory/40">
                        Your email app will open. Please attach your reference files before sending.
                    </p>
                </div>
            </div>
        </dialog>
    );
}
