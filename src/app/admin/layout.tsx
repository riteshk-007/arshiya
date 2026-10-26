import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { default: "Admin", template: "%s | Admin" },
    robots: { index: false, follow: false, nocache: true },
};

/** The admin area uses the plain sans font only; the website's display fonts stay on the website. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-svh bg-background font-sans text-foreground antialiased">{children}</div>;
}
