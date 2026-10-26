import type { IconName } from "./Icon";

export type Category = {
    slug: string;
    icon: IconName;
    title: string;
    /** Page title for search results, e.g. "Bridal Embroidery". */
    seoTitle: string;
    /** Short line shown on the home page card. */
    summary: string;
    /** Image used on the home card and as the category page hero. */
    image: string;
    imagePosition: string;
    alt: string;
    heading: string;
    paragraphs: string[];
    note: string;
    ctaLabel: string;
};

/** Built-in defaults. The website uses these only until categories are saved in the admin. */
export const defaultCategories: Category[] = [
    {
        slug: "haute-couture",
        icon: "couture",
        title: "Haute Couture",
        seoTitle: "Haute Couture Hand Embroidery",
        summary: "An expression of extraordinary craftsmanship.",
        image: "/photo-pearls-detail.jpg",
        imagePosition: "object-center",
        alt: "Extreme close-up of hand-placed pearls and beadwork on couture fabric",
        heading: "An Expression of Extraordinary Craftsmanship",
        paragraphs: [
            "Haute couture is where imagination encounters the exceptional skill of the human hand.",
            "At House of Arshiya, we specialise in bespoke hand embroidery for international fashion houses and designers seeking distinctive craftsmanship and artistic expression.",
            "From intricate threadwork and sculptural embellishments to luminous crystals, delicate beadwork and dimensional embroidery, our atelier explores the possibilities of texture, form and movement.",
            "Each composition is thoughtfully developed to complement the designer's aesthetic, translating creative concepts into meticulously executed embroidery.",
        ],
        note: "The designer's vision remains at the heart of every creation.",
        ctaLabel: "Enquire About Haute Couture",
    },
    {
        slug: "bridal",
        icon: "bridal",
        title: "Bridal Embroidery",
        seoTitle: "Bridal Hand Embroidery",
        summary: "The poetry of detail.",
        image: "/photo-bride-peonies-veil.jpg",
        imagePosition: "object-[center_55%]",
        alt: "Bride in profile wearing a beaded lace gown with visible embroidery",
        heading: "The Poetry of Detail",
        paragraphs: [
            "An exquisite bridal creation is defined by the beauty of its details.",
            "House of Arshiya collaborates with bridal couture houses and designers to develop bespoke hand embroidery that enhances the elegance, character and individuality of their collections.",
            "Delicate pearls, intricate lace appliqués, shimmering crystals and sculptural floral motifs are carefully composed to create surfaces of remarkable depth and luminosity.",
            "From understated embellishments to richly embroidered compositions, our artisans work with precision and sensitivity to the designer's creative direction.",
        ],
        note: "Exceptional detail for extraordinary bridal couture.",
        ctaLabel: "Enquire About Bridal Embroidery",
    },
    {
        slug: "accessories",
        icon: "accessories",
        title: "Couture Accessories",
        seoTitle: "Embroidered Couture Accessories",
        summary: "Artistry beyond the garment.",
        image: "/photo-accessories-jewelry.jpg",
        imagePosition: "object-center",
        alt: "Pearl and crystal bridal accessories resting on tulle",
        heading: "Artistry Beyond the Garment",
        paragraphs: [
            "The possibilities of hand embroidery extend far beyond the garment.",
            "We collaborate with designers to develop distinctive embroidered accessories that bring artistry, individuality and craftsmanship to luxury collections.",
            "From statement necklaces and intricately embellished gloves to couture handbags, scarves, hair accessories and decorative elements, each piece offers a new canvas for creative exploration.",
            "Through considered material combinations, dimensional textures and meticulous handwork, we transform design concepts into expressive embroidered creations.",
        ],
        note: "Small in scale. Extraordinary in expression.",
        ctaLabel: "Discuss an Accessories Project",
    },
    {
        slug: "half-scale",
        icon: "half-scale",
        title: "Half-Scale Exploration",
        seoTitle: "Half-Scale Couture Exploration",
        summary: "Where ideas take form.",
        image: "/photo-embroidery-hands.jpg",
        imagePosition: "object-center",
        alt: "Hands stitching an embroidery sample, work in progress",
        heading: "Where Ideas Take Form",
        paragraphs: [
            "The journey from imagination to creation often begins with experimentation.",
            "Half-scale development offers an opportunity to explore silhouettes, proportions and embellishment placement through miniature representations of couture designs.",
            "This considered approach allows designers to visualise creative concepts, refine decorative compositions and explore the relationship between embroidery and garment structure before progressing to full-scale execution.",
            "At House of Arshiya, we value this process as a means of artistic exploration, encouraging experimentation and thoughtful design development.",
        ],
        note: "Exploring possibilities before the final expression.",
        ctaLabel: "Enquire About Creative Development",
    },
];

