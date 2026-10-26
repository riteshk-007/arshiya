"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FirstStitchPopup } from "./FirstStitchPopup";
import { categories } from "./categories";

const navigation = [
    { label: "Home", href: "/" },
    ...categories.map((category) => ({ label: category.title, href: `/${category.slug}` })),
];

export function SiteHeader() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [enquiryOpen, setEnquiryOpen] = useState(false);

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

    const openEnquiry = () => {
        setMenuOpen(false);
        setEnquiryOpen(true);
    };

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
                    scrolled
                        ? "border-b border-gold/20 bg-espresso-deep/95 backdrop-blur-md"
                        : "bg-linear-to-b from-espresso-deep/85 to-transparent"
                }`}
            >
                <div className="mx-auto flex min-h-[88px] max-w-[1600px] items-center justify-between gap-5 px-5 py-2 sm:min-h-[104px] sm:px-8 lg:px-12">
                    <Link href="/" aria-label="House of Arshiya home" className="shrink-0">
                        <Image
                            src="/arshiya-logo.png"
                            alt="Arshiya"
                            width={176}
                            height={105}
                            priority
                            className="mx-auto h-[68px] w-auto object-contain sm:h-[84px]"
                        />
                        <span className="mt-1 block whitespace-nowrap text-center font-display text-[8px] uppercase tracking-[0.28em] text-gold sm:text-[10px] sm:tracking-[0.36em]">
                            Fashion is a work of art
                        </span>
                    </Link>

                    <nav
                        aria-label="Primary"
                        className="hidden min-w-0 flex-1 items-center justify-end gap-x-6 lg:flex 2xl:gap-x-9"
                    >
                        {navigation.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`group relative whitespace-nowrap py-3 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors hover:text-gold 2xl:text-[11px] ${
                                        active ? "text-gold" : "text-ivory/85"
                                    }`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                                            active ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                        <button
                            type="button"
                            onClick={openEnquiry}
                            className="ml-2 whitespace-nowrap border border-gold/55 px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep"
                        >
                            Enquire
                        </button>
                    </nav>

                    <div className="ml-auto flex shrink-0 items-center gap-3 lg:hidden">
                        <button
                            type="button"
                            onClick={openEnquiry}
                            className="border border-gold/55 px-3.5 py-2 text-[9px] uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-gold hover:text-espresso-deep sm:px-5"
                        >
                            Enquire
                        </button>
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
                        className="fixed inset-0 z-60 flex flex-col bg-espresso-deep"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
                            <Image
                                src="/arshiya-logo.png"
                                alt="Arshiya"
                                width={120}
                                height={72}
                                className="h-14 w-auto object-contain"
                            />
                            <button
                                type="button"
                                aria-label="Close navigation menu"
                                onClick={() => setMenuOpen(false)}
                                className="text-ivory/80 transition-colors hover:text-gold"
                            >
                                <X className="h-6 w-6" strokeWidth={1.25} />
                            </button>
                        </div>
                        <nav
                            aria-label="Mobile primary"
                            className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto py-8"
                        >
                            {navigation.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.35 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`font-display text-3xl font-light uppercase tracking-[0.14em] transition-colors hover:text-gold ${
                                            pathname === item.href ? "text-gold" : "text-ivory/90"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <button
                                type="button"
                                onClick={openEnquiry}
                                className="mt-4 border border-gold/55 px-9 py-4 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors hover:bg-gold hover:text-espresso-deep"
                            >
                                Enquire
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {enquiryOpen && <FirstStitchPopup onClose={() => setEnquiryOpen(false)} />}
        </>
    );
}
