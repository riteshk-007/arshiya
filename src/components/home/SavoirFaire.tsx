import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "./images";

export function SavoirFaire() {
    return (
        <section id="half-scale" className="scroll-mt-24 bg-ivory text-espresso">
            <div className="grid lg:min-h-[640px] lg:grid-cols-2">
                <div className="order-2 flex items-center px-6 py-16 sm:px-12 lg:order-1 lg:px-16 lg:py-24">
                    <Reveal className="mx-auto max-w-xl">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold-antique">
                            Half-Scale Exploration
                        </p>
                        <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                            Where Ideas Take Form
                        </h2>
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-espresso/80">
                            <p>
                                The journey from imagination to creation often begins with
                                experimentation. Half-scale development offers an opportunity to explore
                                silhouettes, proportions and embellishment placement through miniature
                                representations of couture designs.
                            </p>
                            <p>
                                This considered approach allows designers to visualise creative concepts,
                                refine decorative compositions and explore the relationship between
                                embroidery and garment structure before progressing to full-scale
                                execution.
                            </p>
                            <p>
                                We value this process as a means of artistic exploration, encouraging
                                experimentation and thoughtful design development.
                            </p>
                        </div>
                        <a
                            href="#contact"
                            className="group mt-8 inline-flex items-center gap-3 border-b border-gold-antique/50 pb-2 text-[10px] uppercase tracking-[0.25em] transition-colors hover:text-gold-antique"
                        >
                            Enquire About Creative Development
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                        </a>
                    </Reveal>
                </div>
                <div className="relative order-1 min-h-[420px] overflow-hidden lg:order-2 lg:min-h-[640px]">
                    <Image
                        src={images.firstStitch}
                        alt="A bridal design sketch used to explore proportions and embroidery placement"
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-top"
                    />
                </div>
            </div>
        </section>
    );
}
