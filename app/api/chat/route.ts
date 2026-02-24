import { NextResponse } from "next/server"
import { mockConversations, mockMessages } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json({ conversations: mockConversations, messages: mockMessages })
}
