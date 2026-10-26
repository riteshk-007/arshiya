import { Collections } from "@/components/home/Collections";
import { CreativeProcess } from "@/components/home/CreativeProcess";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <Collections />
      <CreativeProcess />
    </main>
  );
}
