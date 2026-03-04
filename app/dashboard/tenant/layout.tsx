"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useAuth } from "@/context/auth-context"

export default function TenantDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : "Tenant"

    return (
        <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-[#221610] flex justify-center">
            <div className="relative flex w-full max-w-[1540px]">
                {/* Fixed Sidebar */}
                <DashboardSidebar role="tenant" userName={userName} />

                {/* Dynamic Content Container */}
                <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
