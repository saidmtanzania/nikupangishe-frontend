"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!identifier.trim()) {
      newErrors.identifier = "Email or phone number is required"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/tenant")
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-primary-foreground">N</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your Nikupangishe account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="identifier" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Email or Phone Number</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              placeholder="+255... or name@email.com"
              className={cn(
                "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                errors.identifier && "border-destructive focus-visible:ring-destructive/20"
              )}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value)
                if (errors.identifier) setErrors({ ...errors, identifier: "" })
              }}
            />
          </div>
          {errors.identifier && <p className="text-[11px] font-medium text-destructive ml-1">{errors.identifier}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Password</Label>
            <Link href="#" className="text-[11px] font-medium text-primary">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                errors.password && "border-destructive focus-visible:ring-destructive/20"
              )}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: "" })
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] font-medium text-destructive ml-1">{errors.password}</p>}
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="flex items-center gap-2 justify-center py-2 px-4 rounded-lg bg-muted/30 border border-muted/20 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        <Shield className="h-3 w-3 text-primary/70" />
        <span>Secure & Encrypted Session</span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-primary">
          Create account
        </Link>
      </p>
    </div>
  )
}
