import { Atelier } from "@/components/home/Atelier";
import { BrandStatement } from "@/components/home/BrandStatement";
import { Collaborations } from "@/components/home/Collaborations";
import { Collections } from "@/components/home/Collections";
import { Contact } from "@/components/home/Contact";
import { FirstStitch } from "@/components/home/FirstStitch";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Offerings } from "@/components/home/Offerings";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandStatement />
        <Collections />
        <Offerings />
        <FirstStitch />
        <Atelier />
        <Philosophy />
        <Collaborations />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
