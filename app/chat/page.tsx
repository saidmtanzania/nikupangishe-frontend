"use client"

import { useState, useEffect } from "react"
import { ChatList } from "@/components/chat/chat-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { MessageSquare, Lock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { chatApi } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { isAuthenticated, token, isLoading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<unknown[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !token) {
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
            setActiveConvoId((list[0] as Record<string, unknown>)?.id as string ?? null)
          }
        }
      })
      .catch(() => setConversations([]))
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [isAuthenticated, token])

  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Sign in to view messages</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your conversations with property owners and agents are available after logging in.
        </p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const activeConvo = conversations.find(
    (c) => (c as Record<string, unknown>)?.id === activeConvoId
  ) as Record<string, unknown> | undefined

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation List */}
      <div className="w-80 shrink-0 hidden md:block">
        <ChatList
          conversations={conversations as Parameters<typeof ChatList>[0]["conversations"]}
          activeId={activeConvoId}
          onSelect={setActiveConvoId}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground animate-pulse">Loading conversations…</p>
          </div>
        ) : activeConvo ? (
          <ChatWindow
            conversation={activeConvo as Parameters<typeof ChatWindow>[0]["conversation"]}
            messages={[]}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No conversations yet</h2>
            <p className="text-sm text-muted-foreground">
              Message a property owner or agent from a listing to start chatting.
            </p>
            <Button asChild variant="outline">
              <Link href="/browse">Browse Listings</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile: show list when no active convo */}
      <div className="md:hidden w-full absolute inset-0 bg-background" style={{ display: activeConvoId ? "none" : "block" }}>
        <ChatList
          conversations={conversations as Parameters<typeof ChatList>[0]["conversations"]}
          activeId={activeConvoId}
          onSelect={setActiveConvoId}
        />
      </div>
    </div>
  )
}
