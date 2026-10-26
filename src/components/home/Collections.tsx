import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { categories } from "./categories";

export function Collections() {
    return (
        <section id="our-craft" className="scroll-mt-20 bg-espresso-deep px-5 py-14 sm:px-8 sm:py-16 lg:px-14 lg:py-20">
            <div className="mx-auto max-w-[1600px]">
                <Reveal className="mb-8 max-w-xl sm:mb-10">
                    <p className="font-display text-xl font-light leading-relaxed text-ivory/90 sm:text-2xl">
                        Rooted in Indian embroidery traditions, each discipline is guided by the
                        designer&apos;s vision and crafted by hand.
                    </p>
                </Reveal>

                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4 xl:gap-6">
                    {categories.map((item, index) => (
                        <Reveal key={item.slug} delay={index * 0.06}>
                            <Link
                                href={`/${item.slug}`}
                                className="group relative block aspect-[3/4] overflow-hidden border border-gold/25 bg-espresso transition-colors duration-500 hover:border-gold/60 xl:aspect-[4/5]"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    sizes="(min-width: 1280px) 25vw, 50vw"
                                    className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${item.imagePosition}`}
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/95 via-espresso-deep/10 to-espresso-deep/10" />
                                <div className="absolute inset-x-0 top-0 h-2/5 bg-linear-to-b from-espresso-deep/85 via-espresso-deep/45 to-transparent" />
                                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
                                    <div>
                                        <Icon name={item.icon} className="h-8 w-8 text-gold sm:h-9 sm:w-9" />
                                        <h3 className="mt-3 max-w-[11rem] text-[10px] uppercase leading-normal tracking-[0.22em] text-ivory sm:text-xs">
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
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
