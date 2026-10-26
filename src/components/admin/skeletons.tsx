import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PageTitleSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
    );
}

export function StatCardsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="gap-3 py-4">
                    <CardHeader className="px-4 pb-0">
                        <Skeleton className="h-3 w-20" />
                    </CardHeader>
                    <CardContent className="px-4">
                        <Skeleton className="h-8 w-12" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

/** Placeholder rows while the enquiry list loads. */
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div role="status" aria-label="Loading enquiries" className="space-y-3">
            {Array.from({ length: rows }).map((_, index) => (
                <Card key={index} className="gap-2 py-4">
                    <CardContent className="flex items-center justify-between gap-4 px-4 sm:px-6">
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-4 w-40 max-w-full" />
                            <Skeleton className="h-3 w-56 max-w-full" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-56 w-full rounded-xl" />
                </div>
                <div className="space-y-5">
                    <Skeleton className="h-36 w-full rounded-xl" />
                    <Skeleton className="h-52 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
