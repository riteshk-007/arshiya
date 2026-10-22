import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CreativeProcess } from "./CreativeProcess";
import { Reveal } from "./Reveal";
import { SavoirFaire } from "./SavoirFaire";
import { images } from "./images";

export function Atelier() {
    return (
        <section id="our-atelier" className="scroll-mt-24 bg-espresso-deep text-ivory">
            <div className="grid lg:min-h-[660px] lg:grid-cols-2">
                <div className="relative min-h-[420px] overflow-hidden lg:min-h-[660px]">
                    <Image
                        src={images.artisan}
                        alt="A bridal couture creation photographed inside a bright atelier"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                    />
                </div>

                <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
                    <Reveal className="mx-auto max-w-xl">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
                            Mumbai, India
                        </p>
                        <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                            The Hands Behind the Art
                        </h2>
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/80">
                            <p>
                                Behind every extraordinary embroidered creation lies the skill, patience
                                and dedication of the artisan.
                            </p>
                            <p>
                                House of Arshiya brings together 40 skilled hand-embroidery artisans,
                                united by a shared commitment to craftsmanship and artistic excellence.
                                Drawing upon India&apos;s rich heritage of embroidery, our atelier combines
                                traditional hand techniques with contemporary design sensibilities.
                            </p>
                            <p>
                                Our team works closely with international designers and creative studios,
                                offering the flexibility of an independent atelier alongside the
                                capabilities of an experienced embroidery workshop.
                            </p>
                        </div>
                        <p className="mt-7 font-display text-2xl italic text-gold">
                            Forty Artisans. Countless Stitches. Infinite Possibilities.
                        </p>
                        <a
                            href="#creative-process"
                            className="group mt-8 inline-flex items-center gap-3 border-b border-gold/50 pb-2 text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-gold"
                        >
                            Explore Our Creative Process
                            <ArrowRight
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                strokeWidth={1.25}
                            />
                        </a>
                    </Reveal>
                </div>
            </div>
            <CreativeProcess />
            <SavoirFaire />
        </section>
    );
}
