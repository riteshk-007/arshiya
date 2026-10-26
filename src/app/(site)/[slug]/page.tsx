import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { EnquireButton } from "@/components/home/EnquireButton";
import { Icon } from "@/components/home/Icon";
import { Reveal } from "@/components/home/Reveal";
import { categories, getCategory } from "@/components/home/categories";
import { JsonLd, breadcrumbs } from "@/components/seo/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

type CategoryPageProps = {
    params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = getCategory(slug);

    if (!category) {
        return {};
    }

    const title = category.seoTitle;
    const description = `${category.paragraphs[0]} ${category.paragraphs[1]}`;

    return {
        title,
        description,
        alternates: { canonical: `/${category.slug}` },
        openGraph: {
            type: "website",
            title: `${title} | ${SITE_NAME}`,
            description,
            url: `/${category.slug}`,
            images: [{ url: category.image, alt: category.alt }],
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = getCategory(slug);

    if (!category) {
        notFound();
    }

    const others = categories.filter((item) => item.slug !== category.slug);

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@graph": [
                        breadcrumbs([
                            { name: "Home", url: absoluteUrl("/") },
                            { name: category.title, url: absoluteUrl(`/${category.slug}`) },
                        ]),
                        {
                            "@type": "Service",
                            name: `${category.title} hand embroidery`,
                            serviceType: category.title,
                            description: category.paragraphs.slice(0, 2).join(" "),
                            image: absoluteUrl(category.image),
                            url: absoluteUrl(`/${category.slug}`),
                            provider: { "@id": absoluteUrl("/#organization") },
                            audience: { "@type": "BusinessAudience", name: "Fashion houses and designers" },
                        },
                    ],
                }}
            />
            <main className="bg-espresso-deep text-ivory">
                <section className="grid lg:min-h-svh lg:grid-cols-2">
                    <div className="relative min-h-[360px] pt-28 sm:min-h-[460px] lg:min-h-svh lg:pt-0">
                        <Image
                            src={category.image}
                            alt={category.alt}
                            fill
                            priority
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className={`object-cover ${category.imagePosition}`}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/50 via-transparent to-espresso-deep/20" />
                    </div>

                    <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16 lg:pb-16 lg:pt-36">
                        <Reveal className="mx-auto w-full max-w-xl">
                            <Link
                                href="/#our-craft"
                                className="text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold"
                            >
                                ← All categories
                            </Link>
                            <Icon name={category.icon} className="mt-8 block h-12 w-12 text-gold" />
                            <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-gold">
                                {category.title}
                            </p>
                            <h1 className="mt-4 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                                {category.heading}
                            </h1>
                            <div className="mt-6 space-y-4 text-sm font-light leading-[1.85] text-ivory/80">
                                {category.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                            <p className="mt-6 font-display text-xl italic text-gold">{category.note}</p>
                            <EnquireButton className="group mt-8 inline-flex min-h-14 items-center gap-4 border border-gold/60 px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-espresso-deep">
                                {category.ctaLabel}
                                <ArrowRight
                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    strokeWidth={1.25}
                                />
                            </EnquireButton>
                        </Reveal>
                    </div>
                </section>

                <section className="border-t border-gold/15 px-5 py-12 sm:px-8 lg:px-14">
                    <div className="mx-auto max-w-[1600px]">
                        <p className="mb-6 text-[10px] uppercase tracking-[0.4em] text-gold">
                            Explore More
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3 sm:gap-5">
                            {others.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/${item.slug}`}
                                    className="group relative block aspect-[16/9] overflow-hidden border border-gold/25 transition-colors hover:border-gold/60"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fill
                                        sizes="(min-width: 640px) 33vw, 100vw"
                                        className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${item.imagePosition}`}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-espresso-deep/90 via-espresso-deep/20 to-espresso-deep/30" />
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                                        <div className="flex items-center gap-3">
                                            <Icon name={item.icon} className="h-7 w-7 text-gold" />
                                            <span className="text-[10px] uppercase tracking-[0.22em] text-ivory sm:text-xs">
                                                {item.title}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ivory/80 group-hover:text-gold" strokeWidth={1.25} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
