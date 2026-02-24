"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ArrowLeftRight, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/exchange", label: "Exchange", icon: ArrowLeftRight },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/auth/login", label: "Account", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  const isDashboard = pathname.startsWith("/dashboard")
  const isChat = pathname.startsWith("/chat")

  if (isDashboard || isChat) return null

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
