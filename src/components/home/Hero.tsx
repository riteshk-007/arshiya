"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { EnquireButton } from "./EnquireButton";

const allSlides: { src: string; alt: string; position: string; original?: boolean }[] = [
    {
        src: "/photo-bride-peonies-veil.jpg",
        original: true,
        alt: "Bride in profile wearing a beaded lace gown and pearl headpiece",
        position: "object-[center_30%]",
    },
    {
        src: "/photo-embroidery-gold-beads.jpg",
        alt: "Close-up of gold bead and red thread embroidery with turquoise sequins",
        position: "object-center",
    },
    {
        src: "/photo-embroidery-crystals.jpg",
        alt: "Close-up of hand-set crystals on couture embroidery",
        position: "object-center",
    },
    {
        src: "/photo-bride-sunrays-veil.jpg",
        original: true,
        alt: "Bride framed by a sweeping tulle veil against a dark wall",
        position: "object-[58%_center]",
    },
    {
        src: "/photo-embroidery-teal-sequins.jpg",
        alt: "Close-up of teal sequin and bead embroidery in a flowing pattern",
        position: "object-center",
    },
    {
        src: "/photo-embroidery-black-beads.jpg",
        alt: "Close-up of black beads and pearls embroidered in rows",
        position: "object-center",
    },
    {
        src: "/photo-pearls-detail.jpg",
        original: true,
        alt: "Hand-placed pearls and beadwork on a bridal gown",
        position: "object-[center_40%]",
    },
    {
        src: "/photo-embroidery-red-sequins.jpg",
        alt: "Close-up of red sequin embroidery",
        position: "object-center",
    },
    {
        src: "/photo-embroidery-beaded-trim.jpg",
        alt: "Close-up of beaded trim in black, silver and crystal",
        position: "object-center",
    },
];

/** The original bride photos are hidden while the client reviews the new embroidery close-ups. Set to true to bring them back. */
const SHOW_ORIGINAL_SLIDES = false;
const slides = allSlides.filter((slide) => SHOW_ORIGINAL_SLIDES || !slide.original);

const SLIDE_INTERVAL_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, SLIDE_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [activeSlide]);

    return (
        <section id="top" className="relative overflow-hidden bg-espresso-deep lg:min-h-[88svh]">
            {/* Carousel: a clear image block on mobile, and on desktop a right-hand panel fading into the text side */}
            <div className="relative h-[58svh] min-h-[380px] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[62%] lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.55)_22%,black_48%)]">
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
                <div className="absolute inset-0 bg-linear-to-t from-espresso-deep via-transparent via-45% to-espresso-deep/55 lg:from-espresso-deep/70 lg:via-transparent lg:to-espresso-deep/40" />
            </div>

            <div className="relative z-10 mx-auto -mt-24 flex max-w-[1600px] items-center px-6 pb-20 sm:-mt-28 lg:mt-0 lg:min-h-[88svh] lg:px-14 lg:pb-28 lg:pt-40">
                <div className="max-w-xl">
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease }}
                        className="text-[10px] uppercase tracking-[0.5em] text-gold"
                    >
                        House of Arshiya
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, delay: 0.45, ease }}
                        className="mt-6 font-display text-[2.7rem] font-light leading-[1.05] text-ivory min-[400px]:text-5xl sm:text-7xl lg:text-[5.4rem]"
                    >
                        Fashion is
                        <br />
                        a work of <span className="italic text-gold">art.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.85, ease }}
                        className="mt-8 max-w-md text-sm font-light leading-[1.85] text-ivory/85"
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
                        <EnquireButton
                            className="group inline-flex items-center gap-4 border border-gold/60 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-espresso-deep"
                        >
                            Begin a Collaboration
                            <ArrowRight
                                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                                strokeWidth={1.25}
                            />
                        </EnquireButton>
                    </motion.div>
                </div>
            </div>

            {/* Slide index */}
            <div className="absolute right-6 top-[calc(58svh-8.5rem)] z-20 flex items-center gap-3 lg:bottom-10 lg:right-14 lg:top-auto">
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
    );
}
