type MonogramProps = {
    className?: string;
};

/** ARSHIYA "A" monogram — fine gold ring with serif italic A and flanking dots. */
export function Monogram({ className = "" }: MonogramProps) {
    return (
        <span
            className={`relative inline-flex items-center justify-center rounded-full border border-gold/50 ${className}`}
        >
            <span aria-hidden className="absolute left-[18%] h-1 w-1 rounded-full bg-gold/70" />
            <span aria-hidden className="absolute right-[18%] h-1 w-1 rounded-full bg-gold/70" />
            <span className="font-display italic leading-none text-gold">A</span>
        </span>
    );
}
