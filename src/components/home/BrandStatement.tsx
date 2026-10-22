import Image from "next/image";
import { Reveal } from "./Reveal";
import { images } from "./images";

export function BrandStatement() {
    return (
        <section className="bg-ivory px-6 py-20 text-espresso sm:py-28 lg:px-12 lg:py-36">
            <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden">
                    <Image
                        src={images.statement}
                        alt="An intimate view of a bridal couture design in a Mumbai atelier"
                        fill
                        sizes="(min-width: 768px) 35vw, 90vw"
                        className="object-cover"
                    />
                </Reveal>

                <Reveal className="max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold-antique">
                        House of Arshiya
                    </p>
                    <h2 className="mt-5 font-display text-4xl font-light leading-[1.12] sm:text-5xl">
                        Craft rooted in heritage. Made for what comes next.
                    </h2>
                    <div className="mt-7 space-y-4 text-sm leading-relaxed text-espresso/80">
                        <p>
                            Rooted in the rich traditions of Indian embroidery, House of Arshiya brings
                            together artisanal expertise, contemporary innovation and a profound appreciation
                            for the art of detail.
                        </p>
                        <p>
                            From initial concepts and experimental sampling to intricate couture
                            embellishments, we work in close partnership with designers to realise their
                            distinctive creative visions.
                        </p>
                    </div>
                    <p className="mt-8 font-display text-xl italic text-gold-antique">
                        Your vision. Our craftsmanship. One extraordinary creation.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
