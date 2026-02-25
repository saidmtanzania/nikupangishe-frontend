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
  { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/owner/houses", label: "Houses", icon: Home },
  { href: "/dashboard/owner/add", label: "Add House", icon: PlusCircle },
  { href: "/dashboard/owner/agents", label: "Agents", icon: Users },
  { href: "/dashboard/owner/viewings", label: "Viewings", icon: Eye },
  { href: "/dashboard/owner/tenancies", label: "Tenancies", icon: FileText },
]

const sidebarSupport: NavItem[] = [
  { href: "/dashboard/owner/trust", label: "Trust Center", icon: Shield },
  { href: "/dashboard/owner/settings", label: "Settings", icon: Settings },
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()

  // For now, we only have the owner design specific
  const navItems = role === "owner" ? ownerNav : ownerNav // Fallback for demo
  const supportItems = sidebarSupport

  return (
    <aside className="fixed h-full w-[260px] flex flex-col border-r border-border/40 bg-white">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary shadow-lg shadow-primary/20">
            <span className="text-xl font-black text-white italic">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground uppercase">Nikupangishe</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Owner Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation Content */}
      <div className="flex flex-1 flex-col justify-between p-4 overflow-y-auto">
        <div className="space-y-8">
          {/* Main Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-bold transition-all duration-200",
                    isActive
                      ? "bg-primary/[0.04] text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-primary" : "text-muted-foreground/60 transition-colors group-hover:text-foreground")} />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </nav>

          {/* Support Section */}
          <div className="space-y-3">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Support</p>
            <nav className="space-y-1">
              {supportItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13px] font-bold transition-all duration-200",
                      isActive
                        ? "bg-primary/[0.04] text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-primary" : "text-muted-foreground/60 transition-colors group-hover:text-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="mt-8 border-t border-border/40 pt-6 px-2">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="relative h-10 w-10 shrink-0">
              <div className="h-full w-full rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <span className="text-sm font-bold text-amber-700">JM</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate">{userName}</p>
              <span className="text-[10px] font-medium text-muted-foreground">Premium Owner</span>
            </div>
            <MoreVertical className="ml-auto h-4 w-4 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
          </div>
        </div>
      </div>
    </aside>
  )
}

