"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { ChatConversation, ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Send, Smile, Paperclip, Phone, MoreVertical, ArrowLeft, Home, CheckCheck, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { chatApi } from "@/lib/api"

interface ChatWindowProps {
  conversation: ChatConversation
  messages: ChatMessage[]
  onBack?: () => void
}

function formatMsgTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function dateDivider(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function ChatWindow({ conversation, messages: _initialMessages, onBack }: ChatWindowProps) {
  const { user, token } = useAuth()
  const [newMessage, setNewMessage] = useState("")
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const otherPerson = conversation.participants.find((p) => p.id !== user?.id) ?? conversation.participants[0]

  // Fetch messages from the API
  const fetchMessages = useCallback(async () => {
    if (!token) return
    try {
      const raw = await chatApi.messages(conversation.id, token)
      const msgs: ChatMessage[] = (Array.isArray(raw) ? raw : []).map((m: Record<string, unknown>) => ({
        id: String(m.id),
        conversationId: String(m.conversationId ?? conversation.id),
        senderId: String(m.senderId),
        content: String(m.content ?? ""),
        timestamp: String(m.createdAt ?? m.timestamp ?? new Date().toISOString()),
      }))
      setAllMessages(msgs)
    } catch {
      setAllMessages([])
    } finally {
      setLoading(false)
    }
  }, [token, conversation.id])

  useEffect(() => {
    setLoading(true)
    setAllMessages([])
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [allMessages.length])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newMessage.trim()
    if (!trimmed || sending || !token) return
    setSending(true)
    setNewMessage("")

    // Optimistic local message
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      conversationId: conversation.id,
      senderId: user?.id ?? "",
      content: trimmed,
      timestamp: new Date().toISOString(),
    }
    setAllMessages((prev) => [...prev, optimistic])

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api"}/chat/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            content: trimmed,
            receiverId: otherPerson?.id,
          }),
        }
      )
      if (res.ok) {
        const json = await res.json()
        const msg = json?.data ?? json
        setAllMessages((prev) =>
          prev.map((m) =>
            m.id === optimistic.id
              ? {
                  id: String(msg.id ?? optimistic.id),
                  conversationId: conversation.id,
                  senderId: String(msg.senderId ?? optimistic.senderId),
                  content: String(msg.content ?? optimistic.content),
                  timestamp: String(msg.createdAt ?? msg.timestamp ?? optimistic.timestamp),
                }
              : m
          )
        )
      }
    } catch {
      // keep optimistic message
    } finally {
      setSending(false)
    }
  }

  // Group messages with date dividers
  let lastDate = ""

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-secondary border-b border-border px-4 py-2.5">
        {onBack && (
          <button onClick={onBack} className="md:hidden mr-1">
            <ArrowLeft className="size-5 text-muted-foreground" />
          </button>
        )}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-muted-foreground">
          {otherPerson ? getInitials(otherPerson.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium text-foreground truncate">
            {otherPerson?.name ?? "Unknown"}
          </p>
          <Link
            href={`/properties/${conversation.propertyId}`}
            className="flex items-center gap-1 text-[12px] text-muted-foreground hover:underline truncate"
          >
            <Home className="size-3 shrink-0" />
            {conversation.propertyTitle}
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <Phone className="size-4.5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-accent transition-colors">
            <MoreVertical className="size-4.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-[5%] md:px-[10%] py-4 bg-muted"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="flex items-center gap-2 bg-card dark:bg-card px-4 py-2 rounded-lg shadow-sm">
              <Lock className="size-3 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">
                Messages are end-to-end encrypted. No one outside of this chat can read them.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {allMessages.map((msg) => {
              const isMe = msg.senderId === user?.id
              const dayLabel = dateDivider(msg.timestamp)
              let showDivider = false
              if (dayLabel !== lastDate) {
                lastDate = dayLabel
                showDivider = true
              }
              return (
                <div key={msg.id}>
                  {showDivider && (
                    <div className="flex justify-center my-3">
                      <span className="bg-card dark:bg-card text-muted-foreground text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
                        {dayLabel}
                      </span>
                    </div>
                  )}
                  <div className={cn("flex mb-0.5", isMe ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[65%] rounded-lg px-2.5 pt-1.5 pb-1 shadow-sm relative",
                        isMe
                          ? "bg-primary/15 dark:bg-primary/20 rounded-tr-none"
                          : "bg-card dark:bg-card rounded-tl-none"
                      )}
                    >
                      <p className="text-sm leading-5 text-foreground whitespace-pre-wrap wrap-break-word">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
                        <span className={cn(
                          "text-[11px]",
                          isMe
                            ? "text-muted-foreground"
                            : "text-muted-foreground"
                        )}>
                          {formatMsgTime(msg.timestamp)}
                        </span>
                        {isMe && (
                          <CheckCheck className="size-3.5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input Bar ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 bg-secondary border-t border-border px-4 py-2"
      >
        <button type="button" className="p-2 hover:bg-accent rounded-full transition-colors shrink-0">
          <Smile className="size-5.5 text-muted-foreground" />
        </button>
        <button type="button" className="p-2 hover:bg-accent rounded-full transition-colors shrink-0">
          <Paperclip className="size-5.5 text-muted-foreground" />
        </button>
        <div className="flex-1 bg-background rounded-lg px-3 py-2 min-h-10.5">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
            disabled={sending}
          />
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className={cn(
            "p-2.5 rounded-full transition-colors shrink-0",
            newMessage.trim()
              ? "bg-primary hover:bg-primary/90 text-white"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  )
}
