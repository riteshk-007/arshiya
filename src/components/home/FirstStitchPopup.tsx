"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";

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
                        aria-label="Close enquiry form"
                        onClick={onClose}
                        className="absolute right-4 top-4 text-ivory/80 transition-colors hover:text-gold"
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
                        Get your Free Swatch Developed.
                    </p>
                    <p className="mb-5 mt-3 text-[13px] font-light leading-relaxed text-ivory/75">
                        Share a sketch, reference or early idea. We welcome selected introductory
                        sampling enquiries from fashion houses and designers.
                    </p>

                    <EnquiryForm source="popup" />
                </div>
            </div>
        </dialog>
    );
}
