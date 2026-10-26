import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";

const stepIcons: IconName[] = ["sketch", "materials", "sampling", "refine", "execution", "finishing"];

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
        <section id="creative-process" className="scroll-mt-24 bg-cream px-6 py-12 text-espresso sm:py-16 lg:px-12">
            <div className="mx-auto max-w-6xl">
                <Reveal className="mb-8 max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-[#7a6347]">
                        From Vision to Creation
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">
                        Our Creative Process
                    </h2>
                </Reveal>

                <ol className="grid gap-x-10 gap-y-7 border-t border-gold-antique/30 pt-7 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <Reveal key={step.number}>
                            <li>
                                <div className="flex items-center gap-4">
                                    <Icon name={stepIcons[index]} className="h-9 w-9 text-gold-antique" />
                                    <div>
                                        <p className="text-[10px] tracking-[0.3em] text-[#7a6347]">
                                            {step.number}
                                        </p>
                                        <h3 className="font-display text-xl font-medium leading-tight sm:text-2xl">
                                            {step.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed text-espresso/75">
                                    {step.description}
                                </p>
                            </li>
                        </Reveal>
                    ))}
                </ol>

                <p className="mt-8 border-t border-gold-antique/30 pt-5 text-xs leading-relaxed text-espresso/72">
                    Throughout the process, we respect the confidentiality, creative ownership and
                    individuality of every designer&apos;s work.
                </p>
            </div>
        </section>
    );
}
