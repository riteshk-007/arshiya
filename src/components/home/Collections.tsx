import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";
import { images } from "./images";

const items: {
    num: string;
    title: string;
    href: string;
    image: string;
    alt: string;
    summary: string;
    icon: IconName;
}[] = [
    {
        num: "01",
        icon: "couture",
        title: "Haute Couture",
        href: "#haute-couture",
        image: images.collectionCouture,
        alt: "Beaded lace couture bodice and pearl headpiece",
        summary: "An expression of extraordinary craftsmanship.",
    },
    {
        num: "02",
        icon: "bridal",
        title: "Bridal Embroidery",
        href: "#bridal",
        image: images.collectionBridal,
        alt: "Bridal gown with beaded lace appliqué",
        summary: "The poetry of detail.",
    },
    {
        num: "03",
        icon: "accessories",
        title: "Couture Accessories",
        href: "#accessories",
        image: images.collectionLibrary,
        alt: "Pearl embellishment close-up",
        summary: "Artistry beyond the garment.",
    },
    {
        num: "04",
        icon: "half-scale",
        title: "Half-Scale Exploration",
        href: "#half-scale",
        image: images.collectionBespoke,
        alt: "Couture design sketches pinned in the atelier",
        summary: "Where ideas take form.",
    },
];

export function Collections() {
    return (
        <section id="our-craft" className="scroll-mt-24 bg-espresso-deep px-5 py-20 sm:px-8 sm:py-24 lg:px-14 lg:py-32">
            <div className="mx-auto max-w-[1600px]">
                <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:mb-14 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <p className="text-[10px] uppercase tracking-[0.45em] text-gold">Our Craft</p>
                        <h2 className="mt-4 font-display text-4xl font-light leading-[1.08] text-ivory sm:text-5xl lg:text-6xl">
                            A world of <span className="italic text-gold">embroidery.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm font-light leading-[1.85] text-ivory/72">
                        Rooted in Indian embroidery traditions, each discipline is guided by the
                        designer&apos;s vision and crafted by hand.
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4 xl:gap-6">
                    {items.map((item, index) => (
                        <Reveal key={item.num} delay={index * 0.08}>
                            <a
                                href={item.href}
                                className="group relative block aspect-[3/4] overflow-hidden border border-gold/25 bg-espresso transition-colors duration-500 hover:border-gold/60"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    sizes="(min-width: 1280px) 25vw, 50vw"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/95 via-espresso-deep/10 to-espresso-deep/25" />
                                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
                                    <div>
                                        <Icon name={item.icon} className="h-8 w-8 text-gold sm:h-9 sm:w-9" />
                                        <p className="mt-3 text-[10px] tracking-[0.25em] text-ivory/88">{item.num}</p>
                                        <h3 className="mt-2 max-w-[11rem] text-[10px] uppercase leading-[1.5] tracking-[0.22em] text-ivory sm:text-xs">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <ArrowUpRight
                                        className="h-4 w-4 shrink-0 text-ivory/80 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                                        strokeWidth={1.25}
                                    />
                                </div>
                                <p className="absolute inset-x-0 bottom-0 p-4 font-display text-lg italic leading-snug text-ivory sm:p-6 sm:text-xl">
                                    {item.summary}
                                </p>
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
