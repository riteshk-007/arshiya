import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { JournalIndex } from "@/components/journal/journal-index";
import { getLivePosts } from "@/lib/journal/posts";

export const revalidate = 600;

type Params = Promise<{ page: string }>;

const parsePage = (value: string) => (/^\d{1,4}$/.test(value) ? Number(value) : 0);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const page = parsePage((await params).page);
    return {
        title: `Journal, page ${page}`,
        description: "Thoughts, observations and notes from the House of Arshiya atelier.",
        alternates: { canonical: `/journal/page/${page}` },
    };
}

export default async function JournalPageNumber({ params }: { params: Params }) {
    const page = parsePage((await params).page);
    if (page < 1) {
        notFound();
    }
    if (page === 1) {
        redirect("/journal");
    }
    const { pages } = await getLivePosts(page);
    if (page > pages) {
        notFound();
    }
    return <JournalIndex page={page} />;
}
