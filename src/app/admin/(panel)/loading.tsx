import { ListSkeleton, PageTitleSkeleton, StatCardsSkeleton } from "@/components/admin/skeletons";

export default function PanelLoading() {
    return (
        <div className="space-y-6" role="status" aria-label="Loading">
            <PageTitleSkeleton />
            <StatCardsSkeleton />
            <ListSkeleton rows={4} />
        </div>
    );
}
