"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { FirstStitchPopup } from "./FirstStitchPopup";

const slides = [
    {
        src: "/photo-pearls-detail.jpg",
        alt: "Close-up of hand-placed pearls and beadwork on a bridal gown",
        position: "object-[center_40%]",
    },
    {
        src: "/photo-bride-peonies-veil.jpg",
        alt: "Bride in profile wearing a beaded lace gown and pearl headpiece",
        position: "object-[center_28%]",
    },
    {
        src: "/photo-bride-sunrays-veil.jpg",
        alt: "Bride framed by a sweeping tulle veil against a dark wall",
        position: "object-[58%_center]",
    },
];

const SLIDE_INTERVAL_MS = 6500;
const POPUP_SEEN_KEY = "arshiya-first-stitch-popup-seen";
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
    const [isSwatchPopupOpen, setIsSwatchPopupOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, SLIDE_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [activeSlide]);

    useEffect(() => {
        if (isSwatchPopupOpen) {
            return;
        }

        // Only first-time visitors get the popup; storage can be blocked, so fail quietly.
        let popupSeen = false;
        try {
            popupSeen = window.localStorage.getItem(POPUP_SEEN_KEY) !== null;
        } catch {}

        if (popupSeen) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            try {
                window.localStorage.setItem(POPUP_SEEN_KEY, String(Date.now()));
            } catch {}
            setIsSwatchPopupOpen(true);
        }, 5000);

        return () => window.clearTimeout(timeoutId);
    }, [isSwatchPopupOpen]);

    return (
        <>
        <section id="top" className="relative min-h-[88svh] overflow-hidden bg-espresso-deep">
            {/* Carousel: embroidery on the right, fading into the text side */}
            <div className="absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[62%] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_48%)]">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, ease }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={slides[activeSlide].src}
                            alt={slides[activeSlide].alt}
                            fill
                            sizes="(min-width: 1024px) 62vw, 100vw"
                            priority={activeSlide === 0}
                            className={`object-cover ${slides[activeSlide].position}`}
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-espresso-deep/60 lg:hidden" />
                <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/70 via-transparent to-espresso-deep/40" />
            </div>

            <div className="relative mx-auto flex min-h-[88svh] max-w-[1600px] items-center px-6 pb-24 pt-36 sm:pb-28 sm:pt-40 lg:px-14">
                <div className="max-w-xl">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease }}
                        className="text-[10px] uppercase tracking-[0.5em] text-gold"
                    >
                        House of Arshiya
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.38, ease }}
                        className="mt-3 whitespace-nowrap font-display text-[13px] uppercase tracking-[0.2em] text-ivory/90 min-[400px]:text-base min-[400px]:tracking-[0.28em] sm:text-lg sm:tracking-[0.34em]"
                    >
                        Fashion is a work of art
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.45, ease }}
                        className="mt-6 font-display text-[2.7rem] font-light leading-[1.05] text-ivory min-[400px]:text-5xl sm:text-7xl lg:text-[5.4rem]"
                    >
                        Where Vision
                        <br />
                        Becomes <span className="italic text-gold">Artistry.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7, ease }}
                        className="mt-8 text-[9px] uppercase tracking-[0.25em] text-gold sm:text-[10px] sm:tracking-[0.3em]"
                    >
                        The Art of Haute Couture Hand Embroidery
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.85, ease }}
                        className="mt-7 max-w-md text-sm font-light leading-[1.85] text-ivory/85"
                    >
                        An independent hand-embroidery atelier collaborating with international fashion
                        houses and designers to transform creative visions into extraordinary
                        expressions of craftsmanship.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1, ease }}
                        className="mt-10"
                    >
                        <button
                            type="button"
                            onClick={() => setIsSwatchPopupOpen(true)}
                            className="group inline-flex items-center gap-4 border border-gold/60 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-espresso-deep"
                        >
                            Begin a Collaboration
                            <ArrowRight
                                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                                strokeWidth={1.25}
                            />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Slide index */}
            <div className="absolute bottom-10 right-6 z-10 flex items-center gap-3 lg:right-14">
                {slides.map((slide, index) => (
                    <button
                        key={slide.src}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Show slide ${index + 1}`}
                        aria-current={index === activeSlide}
                        className="group py-3"
                    >
                        <span
                            className={`block h-px transition-all duration-700 ${
                                index === activeSlide
                                    ? "w-12 bg-gold"
                                    : "w-6 bg-ivory/35 group-hover:bg-ivory/70"
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Scroll cue */}
            <a
                href="#our-craft"
                aria-label="Scroll to our craft"
                className="absolute bottom-8 left-6 hidden flex-col items-start gap-4 text-[9px] uppercase tracking-[0.4em] text-ivory/70 transition-colors hover:text-gold sm:flex lg:left-14"
            >
                Scroll
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40">
                    <ArrowDown className="h-4 w-4 text-gold" strokeWidth={1.25} />
                </span>
            </a>
        </section>
        {isSwatchPopupOpen && (
            <FirstStitchPopup onClose={() => setIsSwatchPopupOpen(false)} />
        )}
        </>
    );
}
