import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Atelier } from "@/components/home/Atelier";
import { BrandStatement } from "@/components/home/BrandStatement";
import { EnquireButton } from "@/components/home/EnquireButton";
import { Philosophy } from "@/components/home/Philosophy";

export const metadata: Metadata = {
    title: "About House of Arshiya",
    description:
        "Meet House of Arshiya: an independent hand-embroidery atelier of skilled artisans collaborating with international fashion houses and designers.",
    alternates: { canonical: "/about" },
    openGraph: { type: "website", url: "/about", title: "About House of Arshiya" },
};

export default function AboutPage() {
    return (
        <>
            <main>
                <section className="bg-espresso-deep px-6 pb-14 pt-36 text-ivory sm:pt-44 lg:px-14">
                    <div className="mx-auto max-w-[1600px]">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gold">About Us</p>
                        <h1 className="mt-5 font-display text-5xl font-light leading-[1.05] sm:text-7xl">
                            House of <span className="italic text-gold">Arshiya</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-sm font-light leading-[1.85] text-ivory/85">
                            An independent hand-embroidery atelier collaborating with international fashion
                            houses and designers to transform creative visions into extraordinary
                            expressions of craftsmanship.
                        </p>
                    </div>
                </section>
                <BrandStatement />
                <Atelier />
                <Philosophy />
                <section className="bg-espresso-deep px-6 py-16 text-center text-ivory">
                    <p className="font-display text-3xl font-light italic text-gold sm:text-4xl">
                        Your Imagination. Our Expertise.
                    </p>
                    <EnquireButton className="group mt-8 inline-flex items-center gap-4 border border-gold/60 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-espresso-deep">
                        Begin a Collaboration
                        <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                            strokeWidth={1.25}
                        />
                    </EnquireButton>
                </section>
            </main>
        </>
    );
}
