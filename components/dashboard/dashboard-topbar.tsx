"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, CheckCheck, ChevronRight, Globe, LogOut, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context"
import { notificationsApi, type ApiNotification } from "@/lib/api"
import { cn } from "@/lib/utils"

export const NOTIFICATIONS_CHANGED_EVENT = "nkp:notifications-changed"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-/i

function titleCase(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function useBreadcrumbs(role: string) {
  const pathname = usePathname()
  const home = { label: "Dashboard", href: `/dashboard/${role}` }

  const rest = pathname.replace(`/dashboard/${role}`, "").split("/").filter(Boolean)
  const crumbs = [home]
  let href = home.href
  for (const segment of rest) {
    href += `/${segment}`
    crumbs.push({ label: UUID_RE.test(segment) ? "Details" : titleCase(segment), href })
  }
  return crumbs
}

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

export function DashboardTopbar({ role }: { role: string }) {
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const crumbs = useBreadcrumbs(role)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ApiNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshCount = useCallback(() => {
    if (!token) return
    notificationsApi.unreadCount(token).then(setUnread).catch(() => undefined)
  }, [token])

  useEffect(() => {
    refreshCount()
    const id = window.setInterval(refreshCount, 60000)
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshCount)
    return () => {
      window.clearInterval(id)
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshCount)
    }
  }, [refreshCount])

  useEffect(() => {
    if (!open || !token) return
    setLoading(true)
    notificationsApi
      .list(token, { limit: 6 })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [open, token])

  const notifyChanged = () => window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT))

  async function openNotification(n: ApiNotification) {
    if (token && !n.isRead) {
      await notificationsApi.markRead(n.id, token).catch(() => undefined)
      setItems((cur) => cur.map((i) => (i.id === n.id ? { ...i, isRead: true } : i)))
      notifyChanged()
    }
  }

  async function markAll() {
    if (!token) return
    await notificationsApi.markAllRead(token).catch(() => undefined)
    setItems((cur) => cur.map((i) => ({ ...i, isRead: true })))
    notifyChanged()
  }

  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : ""
  const pageTitle = crumbs.length > 1 ? crumbs[crumbs.length - 1].label : `${greeting()}, ${user?.firstName ?? ""}`

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {i < crumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-primary">{c.label}</Link>
              ) : (
                <span className="text-slate-500 dark:text-slate-300">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="truncate text-base font-semibold text-slate-800 dark:text-white">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 md:flex dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Globe className="h-4 w-4" />
          View site
        </Link>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:text-primary dark:border-slate-700 dark:bg-slate-800",
                open && "border-primary/30 text-primary ring-4 ring-primary/10",
              )}
            >
              <Bell className="h-4.5 w-4.5" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={10} className="w-96 overflow-hidden rounded-2xl p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</p>
                <p className="text-[11px] text-slate-400">{unread > 0 ? `${unread} unread` : "You're all caught up"}</p>
              </div>
              <button
                type="button"
                onClick={() => void markAll()}
                disabled={unread === 0}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-xs text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <Bell className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No notifications yet</p>
                  <p className="text-xs text-slate-400">New activity will show up here.</p>
                </div>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void openNotification(n)}
                    className={cn(
                      "flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50",
                      !n.isRead && "bg-primary/3",
                    )}
                  >
                    <span className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      n.isRead ? "bg-slate-100 text-slate-400 dark:bg-slate-800" : "bg-primary/10 text-primary",
                    )}>
                      <Bell className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-slate-800 dark:text-white">{n.title}</span>
                        <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(n.createdAt)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{n.body}</span>
                    </span>
                    {!n.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                ))
              )}
            </div>

            <Link
              href={`/dashboard/${role}/notifications`}
              onClick={() => setOpen(false)}
              className="block border-t border-slate-100 py-3 text-center text-xs font-semibold text-primary hover:bg-primary/5 dark:border-slate-800"
            >
              View all notifications
            </Link>
          </PopoverContent>
        </Popover>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-amber-500 text-xs font-bold text-white shadow-sm">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold text-slate-800 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="block text-[10px] font-medium capitalize text-slate-400">{role}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-56 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${role}`}>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/${role}/notifications`}>Notifications</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
