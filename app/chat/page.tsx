"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatList } from "@/components/chat/chat-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { MessageSquare, ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { chatApi } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { token } = useAuth()
  const searchParams = useSearchParams()
  const requestedConversationId = searchParams.get("conversation")
  const [conversations, setConversations] = useState<unknown[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Loading conversations…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* ── Conversation List ─────────────────────────────────────── */}
      <div className={`w-80 shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col ${activeConvoId ? "hidden md:flex" : "flex"}`}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Messages</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MessageSquare className="size-5 text-slate-300" />
              </div>
              <p className="text-xs font-medium text-slate-500">No conversations yet</p>
              <p className="text-[10px] text-slate-400">
                Start a conversation from a property listing
              </p>
              <Button asChild size="sm" variant="outline" className="mt-1 text-xs h-8">
                <Link href="/browse">Browse Listings</Link>
              </Button>
            </div>
          ) : (
            <ChatList
              conversations={conversations as Parameters<typeof ChatList>[0]["conversations"]}
              activeId={activeConvoId}
              onSelect={setActiveConvoId}
            />
          )}
        </div>
      </div>

      {/* ── Chat Window ───────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col bg-[#faf9f8] dark:bg-[#1a1210] ${activeConvoId ? "flex" : "hidden md:flex"}`}>
        {activeConvo ? (
          <>
            {/* Mobile back button */}
            <div className="md:hidden px-3 pt-3">
              <button
                onClick={() => setActiveConvoId(null)}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to conversations
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                conversation={activeConvo as Parameters<typeof ChatWindow>[0]["conversation"]}
                messages={[]}
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
            <div className="size-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
              <MessageSquare className="size-7 text-primary/40" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Select a conversation</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-60">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
