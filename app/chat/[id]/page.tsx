"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function ChatIdRedirect() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role) {
      router.replace(`/dashboard/${user.role}/chat?conversation=${encodeURIComponent(id)}`)
    }
  }, [user, id, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  )
}
