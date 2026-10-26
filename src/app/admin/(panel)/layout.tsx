import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAdmin();
    const newCount = await prisma.enquiry.count({ where: { status: "NEW" } });

    return (
        <AdminShell username={session.username} newCount={newCount}>
            {children}
        </AdminShell>
    );
}
