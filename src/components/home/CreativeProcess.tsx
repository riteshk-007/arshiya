import { Reveal } from "./Reveal";

const steps = [
    {
        number: "01",
        title: "Understanding the Vision",
        description:
            "We study the designer's sketches, references, materials and creative direction to understand the intended aesthetic and technical requirements.",
    },
    {
        number: "02",
        title: "Material Exploration",
        description:
            "Threads, crystals, beads, sequins, fabrics and unconventional materials are explored to achieve the desired texture, dimension and visual character.",
    },
    {
        number: "03",
        title: "Sampling & Development",
        description:
            "Our artisans translate concepts into embroidered samples, experimenting with stitch techniques, compositions, colour combinations and material applications.",
    },
    {
        number: "04",
        title: "Refinement & Approval",
        description:
            "Samples are reviewed and refined in collaboration with the designer, ensuring the final direction reflects the intended aesthetic and workmanship.",
    },
    {
        number: "05",
        title: "Couture Execution",
        description:
            "Following approval, our skilled artisans meticulously execute the embroidery with careful attention to technique, consistency and detail.",
    },
    {
        number: "06",
        title: "Finishing & Quality Review",
        description:
            "Completed work is carefully examined for workmanship, finishing and presentation before delivery.",
    },
];

export function CreativeProcess() {
    return (
        <section id="creative-process" className="scroll-mt-24 bg-cream px-6 py-20 text-espresso sm:py-24 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold-antique">
                        Within the Atelier
                    </p>
                    <h3 className="mt-4 font-display text-4xl font-light sm:text-5xl">
                        Our Creative Process
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-espresso/65">
                        Exceptional embroidery is the result of thoughtful collaboration, technical
                        understanding and meticulous execution. From the first conversation to the final
                        stitch, every stage is developed with care.
                    </p>
                </Reveal>

                <ol className="grid gap-x-12 gap-y-9 border-t border-gold-antique/30 pt-9 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step) => (
                        <Reveal key={step.number}>
                            <li>
                                <p className="text-[10px] tracking-[0.3em] text-gold-antique">
                                    {step.number}
                                </p>
                                <h4 className="mt-3 font-display text-2xl font-medium">
                                    {step.title}
                                </h4>
                                <p className="mt-3 text-sm leading-relaxed text-espresso/65">
                                    {step.description}
                                </p>
                            </li>
                        </Reveal>
                    ))}
                </ol>

                <p className="mt-12 border-t border-gold-antique/30 pt-6 text-xs leading-relaxed text-espresso/60">
                    Throughout the process, we respect the confidentiality, creative ownership and
                    individuality of every designer&apos;s work.
                </p>
            </div>
        </section>
    );
}
