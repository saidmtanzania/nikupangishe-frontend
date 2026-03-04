"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

interface RequireAuthProps {
    children: React.ReactNode
    /** If set, only users with one of these roles may access the page */
    allowedRoles?: ("owner" | "agent" | "tenant" | "admin")[]
}

/**
 * Wraps any page/layout that requires authentication.
 *
 * - While auth state is loading → shows a centered spinner
 * - If not authenticated → redirects to `/auth/login?redirect=<current path>`
 * - If authenticated but wrong role → redirects to the user's own dashboard
 * - Otherwise → renders children
 */
export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated) {
            router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
            return
        }

        // Role-based guard
        if (allowedRoles && user) {
            const userRole = user.role as string
            if (!allowedRoles.includes(userRole as typeof allowedRoles[number])) {
                // Redirect to the user's correct dashboard
                router.replace(`/dashboard/${userRole}`)
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname])

    // Still loading auth state
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f6f6] dark:bg-[#221610]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Loading…
                    </p>
                </div>
            </div>
        )
    }

    // Not authenticated — will redirect via useEffect, show nothing
    if (!isAuthenticated) return null

    // Wrong role — will redirect via useEffect, show nothing
    if (allowedRoles && user) {
        const userRole = user.role as string
        if (!allowedRoles.includes(userRole as typeof allowedRoles[number])) {
            return null
        }
    }

    return <>{children}</>
}
