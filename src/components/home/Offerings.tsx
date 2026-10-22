import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "./images";

const offerings = [
    {
        id: "haute-couture",
        number: "01",
        eyebrow: "Haute Couture",
        title: "An Expression of Extraordinary Craftsmanship",
        image: images.collectionCouture,
        alt: "Bridal couture embroidery design, developed by hand",
        paragraphs: [
            "Haute couture is where imagination encounters the exceptional skill of the human hand.",
            "At House of Arshiya, we specialise in bespoke hand embroidery for international fashion houses and designers seeking distinctive craftsmanship and artistic expression.",
            "From intricate threadwork and sculptural embellishments to luminous crystals, delicate beadwork and dimensional embroidery, our atelier explores the possibilities of texture, form and movement.",
            "Each composition is thoughtfully developed to complement the designer's aesthetic, translating creative concepts into meticulously executed embroidery.",
        ],
        note: "The designer's vision remains at the heart of every creation.",
        linkLabel: "Explore Haute Couture Embroidery",
        theme: "light",
    },
    {
        id: "bridal",
        number: "02",
        eyebrow: "Bridal Embroidery",
        title: "The Poetry of Detail",
        image: images.collectionBridal,
        alt: "A bridal couture creation in a garden setting",
        paragraphs: [
            "An exquisite bridal creation is defined by the beauty of its details.",
            "House of Arshiya collaborates with bridal couture houses and designers to develop bespoke hand embroidery that enhances the elegance, character and individuality of their collections.",
            "Delicate pearls, intricate lace appliqués, shimmering crystals and sculptural floral motifs are carefully composed to create surfaces of remarkable depth and luminosity.",
            "From understated embellishments to richly embroidered compositions, our artisans work with precision and sensitivity to the designer's creative direction.",
        ],
        note: "Exceptional detail for extraordinary bridal couture.",
        linkLabel: "Explore Bridal Embroidery",
        theme: "dark",
    },
    {
        id: "accessories",
        number: "03",
        eyebrow: "Couture Accessories",
        title: "Artistry Beyond the Garment",
        image: images.collectionLibrary,
        alt: "Illustrated couture design sketches for embroidery development",
        paragraphs: [
            "The possibilities of hand embroidery extend far beyond the garment.",
            "We collaborate with designers to develop distinctive embroidered accessories that bring artistry, individuality and craftsmanship to luxury collections.",
            "From statement necklaces and intricately embellished gloves to couture handbags, scarves, hair accessories and decorative elements, each piece offers a new canvas for creative exploration.",
            "Through considered material combinations, dimensional textures and meticulous handwork, we transform design concepts into expressive embroidered creations.",
        ],
        note: "Small in scale. Extraordinary in expression.",
        linkLabel: "Discuss an Accessories Project",
        theme: "light",
    },
    {
        id: "half-scale",
        number: "04",
        eyebrow: "Half-Scale Exploration",
        title: "Where Ideas Take Form",
        image: images.collectionBespoke,
        alt: "Couture design sketches and embroidery references pinned in the atelier",
        paragraphs: [
            "The journey from imagination to creation often begins with experimentation.",
            "Half-scale development offers an opportunity to explore silhouettes, proportions and embellishment placement through miniature representations of couture designs.",
            "This considered approach allows designers to visualise creative concepts, refine decorative compositions and explore the relationship between embroidery and garment structure before progressing to full-scale execution.",
            "At House of Arshiya, we value this process as a means of artistic exploration, encouraging experimentation and thoughtful design development.",
        ],
        note: "Exploring possibilities before the final expression.",
        linkLabel: "Enquire About Creative Development",
        theme: "dark",
    },
] as const;

export function Offerings() {
    return (
        <div>
            {offerings.map((offering, index) => {
                const isDark = offering.theme === "dark";

                return (
                    <section
                        id={offering.id}
                        key={offering.id}
                        className={`scroll-mt-24 ${isDark ? "bg-espresso-deep text-ivory" : "bg-ivory text-espresso"}`}
                    >
                        <div className={`grid lg:min-h-[680px] lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                            <div className="relative min-h-[420px] overflow-hidden lg:min-h-[680px]">
                                <Image
                                    src={offering.image}
                                    alt={offering.alt}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                />
                                <span className="absolute left-6 top-6 border border-white/50 px-4 py-2 text-[10px] tracking-[0.3em] text-white lg:left-10 lg:top-10">
                                    {offering.number}
                                </span>
                            </div>

                            <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
                                <Reveal className="mx-auto max-w-xl">
                                    <p className={`text-[10px] uppercase tracking-[0.4em] ${isDark ? "text-gold" : "text-gold-antique"}`}>
                                        {offering.eyebrow}
                                    </p>
                                    <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-5xl">
                                        {offering.title}
                                    </h2>
                                    <div className={`mt-7 space-y-4 text-sm leading-relaxed ${isDark ? "text-ivory/70" : "text-espresso/70"}`}>
                                        {offering.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                    <p className={`mt-7 font-display text-xl italic ${isDark ? "text-gold" : "text-gold-antique"}`}>
                                        {offering.note}
                                    </p>
                                    <a
                                        href="#contact"
                                        className={`group mt-8 inline-flex items-center gap-3 border-b pb-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                                            isDark
                                                ? "border-gold/50 text-ivory hover:text-gold"
                                                : "border-gold-antique/50 text-espresso hover:text-gold-antique"
                                        }`}
                                    >
                                        {offering.linkLabel}
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                                    </a>
                                </Reveal>
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
