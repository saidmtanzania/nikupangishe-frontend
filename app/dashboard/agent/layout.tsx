"use client"

import { RequireAuth } from "@/components/auth/require-auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function AgentDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth allowedRoles={["agent"]}>
            <DashboardShell role="agent">{children}</DashboardShell>
        </RequireAuth>
    )
}