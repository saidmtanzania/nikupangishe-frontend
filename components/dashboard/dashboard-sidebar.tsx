"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Users,
  FileText,
  Shield,
  Settings
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: any
}

const ownerNav: NavItem[] = [
  { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/owner/houses", label: "My Houses", icon: Home },
  { href: "/dashboard/owner/agents", label: "Agents", icon: Users },
  { href: "/dashboard/owner/verification", label: "Verification", icon: Shield },
]

const agentNav: NavItem[] = [
  { href: "/dashboard/agent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/agent/viewings", label: "Viewings", icon: Users },
  { href: "/dashboard/agent/commissions", label: "Earnings", icon: FileText },
]

const tenantNav: NavItem[] = [
  { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tenant/exchange", label: "Exchanges", icon: FileText },
  { href: "/dashboard/tenant/verification", label: "Trust Score", icon: Shield },
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navItems = role === "owner" ? ownerNav : role === "agent" ? agentNav : tenantNav
  const initials = userName.split(' ').map(n => n[0]).join('')
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
  const badgeLabel = role === "owner" ? "Premium Owner" : role === "agent" ? "Verified Agent" : "Gold Tenant"

  return (
    <aside className="fixed h-full w-[260px] flex flex-col border-r border-primary/10 bg-white dark:bg-slate-900">
      {/* Logo Section */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="font-bold italic">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none text-slate-800 dark:text-white">Nikupangishe</h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tight">Rental Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard/owner" || item.href === "/dashboard/agent" || item.href === "/dashboard/tenant"
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400 group-hover:text-foreground")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="relative h-8 w-8 shrink-0">
            <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-white shadow-sm">
              <span className="text-[10px] font-bold text-primary">{initials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
            <div className="mt-0.5">
              <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{badgeLabel}</span>
            </div>
          </div>
          <Settings className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-900" />
        </div>
      </div>
    </aside>
  )
}

