"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navigation = [
    { label: "Home", href: "#top" },
    { label: "Haute Couture", href: "#haute-couture" },
    { label: "Bridal", href: "#bridal" },
    { label: "Accessories", href: "#accessories" },
    { label: "Our Atelier", href: "#our-atelier" },
    { label: "The First Stitch", href: "#first-stitch" },
    { label: "Collaborations", href: "#collaborations" },
    { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const updateScrolled = () => setScrolled(window.scrollY > 36);
        updateScrolled();
        window.addEventListener("scroll", updateScrolled, { passive: true });
        return () => window.removeEventListener("scroll", updateScrolled);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
                    scrolled
                        ? "border-b border-gold/20 bg-espresso-deep/95 backdrop-blur-md"
                        : "bg-linear-to-b from-espresso-deep/80 to-transparent"
                }`}
            >
                <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-5 px-5 py-2 sm:px-8 lg:px-12">
                    <a href="#top" aria-label="House of Arshiya home" className="shrink-0">
                        <Image
                            src="/arshiya-logo.png"
                            alt="Arshiya"
                            width={110}
                            height={66}
                            priority
                            className="h-14 w-auto object-contain sm:h-[62px]"
                        />
                        <span className="mt-0.5 block text-center text-[6px] uppercase tracking-[0.22em] text-gold/80">
                            The Art of Haute Couture Hand Embroidery
                        </span>
                    </a>

                    <nav
                        aria-label="Primary"
                        className="hidden min-w-0 flex-1 items-center justify-end gap-x-3 xl:flex 2xl:gap-x-5"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="group relative whitespace-nowrap py-3 text-[9px] font-medium uppercase tracking-[0.12em] text-ivory/80 transition-colors hover:text-gold 2xl:text-[10px] 2xl:tracking-[0.15em]"
                            >
                                {item.label}
                                <span className="absolute bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                        <a
                            href="#contact"
                            className="ml-3 whitespace-nowrap border border-gold/50 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep 2xl:text-[10px]"
                        >
                            Enquire
                        </a>
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-3 xl:hidden">
                        <a
                            href="#contact"
                            className="border border-gold/50 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-gold hover:text-espresso-deep sm:px-4"
                        >
                            Enquire
                        </a>
                        <button
                            type="button"
                            aria-label="Open navigation menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(true)}
                            className="p-1 text-ivory transition-colors hover:text-gold"
                        >
                            <Menu className="h-6 w-6" strokeWidth={1.25} />
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex flex-col bg-espresso-deep"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
                            <Image
                                src="/arshiya-logo.png"
                                alt="Arshiya"
                                width={88}
                                height={53}
                                className="h-12 w-auto object-contain"
                            />
                            <button
                                type="button"
                                aria-label="Close navigation menu"
                                onClick={() => setMenuOpen(false)}
                                className="text-ivory/75 transition-colors hover:text-gold"
                            >
                                <X className="h-6 w-6" strokeWidth={1.25} />
                            </button>
                        </div>
                        <nav
                            aria-label="Mobile primary"
                            className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto py-8"
                        >
                            {navigation.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="font-display text-2xl font-light uppercase tracking-[0.14em] text-ivory/90 transition-colors hover:text-gold sm:text-3xl"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.035, duration: 0.35 }}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </nav>
                        <p className="pb-8 text-center text-[9px] uppercase tracking-[0.35em] text-gold/70">
                            Mumbai · International Collaborations
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
