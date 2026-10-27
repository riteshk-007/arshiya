import { EntryPopup } from "@/components/home/EntryPopup";
import { SiteFooter } from "@/components/home/SiteFooter";
import { TranslateLoader } from "@/components/home/TranslateLoader";
import { SiteHeader } from "@/components/home/SiteHeader";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteCategories } from "@/lib/site-categories";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/arshiya-logo.png"),
      description: SITE_DESCRIPTION,
      slogan: "Fashion is a work of art",
      knowsAbout: ["Haute couture embroidery", "Bridal embroidery", "Couture accessories", "Hand embroidery"],
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: SITE_NAME,
      inLanguage: "en",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

/** Public website shell. The admin area has its own layout and never shows this. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getSiteCategories();
  return (
    <>
      <JsonLd data={siteStructuredData} />
      <SiteHeader categories={categories.map(({ slug, navLabel }) => ({ slug, navLabel }))} />
      {children}
      <SiteFooter />
      <EntryPopup />
      <TranslateLoader />
    </>
  );
}
