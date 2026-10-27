/** Shown while a category page loads: big picture on one side, text lines on the other. */
export default function CategoryLoading() {
    return (
        <main aria-busy="true" aria-label="Loading" className="bg-espresso-deep text-ivory">
            <section className="grid lg:min-h-svh lg:grid-cols-2">
                <div className="min-h-[360px] animate-pulse bg-ivory/10 sm:min-h-[460px] lg:min-h-svh" />
                <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16 lg:pt-36">
                    <div className="mx-auto w-full max-w-xl space-y-4">
                        <div className="h-3 w-32 animate-pulse bg-ivory/15" />
                        <div className="mt-8 h-12 w-12 animate-pulse bg-ivory/15" />
                        <div className="h-3 w-40 animate-pulse bg-ivory/15" />
                        <div className="h-10 w-full animate-pulse bg-ivory/15" />
                        <div className="h-10 w-3/4 animate-pulse bg-ivory/15" />
                        {Array.from({ length: 6 }, (_, index) => (
                            <div key={index} className={`h-3.5 animate-pulse bg-ivory/10 ${index % 3 === 2 ? "w-3/5" : "w-full"}`} />
                        ))}
                        <div className="h-14 w-64 animate-pulse bg-ivory/10" />
                    </div>
                </div>
            </section>
        </main>
    );
}
