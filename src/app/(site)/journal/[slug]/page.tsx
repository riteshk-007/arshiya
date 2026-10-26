import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnquireButton } from "@/components/home/EnquireButton";
import { formatJournalDate } from "@/components/journal/format";
import { PostCard } from "@/components/journal/post-card";
import { JsonLd, breadcrumbs } from "@/components/seo/json-ld";
import { asDoc, renderArticleHtml } from "@/lib/journal/content";
import { getLivePost, getNeighbours, getRelatedPosts } from "@/lib/journal/posts";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import { publicObjectUrl } from "@/lib/storage";

/** Rebuilt in the background at most every 10 minutes, and immediately whenever an article is saved in the admin. */
export const revalidate = 600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getLivePost(slug);
    if (!post) {
        return { title: "Article not found", robots: { index: false } };
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const cover = publicObjectUrl(post.coverKey);

    return {
        title,
        description,
        alternates: { canonical: `/journal/${post.slug}` },
        openGraph: {
            type: "article",
            url: `/journal/${post.slug}`,
            title,
            description,
            siteName: SITE_NAME,
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: [post.authorName],
            section: post.category ?? undefined,
            images: cover ? [{ url: cover, width: post.coverWidth ?? undefined, height: post.coverHeight ?? undefined, alt: post.coverAlt ?? post.title }] : undefined,
        },
        twitter: { card: "summary_large_image", title, description, images: cover ? [cover] : undefined },
    };
}

export default async function ArticlePage({ params }: { params: Params }) {
    const { slug } = await params;
    const post = await getLivePost(slug);
    if (!post || !post.publishedAt) {
        notFound();
    }

    const [related, { newer, older }] = await Promise.all([
        getRelatedPosts(post.id, post.category),
        getNeighbours(post.publishedAt),
    ]);
    const html = renderArticleHtml(asDoc(post.content));
    const cover = publicObjectUrl(post.coverKey);
    const url = absoluteUrl(`/journal/${post.slug}`);

    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@graph": [
                        breadcrumbs([
                            { name: "Home", url: absoluteUrl("/") },
                            { name: "Journal", url: absoluteUrl("/journal") },
                            { name: post.title, url },
                        ]),
                        {
                            "@type": "Article",
                            "@id": `${url}#article`,
                            mainEntityOfPage: url,
                            headline: (post.seoTitle || post.title).slice(0, 110),
                            description: post.seoDescription || post.excerpt,
                            image: cover ? [cover] : undefined,
                            datePublished: post.publishedAt.toISOString(),
                            dateModified: post.updatedAt.toISOString(),
                            articleSection: post.category ?? undefined,
                            inLanguage: "en",
                            author: { "@type": "Organization", name: post.authorName, url: absoluteUrl("/") },
                            publisher: {
                                "@type": "Organization",
                                name: SITE_NAME,
                                logo: { "@type": "ImageObject", url: absoluteUrl("/arshiya-logo.png") },
                            },
                        },
                    ],
                }}
            />

            <main>
                <header className="bg-espresso-deep px-6 pb-40 pt-36 text-ivory sm:pb-52 sm:pt-44 lg:px-14">
                    <div className="mx-auto max-w-4xl text-center">
                        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.25em] text-ivory/70">
                            <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                <li>
                                    <Link href="/" className="hover:text-gold">Home</Link>
                                </li>
                                <li aria-hidden>/</li>
                                <li>
                                    <Link href="/journal" className="hover:text-gold">Journal</Link>
                                </li>
                            </ol>
                        </nav>
                        {post.category && <p className="mt-8 text-[10px] uppercase tracking-[0.45em] text-gold">{post.category}</p>}
                        <h1 className="mt-5 font-display text-4xl font-light leading-[1.1] sm:text-6xl">{post.title}</h1>
                        <p className="mt-7 text-[11px] uppercase tracking-[0.25em] text-ivory/75">
                            <time dateTime={post.publishedAt.toISOString()}>{formatJournalDate(post.publishedAt)}</time>
                            <span className="mx-3 text-gold">·</span>
                            {post.readingMinutes} min read
                            <span className="mx-3 text-gold">·</span>
                            {post.authorName}
                        </p>
                    </div>
                </header>

                <div className="bg-ivory px-6 pb-20 text-espresso sm:pb-28 lg:px-14">
                    {cover && post.coverWidth && post.coverHeight && (
                        <figure
                            className={`mx-auto -mt-28 sm:-mt-40 ${post.coverHeight > post.coverWidth * 1.1 ? "max-w-md sm:max-w-xl" : "max-w-5xl"}`}
                        >
                            <Image
                                src={cover}
                                alt={post.coverAlt ?? post.title}
                                width={post.coverWidth}
                                height={post.coverHeight}
                                priority
                                sizes="(min-width: 1024px) 1024px, 100vw"
                                className="h-auto w-full shadow-xl"
                            />
                        </figure>
                    )}

                    <article className="mx-auto mt-12 max-w-3xl sm:mt-16">
                        <p className="font-display text-2xl font-light italic leading-relaxed text-espresso/85 sm:text-[1.7rem]">{post.excerpt}</p>
                        <div className="mt-10 h-px w-16 bg-gold-antique/60" />
                        <div className="journal-prose prose prose-lg mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                    </article>

                    <aside className="mx-auto mt-20 max-w-3xl border-y border-gold-antique/30 py-12 text-center">
                        <p className="font-display text-3xl font-light italic">Have a vision to bring to life?</p>
                        <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-espresso/75">
                            Share a sketch, a reference or an early idea. Our atelier will take it from there.
                        </p>
                        <EnquireButton className="group mt-7 inline-flex items-center gap-4 border border-espresso/60 px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-espresso transition-colors duration-500 hover:bg-espresso hover:text-ivory">
                            Begin a Collaboration
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" strokeWidth={1.25} />
                        </EnquireButton>
                    </aside>

                    {(newer || older) && (
                        <nav aria-label="More articles" className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
                            {older ? (
                                <Link href={`/journal/${older.slug}`} className="group block">
                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#7a6347]">
                                        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.25} /> Previous
                                    </span>
                                    <span className="mt-2 block font-display text-xl leading-snug group-hover:text-gold-antique">{older.title}</span>
                                </Link>
                            ) : (
                                <span />
                            )}
                            {newer && (
                                <Link href={`/journal/${newer.slug}`} className="group block sm:text-right">
                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#7a6347] sm:justify-end">
                                        Next <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                                    </span>
                                    <span className="mt-2 block font-display text-xl leading-snug group-hover:text-gold-antique">{newer.title}</span>
                                </Link>
                            )}
                        </nav>
                    )}
                </div>

                {related.length > 0 && (
                    <section className="bg-cream px-6 py-16 text-espresso sm:py-24 lg:px-14" aria-labelledby="related-heading">
                        <div className="mx-auto max-w-[1400px]">
                            <h2 id="related-heading" className="font-display text-4xl font-light">
                                Related <span className="italic text-gold-antique">articles</span>
                            </h2>
                            <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                                {related.map((item) => (
                                    <PostCard key={item.id} post={item} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
