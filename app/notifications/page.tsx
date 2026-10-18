"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RequireAuth } from "@/components/auth/require-auth"
import { useAuth } from "@/context/auth-context"

function RedirectToRoleNotifications() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace(`/dashboard/${user.role}/notifications`)
  }, [user, router])

  return null
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <RedirectToRoleNotifications />
    </RequireAuth>
  )
}
