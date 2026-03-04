"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shield, User, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!identifier.trim()) newErrors.identifier = "Email or phone number is required"
    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setApiError("")
    try {
      const user = await login(identifier.trim(), password)
      // If there's a redirect param, go there; otherwise go to the user's dashboard
      const redirectTo = searchParams.get("redirect")
      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo)
      } else {
        const role = user.role === "admin" ? "owner" : user.role
        router.push(`/dashboard/${role}`)
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header - Unified with Register Page */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h2 className="text-xl font-medium text-foreground lg:text-xl">Welcome back</h2>
        </div>
        <p className="text-sm text-muted-foreground">Sign in to your Nikupangishe account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="identifier" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Email or Phone Number</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="identifier"
              type="text"
              placeholder="+255... or email"
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Password</Label>
            <Link href="/auth/forgot-password" title="Transition to forgot password" className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
              Forgot Password?
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

        <Button type="submit" className="relative h-11 w-full rounded-xl text-sm font-medium transition-transform active:scale-[0.98]" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
          {!isLoading && <ArrowRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />}
        </Button>

        {apiError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-[12px] font-medium text-destructive">
            {apiError}
          </p>
        )}
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center border-t border-muted/10 pt-6">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-primary">
            Create account
          </Link>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 justify-center py-2 px-4 rounded-lg bg-muted/30 border border-muted/20 text-[10px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        <Shield className="h-3 w-3 text-primary/70" />
        <span>Secure &amp; Encrypted Session</span>
      </div>

      {/* Test credentials hint */}
      <p className="mt-4 text-center text-[10px] text-muted-foreground">
        Try: <code className="text-primary">amina.hassan@nikupangishe.co.tz</code> / <code className="text-primary">Owner@1234</code>
      </p>
    </div>
  )
}
