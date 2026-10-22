"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { FirstStitchPopup } from "./FirstStitchPopup";
import { images } from "./images";

const stages = ["Sketch", "Explore", "Develop", "Refine", "Create"];

export function FirstStitch() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <>
            <section id="first-stitch" className="scroll-mt-24 bg-ivory text-espresso">
                <div className="grid lg:min-h-[720px] lg:grid-cols-[1fr_1.05fr]">
                    <div className="relative min-h-[440px] overflow-hidden lg:min-h-[720px]">
                        <Image
                            src={images.firstStitch}
                            alt="Hands carefully hand-stitching embroidery on white fabric"
                            fill
                            sizes="(min-width: 1024px) 48vw, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/55 via-transparent to-transparent" />
                        <p className="absolute bottom-7 left-7 right-7 font-display text-2xl italic text-ivory lg:bottom-10 lg:left-10">
                            From the first sketch to the final stitch.
                        </p>
                    </div>

                    <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
                        <Reveal className="mx-auto w-full max-w-xl">
                            <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.45em] text-gold-antique">
                                The First Stitch
                                <span className="h-px w-12 bg-gold-antique/50" />
                            </p>
                            <h2 className="mt-6 font-display text-4xl font-light leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                                Every Extraordinary Creation Begins with an{" "}
                                <span className="italic text-gold-antique">Idea.</span>
                            </h2>
                            <div className="mt-7 space-y-4 text-sm font-light leading-[1.85] text-espresso/70">
                                <p>
                                    A sketch. A fragment of inspiration. An unexpected material. A vision
                                    waiting to be realised.
                                </p>
                                <p>
                                    The First Stitch is our invitation to fashion houses and designers to
                                    explore bespoke hand embroidery through sampling and development.
                                    Through material exploration, stitch experimentation and thoughtful
                                    sampling, we transform creative references into tangible expressions
                                    of craftsmanship.
                                </p>
                            </div>

                            <ol className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-y border-gold-antique/30 py-5">
                                {stages.map((stage, index) => (
                                    <li
                                        key={stage}
                                        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-espresso/65"
                                    >
                                        <span className="text-gold-antique">0{index + 1}</span>
                                        {stage}
                                    </li>
                                ))}
                            </ol>

                            <p className="mt-7 font-display text-2xl italic text-gold-antique">
                                Your Vision. Our First Stitch.
                            </p>
                            <p className="mt-3 text-xs font-light leading-relaxed text-espresso/55">
                                Complimentary introductory samples may be considered following a review of
                                the proposed design, complexity and project requirements.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsPopupOpen(true)}
                                className="group mt-9 inline-flex min-h-14 items-center gap-4 bg-espresso px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:bg-gold-antique"
                            >
                                Request an Introductory Sample
                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    strokeWidth={1.25}
                                />
                            </button>
                        </Reveal>
                    </div>
                </div>
            </section>
            {isPopupOpen && <FirstStitchPopup onClose={() => setIsPopupOpen(false)} />}
        </>
    );
}
