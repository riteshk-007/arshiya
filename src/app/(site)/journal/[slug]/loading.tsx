/** Shown while an article loads: dark title band, picture, then lines of text. */
export default function ArticleLoading() {
    return (
        <main aria-busy="true" aria-label="Loading the article">
            <header className="bg-espresso-deep px-6 pb-40 pt-36 text-ivory sm:pb-52 sm:pt-44 lg:px-14">
                <div className="mx-auto flex max-w-4xl flex-col items-center">
                    <div className="h-3 w-40 animate-pulse bg-ivory/15" />
                    <div className="mt-8 h-3 w-24 animate-pulse bg-ivory/15" />
                    <div className="mt-6 h-10 w-full max-w-2xl animate-pulse bg-ivory/15 sm:h-14" />
                    <div className="mt-3 h-10 w-2/3 animate-pulse bg-ivory/15 sm:h-14" />
                    <div className="mt-8 h-3 w-64 animate-pulse bg-ivory/10" />
                </div>
            </header>
            <div className="bg-ivory px-6 pb-20 sm:pb-28 lg:px-14">
                <div className="-mt-28 mx-auto aspect-[4/3] max-w-5xl animate-pulse bg-espresso/15 sm:-mt-40" />
                <div className="mx-auto mt-12 max-w-3xl space-y-4 sm:mt-16">
                    <div className="h-6 w-full animate-pulse bg-espresso/10" />
                    <div className="h-6 w-4/5 animate-pulse bg-espresso/10" />
                    <div className="!mt-10 h-px w-16 bg-espresso/20" />
                    {Array.from({ length: 9 }, (_, index) => (
                        <div key={index} className={`h-4 animate-pulse bg-espresso/10 ${index % 4 === 3 ? "w-3/5" : "w-full"}`} />
                    ))}
                </div>
            </div>
        </main>
    );
}
