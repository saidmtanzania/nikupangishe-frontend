import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account - Nikupangishe",
  description: "Join Tanzania's trusted rental platform. Create your account as a tenant, owner, or agent.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
