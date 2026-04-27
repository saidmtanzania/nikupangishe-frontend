"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function ChatRedirectPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role) {
      router.replace(`/dashboard/${user.role}/chat`)
    }
  }, [user, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  )
}
