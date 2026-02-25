"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { mockUsers } from "@/lib/mock-data"

export default function TenantDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Find primary tenant (Baraka Mwangi)
    const tenant = mockUsers.find((u) => u.id === "user-2")!
    const userName = tenant.name

    return (
        <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-[#221610] flex justify-center">
            <div className="relative flex w-full max-w-[1540px]">
                {/* Fixed Sidebar */}
                <DashboardSidebar role="tenant" userName={userName} />

                {/* Dynamic Content Container */}
                <main className="flex-1 pl-[260px] h-screen overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
