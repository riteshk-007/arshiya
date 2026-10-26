import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostCard as PostCardData } from "@/lib/journal/posts";
import { publicObjectUrl } from "@/lib/storage";
import { formatJournalDate } from "./format";

/** One article on the Journal page: picture, category and date, title, summary and a read-more link. */
export function PostCard({ post, priority = false }: { post: PostCardData; priority?: boolean }) {
    const cover = publicObjectUrl(post.coverKey);

    return (
        <article className="group">
            <Link href={`/journal/${post.slug}`} className="block" aria-label={post.title}>
                <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                    {cover ? (
                        <Image
                            src={cover}
                            alt={post.coverAlt ?? post.title}
                            fill
                            priority={priority}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-cream to-gold/40" />
                    )}
                </div>
            </Link>

            <div className="pt-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a6347]">
                    {post.category && <>{post.category} · </>}
                    <time dateTime={post.publishedAt?.toISOString()}>{post.publishedAt ? formatJournalDate(post.publishedAt) : ""}</time>
                </p>
                <h2 className="mt-3 font-display text-xl font-light leading-snug text-espresso sm:text-[1.4rem]">
                    <Link href={`/journal/${post.slug}`} className="transition-colors hover:text-gold-antique">
                        {post.title}
                    </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-sm font-light leading-[1.8] text-espresso/75">{post.excerpt}</p>
                <Link
                    href={`/journal/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-espresso transition-colors hover:text-gold-antique"
                    aria-label={`Read more: ${post.title}`}
                >
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.25} />
                </Link>
            </div>
        </article>
    );
}
