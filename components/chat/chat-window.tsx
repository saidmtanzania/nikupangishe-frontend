"use client"

import { useState } from "react"
import type { ChatConversation, ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send, Phone, MoreVertical, Home, Shield } from "lucide-react"
import Link from "next/link"

interface ChatWindowProps {
  conversation: ChatConversation
  messages: ChatMessage[]
}

const currentUserId = "user-1"

export function ChatWindow({ conversation, messages }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages)
  const otherPerson = conversation.participants.find((p) => p.id !== currentUserId)!

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return
    const msg: ChatMessage = {
      id: `msg-local-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }
    setLocalMessages((prev) => [...prev, msg])
    setNewMessage("")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            {otherPerson.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{otherPerson.name}</p>
              <span className="text-xs text-muted-foreground capitalize">({otherPerson.role})</span>
            </div>
            <Link
              href={`/properties/${conversation.propertyId}`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Home className="h-3 w-3" />
              {conversation.propertyTitle}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Property Context Bar */}
      <div className="flex items-center gap-2 border-b border-border bg-accent px-5 py-2">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs text-muted-foreground">
          This conversation is about a verified listing. Be cautious of off-platform payment requests.
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-5">
        <div className="flex flex-col gap-3">
          {localMessages.map((msg) => {
            const isMe = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2.5",
                    isMe
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}
