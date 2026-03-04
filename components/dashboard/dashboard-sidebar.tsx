"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Shield,
  Settings,
  LogOut,
  User,
  HelpCircle,
  MessageSquare,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: any
}

const ownerNav: NavItem[] = [
  { href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/owner/houses", label: "My Houses", icon: Home },
  { href: "/dashboard/owner/houses/new", label: "Add House", icon: PlusCircle },
  { href: "/dashboard/owner/agents", label: "Agents", icon: Users },
  { href: "/dashboard/owner/viewings", label: "Viewings", icon: Calendar },
  { href: "/dashboard/owner/tenancies", label: "Tenancies", icon: ClipboardList },
  { href: "/dashboard/owner/verification", label: "Trust Center", icon: Shield },
  { href: "/chat", label: "Chat", icon: MessageSquare },
]

const agentNav: NavItem[] = [
  { href: "/dashboard/agent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/agent/viewings", label: "Viewings", icon: Users },
  { href: "/dashboard/agent/commissions", label: "Earnings", icon: FileText },
  { href: "/chat", label: "Chat", icon: MessageSquare },
]

const tenantNav: NavItem[] = [
  { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tenant/exchange", label: "Exchanges", icon: FileText },
  { href: "/dashboard/tenant/verification", label: "Trust Score", icon: Shield },
  { href: "/chat", label: "Chat", icon: MessageSquare },
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const navItems = role === "owner" ? ownerNav : role === "agent" ? agentNav : tenantNav
  const initials = userName.split(' ').map(n => n[0]).join('')
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
  const badgeLabel = role === "owner" ? "Premium Owner" : role === "agent" ? "Verified Agent" : "Gold Tenant"

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [settingsOpen])

  return (
    <aside className="sticky top-0 h-screen w-[260px] shrink-0 flex flex-col border-r border-primary/10 bg-white dark:bg-slate-900 shadow-sm">
      {/* Logo Section */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="font-medium italic">N</span>
          </div>
          <div>
            <h1 className="text-base font-medium leading-none text-slate-800 dark:text-white uppercase tracking-tight">Nikupangishe</h1>
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
      <div className="relative p-4 border-t border-slate-100 dark:border-slate-800" ref={panelRef}>
        {/* Settings Panel (slides up) */}
        {settingsOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Settings</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => { setSettingsOpen(false) }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => { setSettingsOpen(false) }}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span>Help & Support</span>
              </button>
              <div className="mx-3 my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="relative h-8 w-8 shrink-0">
            <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-white shadow-sm">
              <span className="text-[10px] font-medium text-primary uppercase">{initials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
            <div className="mt-0.5">
              <span className="text-[9px] font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{badgeLabel}</span>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              settingsOpen
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
