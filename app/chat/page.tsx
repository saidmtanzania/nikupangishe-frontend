"use client"

import { useState } from "react"
import { ChatList } from "@/components/chat/chat-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { mockConversations, mockMessages } from "@/lib/mock-data"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  const [activeConvoId, setActiveConvoId] = useState<string | null>(
    mockConversations[0]?.id ?? null
  )

  const activeConvo = mockConversations.find((c) => c.id === activeConvoId)
  const activeMessages = mockMessages.filter((m) => m.conversationId === activeConvoId)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation List */}
      <div className="w-80 shrink-0 hidden md:block">
        <ChatList
          conversations={mockConversations}
          activeId={activeConvoId}
          onSelect={setActiveConvoId}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {activeConvo ? (
          <ChatWindow conversation={activeConvo} messages={activeMessages} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">No conversation selected</h2>
            <p className="text-sm text-muted-foreground">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>

      {/* Mobile: show list as overlay when no active convo */}
      <div className="md:hidden w-full absolute inset-0 bg-background" style={{ display: activeConvoId ? "none" : "block" }}>
        <ChatList
          conversations={mockConversations}
          activeId={activeConvoId}
          onSelect={setActiveConvoId}
        />
      </div>
    </div>
  )
}
