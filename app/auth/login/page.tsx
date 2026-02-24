import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In - Nikupangishe",
  description: "Sign in to your Nikupangishe account to manage your properties, find rentals, and more.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:px-8 selection:bg-primary/10">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Top Color Accent */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-6 lg:p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
