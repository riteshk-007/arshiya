import { Skeleton } from "@/components/ui/skeleton";
import { ListSkeleton, PageTitleSkeleton } from "@/components/admin/skeletons";

export default function JournalLoading() {
    return (
        <div className="space-y-5" role="status" aria-label="Loading articles">
            <PageTitleSkeleton />
            <Skeleton className="h-11 w-full" />
            <ListSkeleton rows={5} />
        </div>
    );
}
