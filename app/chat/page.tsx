"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatList } from "@/components/chat/chat-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { MessageSquare, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { chatApi } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { user, token } = useAuth()
  const searchParams = useSearchParams()
  const requestedConversationId = searchParams.get("conversation")
  const [conversations, setConversations] = useState<unknown[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  function selectConversation(id: string) {
    setActiveConvoId(id)
    // Clear unread badge immediately in the local list
    setConversations((prev) =>
      prev.map((c) => {
        const conv = c as Record<string, unknown>
        return conv.id === id ? { ...conv, unreadCount: 0 } : c
      })
    )
  }

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    chatApi.conversations(token)
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res) ? res : ((res as Record<string, unknown>)?.data as unknown[] ?? [])
          setConversations(list)
          if (list.length > 0) {
            const foundRequested = requestedConversationId
              ? list.some((item) => (item as Record<string, unknown>)?.id === requestedConversationId)
              : false
            setActiveConvoId(
              foundRequested
                ? requestedConversationId
                : ((list[0] as Record<string, unknown>)?.id as string ?? null)
            )
          }
        }
      })
      .catch(() => setConversations([]))
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [token, requestedConversationId])

  const activeConvo = conversations.find(
    (c) => (c as Record<string, unknown>)?.id === activeConvoId
  ) as Record<string, unknown> | undefined

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-secondary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Loading conversations…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background">
      {/* ── Left Panel: Conversation List ───────────────────────── */}
      <div className={`w-85 lg:w-95 shrink-0 border-r border-border bg-background flex-col ${activeConvoId ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-secondary">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground">
              {user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "U"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <MessageSquare className="size-4.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="size-16 rounded-full bg-secondary flex items-center justify-center">
                <MessageSquare className="size-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No conversations yet</p>
              <p className="text-xs text-muted-foreground">
                Start a conversation from a property listing
              </p>
              <Button asChild size="sm" className="mt-1 text-xs h-8 bg-primary hover:bg-primary/90 text-white">
                <Link href="/browse">Browse Listings</Link>
              </Button>
            </div>
          ) : (
            <ChatList
              conversations={conversations as Parameters<typeof ChatList>[0]["conversations"]}
              activeId={activeConvoId}
              onSelect={selectConversation}
            />
          )}
        </div>
      </div>

      {/* ── Right Panel: Chat Window ────────────────────────────── */}
      <div className={`flex-1 flex flex-col ${activeConvoId ? "flex" : "hidden md:flex"}`}>
        {activeConvo ? (
          <ChatWindow
            conversation={activeConvo as Parameters<typeof ChatWindow>[0]["conversation"]}
            messages={[]}
            onBack={() => setActiveConvoId(null)}
          />
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-4 text-center px-6 bg-muted"
          >
            <div className="size-50 rounded-full bg-accent flex items-center justify-center">
              <svg viewBox="0 0 303 172" width="250" className="opacity-40">
                <path fill="hsl(var(--primary) / 0.25)" d="M229.565 160.229c32.647-10.984 57.366-41.457 53.825-73.27-3.542-31.812-33.94-55.263-62.79-69.694C191.75 3.834 159.279-4.634 130.09 3.14 100.901 10.913 74.993 35.023 54.934 60.96 34.876 86.898 20.667 114.664 22.175 140.39c1.508 25.726 18.733 49.413 46.847 55.463 28.113 6.051 67.116-5.534 101.695-14.4 34.579-8.866 64.97-15.046 58.848-21.223Z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[28px] font-light text-foreground">Nikupangishe Web</h3>
              <p className="text-sm text-muted-foreground mt-3 max-w-md">
                Send and receive messages about properties. Select a conversation to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
