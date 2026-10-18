"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { notificationsApi } from "@/lib/api"
import { NOTIFICATIONS_CHANGED_EVENT } from "@/components/dashboard/dashboard-topbar"
import {
  LayoutDashboard,
  Building2,
  HousePlus,
  Users,
  CalendarCheck,
  KeyRound,
  ShieldCheck,
  Settings,
  LogOut,
  User,
  HelpCircle,
  MessageSquare,
  BriefcaseBusiness,
  Bell,
  Wallet,
  ArrowLeftRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

const communication = (role: string): NavSection => ({
  title: "Communication",
  items: [
    { href: `/dashboard/${role}/chat`, label: "Messages", icon: MessageSquare },
    { href: `/dashboard/${role}/notifications`, label: "Notifications", icon: Bell },
  ],
})

const ownerNav: NavSection[] = [
  { title: "Overview", items: [{ href: "/dashboard/owner", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Properties",
    items: [
      { href: "/dashboard/owner/houses", label: "My Houses", icon: Building2 },
      { href: "/dashboard/owner/houses/new", label: "Add House", icon: HousePlus },
      { href: "/dashboard/owner/viewings", label: "Viewings", icon: CalendarCheck },
      { href: "/dashboard/owner/tenancies", label: "Tenancies", icon: KeyRound },
      { href: "/dashboard/owner/agents", label: "Agents", icon: BriefcaseBusiness },
    ],
  },
  communication("owner"),
  { title: "Account", items: [{ href: "/dashboard/owner/verification", label: "Trust Center", icon: ShieldCheck }] },
]

const agentNav: NavSection[] = [
  { title: "Overview", items: [{ href: "/dashboard/agent", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Work",
    items: [
      { href: "/dashboard/agent/viewings", label: "Viewings", icon: CalendarCheck },
      { href: "/dashboard/agent/commissions", label: "Earnings", icon: Wallet },
    ],
  },
  communication("agent"),
]

const tenantNav: NavSection[] = [
  { title: "Overview", items: [{ href: "/dashboard/tenant", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "My Home",
    items: [
      { href: "/dashboard/tenant/viewings", label: "My Viewings", icon: CalendarCheck },
      { href: "/dashboard/tenant/exchange", label: "House Exchange", icon: ArrowLeftRight },
    ],
  },
  communication("tenant"),
  { title: "Account", items: [{ href: "/dashboard/tenant/verification", label: "Trust Score", icon: ShieldCheck }] },
]

const adminNav: NavSection[] = [
  { title: "Overview", items: [{ href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "Management",
    items: [
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/houses", label: "All Houses", icon: Building2 },
      { href: "/dashboard/admin/agents", label: "Agents", icon: BriefcaseBusiness },
    ],
  },
  communication("admin"),
]

interface DashboardSidebarProps {
  role: "owner" | "agent" | "tenant" | "admin"
  userName: string
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, token } = useAuth()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  const navSections = role === "owner" ? ownerNav : role === "agent" ? agentNav : role === "admin" ? adminNav : tenantNav
  // Longest matching href wins, so /houses/new doesn't also light up /houses
  const activeHref = navSections
    .flatMap((s) => s.items.map((i) => i.href))
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0]
  const initials = userName.split(" ").map((name) => name[0]).join("")
  const badgeLabel = role === "owner" ? "Premium Owner" : role === "agent" ? "Verified Agent" : role === "admin" ? "Platform Admin" : "Gold Tenant"

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setSettingsOpen(false)
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [settingsOpen])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    const load = () =>
      notificationsApi
        .unreadCount(token)
        .then((count) => {
          if (!cancelled) setUnreadNotifications(count)
        })
        .catch(() => undefined)
    load()
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, load)
    return () => {
      cancelled = true
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, load)
    }
  }, [token])

  return (
    <aside className="sticky top-0 h-screen w-65 shrink-0 flex flex-col border-r border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200/70 px-6 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[#b83d0d] text-white shadow-sm shadow-primary/30">
            <span className="font-bold italic">N</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none tracking-tight text-slate-800 dark:text-white">Nikupangishe</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">Rental Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = item.href === activeHref
                const Icon = item.icon
                const badge = item.icon === Bell ? unreadNotifications : 0
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                    )}
                  >
                    {isActive && <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
                    <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white")} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge > 0 && (
                      <span className="min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative p-4 border-t border-slate-100 dark:border-slate-800" ref={panelRef}>
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
