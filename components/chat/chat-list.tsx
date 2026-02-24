"use client"

import type { ChatConversation } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChatListProps {
  conversations: ChatConversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ChatList({ conversations, activeId, onSelect }: ChatListProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Messages</h2>
        <Badge variant="secondary" className="ml-auto text-xs">
          {conversations.reduce((s, c) => s + c.unreadCount, 0)}
        </Badge>
      </div>
      <div className="flex-1 overflow-auto">
        {conversations.map((convo) => {
          const otherPerson = convo.participants.find((p) => p.id !== "user-1")!
          const isActive = convo.id === activeId
          return (
            <button
              key={convo.id}
              onClick={() => onSelect(convo.id)}
              className={cn(
                "flex w-full items-start gap-3 p-4 text-left transition-colors border-b border-border",
                isActive ? "bg-accent" : "hover:bg-muted"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                {otherPerson.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground truncate">{otherPerson.name}</p>
                  {convo.unreadCount > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{convo.propertyTitle}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{convo.lastMessage}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
