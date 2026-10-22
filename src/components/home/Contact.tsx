"use client";

import type { FormEvent } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Reveal } from "./Reveal";

export function Contact() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const references = Array.from(
            (data.get("references") as FileList | null) ?? [],
        )
            .map((file) => file.name)
            .join(", ");
        const subject = encodeURIComponent(
            `${String(data.get("enquiry") ?? "General")} — House of Arshiya`,
        );
        const body = encodeURIComponent(
            `Name: ${String(data.get("name") ?? "").trim()}\nFashion house / company: ${String(data.get("company") ?? "").trim()}\nEmail: ${String(data.get("email") ?? "").trim()}\nCountry: ${String(data.get("country") ?? "").trim()}\nNature of enquiry: ${String(data.get("enquiry") ?? "").trim()}\nEstimated project timeline: ${String(data.get("timeline") ?? "").trim()}\n\nProject description:\n${String(data.get("description") ?? "").trim()}\n\nDesign reference files selected (please attach them before sending):\n${references || "None selected"}`,
        );

        window.location.href = `mailto:sales@arshiya.uk?subject=${subject}&body=${body}`;
    };

    return (
        <section id="contact" className="scroll-mt-24 bg-ivory px-6 py-20 text-espresso sm:py-28 lg:px-12 lg:py-32">
            <div className="mx-auto max-w-6xl">
                <Reveal className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold-antique">
                        Contact
                    </p>
                    <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">
                        Begin a Conversation
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-espresso/75">
                        Every extraordinary collaboration begins with an introduction. Share a developed
                        concept, an early sketch or an idea waiting to be explored.
                    </p>
                </Reveal>

                <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                    <Reveal>
                        <h3 className="font-display text-2xl">Couture & Collaboration Enquiries</h3>
                        <a
                            href="mailto:hautecouture@arshiya.uk"
                            className="mt-3 inline-block border-b border-gold-antique/50 pb-1 text-sm hover:text-gold-antique"
                        >
                            hautecouture@arshiya.uk
                        </a>

                        <h3 className="mt-8 font-display text-2xl">Bridal Embroidery Enquiries</h3>
                        <a
                            href="mailto:bridal@arshiya.uk"
                            className="mt-3 inline-block border-b border-gold-antique/50 pb-1 text-sm hover:text-gold-antique"
                        >
                            bridal@arshiya.uk
                        </a>

                        <h3 className="mt-8 font-display text-2xl">General & Business Enquiries</h3>
                        <a
                            href="mailto:sales@arshiya.uk"
                            className="mt-3 inline-block border-b border-gold-antique/50 pb-1 text-sm hover:text-gold-antique"
                        >
                            sales@arshiya.uk
                        </a>

                        <div className="mt-10 border-t border-gold-antique/25 pt-7">
                            <h3 className="flex items-center gap-2 font-display text-2xl">
                                <MapPin className="h-4 w-4 text-gold-antique" strokeWidth={1.25} />
                                Our Atelier
                            </h3>
                            <address className="mt-3 text-sm not-italic leading-relaxed text-espresso/75">
                                Sunder Das Building, 2nd Floor
                                <br />
                                Sankli Street, Next to E Ward
                                <br />
                                Byculla, Mumbai – 400008
                                <br />
                                India
                            </address>
                            <a
                                href="tel:+919987227733"
                                className="mt-4 inline-flex items-center gap-2 text-sm text-espresso/85 hover:text-gold-antique"
                            >
                                <Phone className="h-4 w-4" strokeWidth={1.25} />
                                +91 99872 27733 · Telephone / WhatsApp
                            </a>
                            <div className="mt-7 grid gap-6 border-t border-gold-antique/25 pt-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-antique">
                                        New York, United States
                                    </h4>
                                    <address className="mt-3 text-xs not-italic leading-relaxed text-espresso/75">
                                        61/20 Grand Central Parkway
                                        <br />
                                        Apartment C704
                                        <br />
                                        Forest Hills, NY 11375
                                    </address>
                                    <a
                                        href="tel:+19174387208"
                                        className="mt-2 inline-block text-xs text-espresso/85 hover:text-gold-antique"
                                    >
                                        +1 917 438 7208
                                    </a>
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-[0.25em] text-gold-antique">
                                        London, United Kingdom
                                    </h4>
                                    <address className="mt-3 text-xs not-italic leading-relaxed text-espresso/75">
                                        Wyman Lettings
                                        <br />
                                        532 High Street North
                                        <br />
                                        London E12 6QN
                                    </address>
                                </div>
                            </div>
                            <a
                                href="https://www.instagram.com/arshiya.uk/"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-block text-xs tracking-[0.12em] text-espresso/80 hover:text-gold-antique"
                            >
                                Instagram · @arshiya.uk
                            </a>
                        </div>
                    </Reveal>

                    <Reveal>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <ContactInput label="Name" name="name" required autoComplete="name" />
                                <ContactInput label="Fashion house / company" name="company" autoComplete="organization" />
                                <ContactInput label="Email address" name="email" type="email" required autoComplete="email" />
                                <ContactInput label="Country" name="country" autoComplete="country-name" />
                            </div>

                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-espresso/75">
                                    Nature of enquiry
                                </span>
                                <select
                                    name="enquiry"
                                    defaultValue=""
                                    required
                                    className="mt-2 w-full border-b border-gold-antique/40 bg-transparent py-3 text-sm text-espresso outline-none [color-scheme:light] focus:border-gold-antique"
                                >
                                    <option value="" disabled className="bg-ivory text-espresso/65">
                                        Select an enquiry type
                                    </option>
                                    {[
                                        "Haute couture embroidery",
                                        "Bridal embroidery",
                                        "Couture accessories",
                                        "Sampling and development",
                                        "Half-scale exploration",
                                        "Other collaboration",
                                    ].map((type) => (
                                        <option key={type} className="bg-ivory text-espresso">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-espresso/75">
                                    Project description
                                </span>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="mt-2 w-full resize-y border-b border-gold-antique/40 bg-transparent py-3 text-sm outline-none placeholder:text-espresso/50 focus:border-gold-antique"
                                    placeholder="Tell us about your vision, materials or creative direction"
                                />
                            </label>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <ContactInput label="Estimated project timeline" name="timeline" placeholder="e.g. Autumn 2026" />
                                <label className="block">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-espresso/75">
                                        Upload design references
                                    </span>
                                    <input
                                        name="references"
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        className="mt-2 block w-full text-xs text-espresso/75 file:mr-3 file:border file:border-gold-antique/50 file:bg-transparent file:px-3 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.1em] file:text-espresso"
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="group inline-flex min-h-14 items-center gap-4 border border-espresso bg-espresso px-7 py-4 text-[10px] uppercase tracking-[0.25em] text-ivory transition-colors hover:border-gold-antique hover:bg-gold-antique"
                            >
                                Submit Your Enquiry
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                            </button>
                            <p className="text-xs leading-relaxed text-espresso/70">
                                We aim to respond to enquiries within 12 hours. For urgent enquiries, please
                                contact our atelier via WhatsApp. Your email app will open with the enquiry
                                details; attach any selected design references before sending.
                            </p>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

type ContactInputProps = {
    label: string;
    name: string;
    type?: "text" | "email";
    required?: boolean;
    autoComplete?: string;
    placeholder?: string;
};

function ContactInput({
    label,
    name,
    type = "text",
    required = false,
    autoComplete,
    placeholder,
}: ContactInputProps) {
    return (
        <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-espresso/75">{label}</span>
            <input
                name={name}
                type={type}
                required={required}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className="mt-2 w-full border-b border-gold-antique/40 bg-transparent py-3 text-sm outline-none placeholder:text-espresso/50 focus:border-gold-antique"
            />
        </label>
    );
}
