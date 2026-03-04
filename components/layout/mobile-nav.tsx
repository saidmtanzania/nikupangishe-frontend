"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ArrowLeftRight, MessageSquare, User, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function MobileNav() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()

  const isDashboard = pathname.startsWith("/dashboard")
  const isChat = pathname.startsWith("/chat")
  const isOnboarding = pathname.startsWith("/onboarding")

  if (isDashboard || isChat || isOnboarding) return null

  const accountItem = isAuthenticated && user
    ? { href: `/dashboard/${user.role}`, label: "Dashboard", icon: LayoutDashboard }
    : { href: "/auth/login", label: "Account", icon: User }

  const mobileNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Search },
    accountItem,
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
