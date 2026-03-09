"use client"

import { useParams, redirect } from "next/navigation"

export default function ChatRedirect() {
  const { id } = useParams<{ id: string }>()
  redirect(`/chat?conversation=${encodeURIComponent(id)}`)
}
