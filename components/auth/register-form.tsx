"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Shield, Home, Briefcase, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const roles = [
  {
    value: "tenant",
    label: "Tenant",
    description: "I'm looking for a place to rent",
    icon: Home,
  },
  {
    value: "owner",
    label: "Property Owner",
    description: "I want to list my property",
    icon: Briefcase,
  },
  {
    value: "agent",
    label: "Agent",
    description: "I manage properties for owners",
    icon: UserCheck,
  },
] as const

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("tenant")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/dashboard/${selectedRole}`)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-2 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">N</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join Tanzania&apos;s trusted rental platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Role Selection */}
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-medium">I am a...</Label>
          <RadioGroup
            value={selectedRole}
            onValueChange={setSelectedRole}
            className="grid grid-cols-3 gap-3"
          >
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Label
                  key={role.value}
                  htmlFor={`role-${role.value}`}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition-all hover:border-primary/50",
                    selectedRole === role.value
                      ? "border-primary bg-accent"
                      : "border-border"
                  )}
                >
                  <RadioGroupItem
                    value={role.value}
                    id={`role-${role.value}`}
                    className="sr-only"
                  />
                  <Icon className={cn(
                    "h-5 w-5",
                    selectedRole === role.value ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-xs font-medium">{role.label}</span>
                </Label>
              )
            })}
          </RadioGroup>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Enter your full name" required />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-phone">Phone Number</Label>
          <div className="flex gap-2">
            <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              +255
            </div>
            <Input
              id="reg-phone"
              type="tel"
              placeholder="7XX XXX XXX"
              className="flex-1"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-email">
            Email <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="reg-email" type="email" placeholder="you@example.com" />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="reg-password">Password</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span>By signing up, you agree to our Terms of Service</span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
