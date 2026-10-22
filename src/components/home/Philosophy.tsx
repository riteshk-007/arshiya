import Image from "next/image";
import { Reveal } from "./Reveal";
import { images } from "./images";

export function Philosophy() {
    return (
        <section id="philosophy" className="scroll-mt-24 grid bg-cream text-espresso lg:grid-cols-2">
            <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
                <Reveal className="mx-auto max-w-xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold-antique">
                        Our Philosophy
                    </p>
                    <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                        A Shared Pursuit of Excellence
                    </h2>
                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-espresso/80">
                        <p>
                            Exceptional craftsmanship begins with respect — for the designer&apos;s vision,
                            the materials we work with and the artisans whose hands bring each creation
                            to life.
                        </p>
                        <p>
                            Our philosophy is rooted in collaboration, discretion, creativity and an
                            unwavering commitment to detail. We explore new artistic possibilities
                            while honouring the traditions of hand embroidery.
                        </p>
                        <p>
                            Rather than imposing a signature aesthetic, we seek to understand and enhance
                            each designer&apos;s creative language. Our role is to translate imagination into
                            exceptional craftsmanship, allowing the designer&apos;s identity to remain at the
                            forefront.
                        </p>
                    </div>
                    <p className="mt-7 font-display text-2xl italic text-gold-antique">
                        Your vision is our inspiration.
                    </p>
                </Reveal>
            </div>
            <div className="relative min-h-[420px] overflow-hidden lg:min-h-[640px]">
                <Image
                    src={images.philosophy}
                    alt="A bride and couture creation in the atelier"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
        </section>
    );
}
