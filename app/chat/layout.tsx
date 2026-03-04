"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { RequireAuth } from "@/components/auth/require-auth"
import { useAuth } from "@/context/auth-context"

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()
    const role = (user?.role === "admin" ? "owner" : user?.role) as "owner" | "agent" | "tenant"
    const userName = user ? `${user.firstName} ${user.lastName}` : "User"

    return (
        <RequireAuth>
            <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-[#221610] flex justify-center">
                <div className="relative flex w-full max-w-385">
                    <DashboardSidebar role={role ?? "tenant"} userName={userName} />
                    <main className="flex-1 h-screen overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </RequireAuth>
    )
}
