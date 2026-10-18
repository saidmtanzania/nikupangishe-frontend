"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { useAuth } from "@/context/auth-context"

export type DashboardRole = "owner" | "agent" | "tenant" | "admin"

export function DashboardShell({ role, children }: { role: DashboardRole; children: React.ReactNode }) {
  const { user } = useAuth()
  const userName = user ? `${user.firstName} ${user.lastName}` : role[0].toUpperCase() + role.slice(1)

  return (
    <div className="flex h-screen w-full bg-[#f8f6f6] dark:bg-[#221610]">
      <DashboardSidebar role={role} userName={userName} />
      <main className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar role={role} />
        <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">{children}</div>
      </main>
    </div>
  )
}
