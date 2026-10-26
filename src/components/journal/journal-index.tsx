import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLivePosts } from "@/lib/journal/posts";
import { PostCard } from "./post-card";

const hrefFor = (page: number) => (page <= 1 ? "/journal" : `/journal/page/${page}`);

/** The Journal listing, shared by /journal and /journal/page/N. */
export async function JournalIndex({ page }: { page: number }) {
    const { posts, pages } = await getLivePosts(page);

    return (
        <main>
            <section className="relative isolate overflow-hidden bg-espresso-deep text-ivory">
                <Image
                    src="/photo-atelier-sketches.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="-z-10 object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-espresso-deep via-espresso-deep/55 to-espresso-deep/80" />
                <div className="mx-auto flex min-h-[46svh] max-w-[1600px] flex-col justify-end px-6 pb-14 pt-40 sm:min-h-[52svh] sm:pb-20 lg:px-14">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-gold">House of Arshiya</p>
                    <h1 className="mt-5 font-display text-6xl font-light leading-none sm:text-8xl">Journal</h1>
                    <p className="mt-6 max-w-xl font-display text-xl font-light italic text-ivory/90 sm:text-2xl">
                        Thoughts, observations and notes from the atelier.
                    </p>
                </div>
            </section>

            <section className="bg-ivory px-6 py-14 text-espresso sm:py-20 lg:px-14">
                <div className="mx-auto max-w-[1400px]">
                    {posts.length === 0 ? (
                        <p className="mx-auto max-w-md py-16 text-center font-display text-2xl font-light italic text-espresso/75">
                            Our first articles are on their way. Please check back soon.
                        </p>
                    ) : (
                        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                            {posts.map((post, index) => (
                                <PostCard key={post.id} post={post} priority={page === 1 && index < 3} />
                            ))}
                        </div>
                    )}

                    {pages > 1 && (
                        <nav aria-label="Journal pages" className="mt-16 flex items-center justify-between gap-3 border-t border-gold-antique/30 pt-8">
                            <Link
                                href={hrefFor(page - 1)}
                                aria-disabled={page <= 1}
                                tabIndex={page <= 1 ? -1 : undefined}
                                className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] ${page <= 1 ? "pointer-events-none opacity-30" : "hover:text-gold-antique"}`}
                            >
                                <ChevronLeft className="h-4 w-4" strokeWidth={1.25} /> Newer
                            </Link>
                            <ul className="flex items-center gap-1">
                                {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
                                    <li key={number}>
                                        <Link
                                            href={hrefFor(number)}
                                            aria-current={number === page ? "page" : undefined}
                                            className={`flex h-9 min-w-9 items-center justify-center px-2 text-sm ${number === page ? "bg-espresso text-ivory" : "hover:text-gold-antique"}`}
                                        >
                                            {number}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={hrefFor(page + 1)}
                                aria-disabled={page >= pages}
                                tabIndex={page >= pages ? -1 : undefined}
                                className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] ${page >= pages ? "pointer-events-none opacity-30" : "hover:text-gold-antique"}`}
                            >
                                Older <ChevronRight className="h-4 w-4" strokeWidth={1.25} />
                            </Link>
                        </nav>
                    )}
                </div>
            </section>
        </main>
    );
}
