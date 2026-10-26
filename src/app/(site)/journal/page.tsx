import type { Metadata } from "next";
import { JournalIndex } from "@/components/journal/journal-index";

/** Rebuilt in the background at most every 10 minutes, and immediately whenever an article is saved in the admin. */
export const revalidate = 600;

export const metadata: Metadata = {
    title: "Journal",
    description:
        "Thoughts, observations and notes from the House of Arshiya atelier on haute couture hand embroidery, bridal craft and design.",
    alternates: { canonical: "/journal", types: { "application/rss+xml": "/journal/feed.xml" } },
    openGraph: { type: "website", url: "/journal", title: "Journal | House of Arshiya" },
};

export default function JournalPage() {
    return <JournalIndex page={1} />;
}
