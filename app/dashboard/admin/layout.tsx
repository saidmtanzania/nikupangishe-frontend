"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth allowedRoles={["admin"]}>
            <DashboardShell role="admin">{children}</DashboardShell>
        </RequireAuth>
    )
}