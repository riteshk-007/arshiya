import { Skeleton } from "@/components/ui/skeleton";
import { PageTitleSkeleton } from "@/components/admin/skeletons";

export default function SettingsLoading() {
    return (
        <div className="max-w-xl space-y-5" role="status" aria-label="Loading settings">
            <PageTitleSkeleton />
            <Skeleton className="h-80 w-full rounded-xl" />
        </div>
    );
}
