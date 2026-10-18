"use client"

import { useCallback, useEffect, useState } from "react"
import { Bell, CheckCheck } from "lucide-react"
import { notificationsApi, type ApiNotification } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { NOTIFICATIONS_CHANGED_EVENT } from "@/components/dashboard/dashboard-topbar"

function formatNotificationDate(value: string) {
  return new Date(value).toLocaleString("en-TZ", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function NotificationsContent() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = useCallback(async () => {
    if (!token) return
    setError(null)
    try {
      const result = await notificationsApi.list(token, { limit: 50 })
      setNotifications(result.data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load notifications")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  async function markRead(notification: ApiNotification) {
    if (!token || notification.isRead) return
    try {
      await notificationsApi.markRead(notification.id, token)
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, isRead: true, readAt: new Date().toISOString() }
            : item,
        ),
      )
      window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT))
    } catch {
      setError("Unable to mark this notification as read")
    }
  }

  async function markAllRead() {
    if (!token) return
    try {
      await notificationsApi.markAllRead(token)
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
      window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT))
    } catch {
      setError("Unable to mark notifications as read")
    }
  }

  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 px-8 py-8 backdrop-blur-md dark:bg-[#221610]/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium uppercase tracking-tight text-slate-800 dark:text-white">Notifications</h2>
            <p className="mt-1 text-sm font-normal text-slate-500">
              Updates about your listings, viewings, tenancy, exchanges, and messages.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void markAllRead()}
            disabled={unread === 0}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all read
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl space-y-6 px-8 pb-12">
        {error && <p className="rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-medium text-red-600">{error}</p>}

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
            <span>All activity</span>
            <span>{loading ? "\u00a0" : `${unread} unread`}</span>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800" aria-busy="true" aria-label="Loading notifications">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-start gap-4 px-6 py-5">
                  <div className="size-10 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3.5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                <Bell className="size-6 text-slate-300" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">You are all caught up</h2>
              <p className="mt-1 text-sm text-slate-400">New activity will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => void markRead(notification)}
                  className={cn(
                    "flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30",
                    !notification.isRead && "bg-primary/3",
                  )}
                >
                  <span className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    notification.isRead ? "bg-slate-100 text-slate-400 dark:bg-slate-800" : "bg-primary/10 text-primary",
                  )}>
                    <Bell className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                        {notification.title}
                        {!notification.isRead && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                      </span>
                      <span className="text-xs text-slate-400">{formatNotificationDate(notification.createdAt)}</span>
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">{notification.body}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
