import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/home/EnquiryForm";
import { Reveal } from "@/components/home/Reveal";

export const metadata: Metadata = {
    title: "Contact | House of Arshiya",
    description:
        "Share a developed concept, an early sketch or an idea waiting to be explored with the House of Arshiya atelier.",
};

const linkClass =
    "mt-2 inline-block border-b border-gold/40 pb-1 text-sm text-ivory/90 transition-colors hover:text-gold";

export default function ContactPage() {
    return (
        <main className="bg-espresso-deep px-6 pb-20 pt-36 text-ivory sm:pt-44 lg:px-14">
            <div className="mx-auto max-w-6xl">
                <Reveal className="max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gold">Contact</p>
                    <h1 className="mt-5 font-display text-5xl font-light leading-[1.05] sm:text-6xl">
                        Begin a <span className="italic text-gold">Conversation</span>
                    </h1>
                    <p className="mt-6 text-sm font-light leading-[1.85] text-ivory/85">
                        Every extraordinary collaboration begins with an introduction. Share a developed
                        concept, an early sketch or an idea waiting to be explored.
                    </p>
                </Reveal>

                <div className="mt-14 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                    <Reveal>
                        <h2 className="font-display text-2xl">Couture & Collaboration Enquiries</h2>
                        <a href="mailto:hautecouture@arshiya.uk" className={linkClass}>
                            hautecouture@arshiya.uk
                        </a>

                        <h2 className="mt-8 font-display text-2xl">Bridal Embroidery Enquiries</h2>
                        <a href="mailto:bridal@arshiya.uk" className={linkClass}>
                            bridal@arshiya.uk
                        </a>

                        <h2 className="mt-8 font-display text-2xl">General & Business Enquiries</h2>
                        <a href="mailto:sales@arshiya.uk" className={linkClass}>
                            sales@arshiya.uk
                        </a>

                        <div className="mt-10 border-t border-gold/25 pt-7">
                            <h2 className="flex items-center gap-2 font-display text-2xl">
                                <MapPin className="h-4 w-4 text-gold" strokeWidth={1.25} />
                                Our Atelier
                            </h2>
                            <address className="mt-3 text-sm not-italic leading-relaxed text-ivory/80">
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
                                className="mt-4 inline-flex items-center gap-2 text-sm text-ivory/90 transition-colors hover:text-gold"
                            >
                                <Phone className="h-4 w-4" strokeWidth={1.25} />
                                +91 99872 27733 · Telephone / WhatsApp
                            </a>
                            <p className="mt-6 text-xs leading-relaxed text-ivory/65">
                                We aim to respond to enquiries within 12 hours.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal>
                        <div className="border border-gold/25 p-6 sm:p-9">
                            <h2 className="font-display text-3xl font-light">Collaboration Enquiry</h2>
                            <p className="mb-6 mt-2 text-[13px] font-light leading-relaxed text-ivory/75">
                                Tell us about your project and we will come back to you.
                            </p>
                            <EnquiryForm />
                        </div>
                    </Reveal>
                </div>
            </div>
        </main>
    );
}
