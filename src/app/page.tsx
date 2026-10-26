import { Collections } from "@/components/home/Collections";
import { CreativeProcess } from "@/components/home/CreativeProcess";
import { Hero } from "@/components/home/Hero";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Collections />
        <CreativeProcess />
      </main>
      <SiteFooter />
    </>
  );
}
