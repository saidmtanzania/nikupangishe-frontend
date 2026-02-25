"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { mockUsers } from "@/lib/mock-data"

export default function OwnerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Find the primary owner (Samuel Okoro)
    const owner = mockUsers.find((u) => u.id === "user-3")!
    const userName = owner.name

    return (
        <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-[#221610] flex justify-center">
            <div className="relative flex w-full max-w-[1540px]">
                {/* Fixed Sidebar */}
                <DashboardSidebar role="owner" userName={userName} />

                {/* Dynamic Content Container */}
                <main className="flex-1 pl-[260px] h-screen overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
