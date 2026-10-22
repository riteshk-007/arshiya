export type IconName =
    | "couture"
    | "bridal"
    | "accessories"
    | "half-scale"
    | "sketch"
    | "materials"
    | "sampling"
    | "refine"
    | "execution"
    | "finishing"
    | "collaboration";

type IconProps = {
    name: IconName;
    className?: string;
};

/**
 * Outline SVG icon from /public/icons, drawn as a CSS mask so it takes the
 * current text colour. Set the size and colour with classes, e.g. "h-8 w-8 text-gold".
 */
export function Icon({ name, className = "h-8 w-8" }: IconProps) {
    const mask = `url(/icons/${name}.svg)`;

    return (
        <span
            aria-hidden
            className={`inline-block shrink-0 bg-current ${className}`}
            style={{
                maskImage: mask,
                WebkitMaskImage: mask,
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
                maskSize: "contain",
                WebkitMaskSize: "contain",
            }}
        />
    );
}
