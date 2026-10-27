import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";
import Script from "next/script";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#181513",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          Google Translate wraps text in new elements, which makes React fail with "removeChild ... not a child".
          For visitors who chose a language, these two calls are made forgiving before React starts.
        */}
        <Script id="translate-dom-guard" strategy="beforeInteractive">{`
          try {
            var saved = localStorage.getItem("arshiya-language");
            if (saved && saved !== "en" && !/(?:^|; )googtrans=/.test(document.cookie)) {
              document.cookie = "googtrans=/en/" + saved + "; path=/; max-age=31536000; samesite=lax";
            }
          } catch (e) {}
          if (/(?:^|; )googtrans=\\/[^;]+/.test(document.cookie)) {
            var remove = Node.prototype.removeChild;
            Node.prototype.removeChild = function (child) {
              if (child.parentNode !== this) return child;
              return remove.apply(this, arguments);
            };
            var insert = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function (node, ref) {
              if (ref && ref.parentNode !== this) return node;
              return insert.apply(this, arguments);
            };
          }
        `}</Script>
      </head>
      <body className={`${displayFont.variable} ${sansFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
