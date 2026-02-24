import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In - Nikupangishe",
  description: "Sign in to your Nikupangishe account to manage your properties, find rentals, and more.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <LoginForm />
      </div>
    </div>
  )
}
