"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Users,
  Eye,
  FileText,
  Shield,
  Settings,
  LogOut,
  MoreVertical,
  CheckCircle2
} from "lucide-react"
import Image from "next/image"

interface NavItem {
  href: string
  label: string
  icon: any
}

const ownerNav: NavItem[] = [
  { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/owner/houses", label: "My Houses", icon: Home },
  { href: "/dashboard/owner/agents", label: "Agent Management", icon: Users },
  { href: "/dashboard/owner/payments", label: "Rent Payments", icon: FileText },
  { href: "/dashboard/owner/verification", label: "Verification", icon: Shield },
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()

  // For now, we only have the owner design specific
  const navItems = role === "owner" ? ownerNav : ownerNav // Fallback for demo

  return (
    <aside className="fixed h-full w-[260px] flex flex-col border-r border-primary/10 bg-white dark:bg-slate-900 transition-all">
      {/* Logo Section */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-white">Nikupangishe</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tight">Owner Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
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
            <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
              <span className="text-[10px] font-bold text-slate-600">SO</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Samuel Okoro</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">Premium Owner</p>
          </div>
          <Settings className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-900" />
        </div>
      </div>
    </aside>
  )
}

