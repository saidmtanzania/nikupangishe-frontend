"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function TenantDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth allowedRoles={["tenant"]}>
            <DashboardShell role="tenant">{children}</DashboardShell>
        </RequireAuth>
    )
}