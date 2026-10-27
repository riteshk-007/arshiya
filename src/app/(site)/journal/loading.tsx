/** Shown while the Journal list loads, laid out like the real page so nothing jumps. */
export default function JournalLoading() {
    return (
        <main aria-busy="true" aria-label="Loading the Journal">
            <section className="bg-espresso-deep text-ivory">
                <div className="mx-auto flex min-h-[46svh] max-w-[1600px] flex-col justify-end px-6 pb-14 pt-40 sm:min-h-[52svh] sm:pb-20 lg:px-14">
                    <div className="h-3 w-36 animate-pulse bg-ivory/15" />
                    <div className="mt-6 h-16 w-56 animate-pulse bg-ivory/15 sm:h-24 sm:w-80" />
                    <div className="mt-7 h-5 w-full max-w-md animate-pulse bg-ivory/10" />
                </div>
            </section>
            <section className="bg-ivory px-6 py-14 sm:py-20 lg:px-14">
                <div className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <div key={index}>
                            <div className="aspect-[4/3] animate-pulse bg-espresso/10" />
                            <div className="mt-4 h-2.5 w-2/5 animate-pulse bg-espresso/10" />
                            <div className="mt-4 h-5 w-11/12 animate-pulse bg-espresso/10" />
                            <div className="mt-2 h-5 w-2/3 animate-pulse bg-espresso/10" />
                            <div className="mt-4 h-3 w-full animate-pulse bg-espresso/10" />
                            <div className="mt-2 h-3 w-4/5 animate-pulse bg-espresso/10" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
