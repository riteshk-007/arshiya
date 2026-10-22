import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { images } from "./images";

export function Collaborations() {
    return (
        <section id="collaborations" className="scroll-mt-24 bg-espresso text-ivory">
            <div className="grid lg:min-h-[640px] lg:grid-cols-12">
                <div className="relative min-h-[380px] overflow-hidden lg:col-span-5 lg:min-h-[640px]">
                    <Image
                        src={images.collectionCouture}
                        alt="A couture design being developed for a designer collaboration"
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="object-cover"
                    />
                </div>
                <div className="flex items-center px-6 py-16 sm:px-12 lg:col-span-7 lg:px-20 lg:py-24">
                    <Reveal className="mx-auto max-w-2xl">
                        <Icon name="collaboration" className="h-12 w-12 text-gold" />
                        <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-gold">
                            Couture Collaborations
                        </p>
                        <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                            An Invitation to Create
                        </h2>
                        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ivory/80">
                            <p>
                                The most extraordinary creations often emerge from the meeting of
                                different creative perspectives.
                            </p>
                            <p>
                                House of Arshiya welcomes collaborations with international fashion
                                houses, independent couture designers, bridal ateliers, luxury accessory
                                brands and creative studios.
                            </p>
                            <p>
                                We offer a dedicated hand-embroidery partnership encompassing concept
                                interpretation, material exploration, bespoke sampling, embroidery
                                development and final execution. We approach every project with artistic
                                curiosity, precision and discretion.
                            </p>
                            <p>
                                We understand the importance of creative ownership and work to preserve
                                the identity and integrity of every designer&apos;s vision.
                            </p>
                        </div>
                        <p className="mt-7 font-display text-2xl italic text-gold">
                            Your Imagination. Our Expertise.
                        </p>
                        <a
                            href="#contact"
                            className="group mt-8 inline-flex items-center gap-4 border border-gold/50 px-7 py-4 text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-gold hover:bg-gold hover:text-espresso-deep"
                        >
                            Begin a Collaboration
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                        </a>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
