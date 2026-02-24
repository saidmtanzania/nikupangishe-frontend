"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Users,
  ArrowLeftRight,
  MessageSquare,
  Settings,
  LogOut,
  Briefcase,
  Eye,
  DollarSign,
  Heart,
  FileText,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const ownerNav: NavItem[] = [
  { href: "/dashboard/owner", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/owner#properties", label: "My Properties", icon: <Home className="h-5 w-5" /> },
  { href: "/dashboard/owner#tenants", label: "Tenants", icon: <Users className="h-5 w-5" /> },
  { href: "/dashboard/owner#requests", label: "Requests", icon: <FileText className="h-5 w-5" /> },
  { href: "/chat", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
]

const agentNav: NavItem[] = [
  { href: "/dashboard/agent", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/agent#properties", label: "Assigned Houses", icon: <Briefcase className="h-5 w-5" /> },
  { href: "/dashboard/agent#viewings", label: "Viewings", icon: <Eye className="h-5 w-5" /> },
  { href: "/dashboard/agent#commissions", label: "Commissions", icon: <DollarSign className="h-5 w-5" /> },
  { href: "/chat", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
]

const tenantNav: NavItem[] = [
  { href: "/dashboard/tenant", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: "/dashboard/tenant#home", label: "My Home", icon: <Home className="h-5 w-5" /> },
  { href: "/dashboard/tenant#favorites", label: "Favorites", icon: <Heart className="h-5 w-5" /> },
  { href: "/exchange", label: "Exchange", icon: <ArrowLeftRight className="h-5 w-5" /> },
  { href: "/chat", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navItems = role === "owner" ? ownerNav : role === "agent" ? agentNav : tenantNav
  const roleLabel = role === "owner" ? "Property Owner" : role === "agent" ? "Agent" : "Tenant"

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Profile */}
      <div className="flex items-center gap-3 border-b border-border p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {userName.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href.split("#")[0]
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-1 border-t border-border p-3">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  )
}
