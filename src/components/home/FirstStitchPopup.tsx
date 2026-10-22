"use client";

import Image from "next/image";
import { useEffect, useRef, type FormEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import { images } from "./images";

type FirstStitchProps = {
    onClose: () => void;
};

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
            className="fixed inset-0 m-auto max-h-[min(90vh,760px)] w-[min(94vw,960px)] max-w-none overflow-y-auto border border-gold/25 bg-espresso-deep p-0 text-ivory shadow-2xl backdrop:bg-espresso-deep/80 backdrop:backdrop-blur-sm"
        >
            <div className="grid min-h-[560px] md:grid-cols-2">
                <div className="relative hidden min-h-[560px] md:block">
                    <Image
                        src={images.firstStitch}
                        alt="Bridal couture design sketch from the atelier"
                        fill
                        sizes="(min-width: 768px) 45vw, 0vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/65 via-transparent to-espresso-deep/10" />
                    <p className="absolute bottom-8 left-8 max-w-xs font-display text-2xl italic text-ivory">
                        Your vision, thoughtfully brought to life.
                    </p>
                </div>

                <div className="relative flex items-center px-7 py-12 sm:px-12">
                    <button
                        type="button"
                        aria-label="Close swatch request"
                        onClick={onClose}
                        className="absolute right-5 top-5 text-ivory/70 transition-colors hover:text-gold"
                    >
                        <X className="h-5 w-5" strokeWidth={1.25} />
                    </button>

                    <div className="w-full">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
                            An Invitation from Our Atelier
                        </p>
                        <h2
                            id="first-stitch-title"
                            className="mt-4 font-display text-4xl font-light uppercase leading-tight sm:text-5xl"
                        >
                            The First Stitch
                        </h2>
                        <p className="mt-4 font-display text-2xl italic text-gold">
                            Your Vision. Our First Stitch.
                        </p>
                        <p className="mt-5 text-sm leading-relaxed text-ivory/65">
                            Share a sketch, reference or early idea. Our atelier welcomes selected
                            introductory sampling enquiries from fashion houses and designers.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                    Your name
                                </span>
                                <input
                                    name="name"
                                    autoComplete="name"
                                    required
                                    className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                    placeholder="Name"
                                />
                            </label>

                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                    Fashion house / company
                                </span>
                                <input
                                    name="company"
                                    autoComplete="organization"
                                    className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                    placeholder="Company name"
                                />
                            </label>

                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                    Email address
                                </span>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                    placeholder="you@example.com"
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                        Country
                                    </span>
                                    <input
                                        name="country"
                                        autoComplete="country-name"
                                        className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                        placeholder="Country"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                        Nature of enquiry
                                    </span>
                                    <select
                                        name="enquiry"
                                        defaultValue=""
                                        className="mt-2 w-full border-b border-ivory/25 bg-espresso-deep py-3 text-sm text-ivory outline-none focus:border-gold"
                                    >
                                        <option value="" disabled>Select one</option>
                                        <option>Haute couture embroidery</option>
                                        <option>Bridal embroidery</option>
                                        <option>Couture accessories</option>
                                        <option>Sampling and development</option>
                                        <option>Other collaboration</option>
                                    </select>
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                    Project description
                                </span>
                                <textarea
                                    name="brief"
                                    rows={3}
                                    required
                                    className="mt-2 w-full resize-y border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                    placeholder="Tell us about your design, materials or creative direction"
                                />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                        Estimated timeline
                                    </span>
                                    <input
                                        name="timeline"
                                        className="mt-2 w-full border-b border-ivory/25 bg-transparent py-3 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/35 focus:border-gold"
                                        placeholder="e.g. Autumn 2026"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-ivory/65">
                                        Design references
                                    </span>
                                    <input
                                        name="references"
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        className="mt-2 block w-full text-xs text-ivory/60 file:mr-3 file:border file:border-gold/40 file:bg-transparent file:px-3 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.12em] file:text-gold"
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="group mt-3 inline-flex min-h-14 w-full items-center justify-center gap-4 border border-gold/50 px-6 py-4 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep"
                            >
                                Send Sampling Enquiry
                                <ArrowRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                    strokeWidth={1.25}
                                />
                            </button>
                        </form>

                        <p className="mt-5 text-center text-[9px] uppercase leading-relaxed tracking-[0.17em] text-ivory/40">
                            Introductory samples may be considered after review of the design and project
                            requirements. Your email app will open; attach selected reference files before sending.
                        </p>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
