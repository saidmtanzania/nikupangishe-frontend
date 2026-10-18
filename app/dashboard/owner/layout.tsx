"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function OwnerDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth allowedRoles={["owner"]}>
            <DashboardShell role="owner">{children}</DashboardShell>
        </RequireAuth>
    )
}