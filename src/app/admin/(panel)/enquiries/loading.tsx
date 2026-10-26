import { Skeleton } from "@/components/ui/skeleton";
import { ListSkeleton, PageTitleSkeleton } from "@/components/admin/skeletons";

export default function EnquiriesLoading() {
    return (
        <div className="space-y-5" role="status" aria-label="Loading enquiries">
            <PageTitleSkeleton />
            <Skeleton className="h-11 w-full" />
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-24 rounded-full" />
                ))}
            </div>
            <ListSkeleton rows={6} />
        </div>
    );
}
