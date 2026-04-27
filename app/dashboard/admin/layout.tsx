"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { RequireAuth } from "@/components/auth/require-auth"
import { useAuth } from "@/context/auth-context"

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : "Admin"

    return (
        <RequireAuth allowedRoles={["admin"]}>
            <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-[#221610] flex justify-center">
                <div className="relative flex w-full max-w-[1540px]">
                    <DashboardSidebar role="admin" userName={userName} />
                    <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
                        {children}
                    </main>
                </div>
            </div>
        </RequireAuth>
    )
}
