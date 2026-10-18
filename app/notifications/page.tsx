"use client"

import { useCallback, useEffect, useState } from "react"
import { Bell, CheckCheck, Loader2 } from "lucide-react"
import { RequireAuth } from "@/components/auth/require-auth"
import { notificationsApi, type ApiNotification } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

function formatNotificationDate(value: string) {
  return new Date(value).toLocaleString("en-TZ", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function NotificationsContent() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = useCallback(async () => {
    if (!token) return
    setLoading(true)
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
    } catch {
      setError("Unable to mark this notification as read")
    }
  }

  async function markAllRead() {
    if (!token) return
    try {
      await notificationsApi.markAllRead(token)
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
    } catch {
      setError("Unable to mark notifications as read")
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Activity</p>
          <h1 className="mt-2 text-3xl font-semibold text-foreground">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">Updates about your listings, viewings, tenancy, exchanges, and messages.</p>
        </div>
        <button
          type="button"
          onClick={() => void markAllRead()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <CheckCheck className="size-4" aria-hidden="true" />
          Mark all read
        </button>
      </header>

      {error && <p className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 px-6 py-20 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-label="Loading notifications" />
            Loading notifications
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <Bell className="size-10 text-muted-foreground/40" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">You are all caught up</h2>
            <p className="mt-2 text-sm text-muted-foreground">New activity will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                type="button"
                key={notification.id}
                onClick={() => void markRead(notification)}
                className={cn(
                  "flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/50",
                  !notification.isRead && "bg-primary/3",
                )}
              >
                <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", notification.isRead ? "bg-muted" : "bg-primary")} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-foreground">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{formatNotificationDate(notification.createdAt)}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{notification.body}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <NotificationsContent />
    </RequireAuth>
  )
}
