import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EnquireButton } from "./EnquireButton";
import { categories } from "./categories";

const footerLinks = [
    { label: "Home", href: "/" },
    { label: "House of Arshiya", href: "/about" },
    ...categories.map((category) => ({ label: category.title, href: `/${category.slug}` })),
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
    return (
        <footer className="bg-espresso-deep text-ivory">
            <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr] lg:gap-16">
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                        <Link href="/" aria-label="House of Arshiya home" className="inline-block">
                            <Image
                                src="/arshiya-logo.png"
                                alt="Arshiya"
                                width={165}
                                height={99}
                                className="h-[100px] w-auto object-contain sm:h-[112px]"
                            />
                        </Link>
                        <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-gold">
                            The Art of Haute Couture Hand Embroidery
                        </p>
                        <p className="mt-5 max-w-sm text-sm leading-7 text-ivory/72">
                            An independent hand-embroidery atelier collaborating with international
                            fashion houses and designers.
                        </p>
                    </div>

                    <div className="border-t border-gold/20 pt-7 sm:border-t-0 sm:pt-0">
                        <h2 className="text-center text-[10px] uppercase tracking-[0.3em] text-gold sm:text-left">
                            Explore
                        </h2>
                        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-1">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-xs text-ivory/75 transition-colors duration-300 hover:text-gold"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-gold/20 pt-7 sm:border-t-0 sm:pt-0">
                        <h2 className="text-center text-[10px] uppercase tracking-[0.3em] text-gold sm:text-left">
                            Begin a Conversation
                        </h2>
                        <a
                            href="mailto:hautecouture@arshiya.uk"
                            className="mx-auto mt-5 flex w-fit items-center gap-2 text-center text-sm text-ivory/85 transition-colors hover:text-gold sm:mx-0 sm:text-left"
                        >
                            hautecouture@arshiya.uk
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                            href="https://www.instagram.com/arshiya.uk/"
                            target="_blank"
                            rel="noreferrer"
                            className="mx-auto mt-4 flex w-fit items-center gap-2 text-xs text-ivory/72 transition-colors hover:text-gold sm:mx-0"
                        >
                            Instagram · @arshiya.uk
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <EnquireButton className="mx-auto mt-8 flex w-fit min-h-11 items-center justify-center gap-3 border border-gold/45 px-5 text-[9px] uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep sm:mx-0">
                            Contact the Atelier
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </EnquireButton>
                    </div>
                </div>

            </div>
            <div className="border-t border-gold/15">
                <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left lg:px-12">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-ivory/65">
                        © 2026 House of Arshiya. All rights reserved.
                    </p>
                    <p className="font-display text-sm italic text-ivory/72">
                        Where Vision Becomes Artistry.
                    </p>
                    <a
                        href="https://www.instagram.com/arshiya.uk/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] uppercase tracking-[0.18em] text-ivory/65 transition-colors hover:text-gold"
                    >
                        Instagram · @arshiya.uk
                    </a>
                </div>
            </div>
        </footer>
    );
}
