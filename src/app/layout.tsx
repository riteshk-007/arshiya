import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { EntryPopup } from "@/components/home/EntryPopup";
import { SiteFooter } from "@/components/home/SiteFooter";
import { SiteHeader } from "@/components/home/SiteHeader";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-arshiya-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sansFont = Inter({
  variable: "--font-arshiya-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.arshiya.uk";
const siteTitle = "House of Arshiya | Haute Couture Hand Embroidery";
const siteDescription =
  "An independent hand-embroidery atelier collaborating with international fashion houses and designers.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "House of Arshiya",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${sansFont.variable} antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
        <EntryPopup />
      </body>
    </html>
  );
}
