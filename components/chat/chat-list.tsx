"use client"

import type { ChatConversation } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"

interface ChatListProps {
  conversations: ChatConversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  const yesterday = new Date()
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" })
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  const { user } = useAuth()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => {
      const other = c.participants.find((p) => p.id !== user?.id)
      const name = other?.name?.toLowerCase() ?? ""
      const title = c.propertyTitle?.toLowerCase() ?? ""
      const last = c.lastMessage?.toLowerCase() ?? ""
      return name.includes(q) || title.includes(q) || last.includes(q)
    })
  }, [conversations, search, user?.id])

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="px-2.5 py-1.5 bg-secondary">
          <div className="flex items-center gap-2 bg-background dark:bg-muted rounded-lg px-3 h-8.5">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start new chat"
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center px-6">
            <p className="text-xs text-muted-foreground">
              {search.trim() ? "No results found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          filtered.map((convo) => {
            const other = convo.participants.find((p) => p.id !== user?.id) ?? convo.participants[0]
            const isActive = convo.id === activeId
            const hasUnread = convo.unreadCount > 0
            return (
              <button
                key={convo.id}
                onClick={() => onSelect(convo.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary dark:hover:bg-muted",
                  isActive && "bg-secondary dark:bg-muted"
                )}
              >
                {/* Avatar */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-muted-foreground">
                  {other ? getInitials(other.name) : "?"}
                </div>

                <div className="flex-1 min-w-0 border-b border-border pb-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-base leading-5.5 text-foreground truncate",
                      hasUnread && "font-semibold"
                    )}>
                      {other?.name ?? "Unknown"}
                    </p>
                    <span className={cn(
                      "text-xs shrink-0",
                      hasUnread ? "text-primary" : "text-muted-foreground"
                    )}>
                      {timeAgo(convo.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className={cn(
                      "text-[13.5px] leading-5 truncate flex-1",
                      hasUnread
                        ? "text-foreground dark:text-secondary font-medium"
                        : "text-muted-foreground"
                    )}>
                      {convo.lastMessage || "Tap to start conversation"}
                    </p>
                    {hasUnread && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
