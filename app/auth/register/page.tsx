"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  Search,
  Building2,
  Handshake,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("tenant")
  const [apiError, setApiError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (formData.phone.replace(/\s+/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setApiError("")
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\s+/g, ""),
        password: formData.password,
        role: selectedRole as "owner" | "agent" | "tenant",
      })
      router.push(`/auth/verify?phone=${encodeURIComponent(formData.phone.replace(/\s+/g, ""))}`)
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:px-8 selection:bg-primary/10">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

        {/* Top Color Accent */}
        <div className="h-1.5 w-full bg-primary" />

        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-4 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-medium text-foreground lg:text-xl">Create account</h2>
            </div>
            <p className="text-sm text-muted-foreground">Join the future of renting in Tanzania.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className={cn(
                        "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                        errors.firstName && "border-destructive focus-visible:ring-destructive/20"
                      )}
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value })
                        if (errors.firstName) setErrors({ ...errors, firstName: "" })
                      }}
                    />
                  </div>
                  {errors.firstName && <p className="text-[11px] font-medium text-destructive ml-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className={cn(
                        "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                        errors.lastName && "border-destructive focus-visible:ring-destructive/20"
                      )}
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value })
                        if (errors.lastName) setErrors({ ...errors, lastName: "" })
                      }}
                    />
                  </div>
                  {errors.lastName && <p className="text-[11px] font-medium text-destructive ml-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={cn(
                      "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                      errors.email && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                  />
                </div>
                {errors.email && <p className="text-[11px] font-medium text-destructive ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+255 7XX XXX XXX"
                    className={cn(
                      "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                      errors.phone && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value })
                      if (errors.phone) setErrors({ ...errors, phone: "" })
                    }}
                  />
                </div>
                {errors.phone && <p className="text-[11px] font-medium text-destructive ml-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className={cn(
                      "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                      errors.password && "border-destructive focus-visible:ring-destructive/20"
                    )}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                  />
                </div>
                {errors.password && <p className="text-[11px] font-medium text-destructive ml-1">{errors.password}</p>}
              </div>

              {/* Role Switcher */}
              <div className="space-y-3">
                <Label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">I am a...</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'tenant', label: 'Tenant', icon: Search },
                    { id: 'owner', label: 'Owner', icon: Building2 },
                    { id: 'agent', label: 'Agent', icon: Handshake },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center transition-all",
                        selectedRole === role.id
                          ? "border-primary bg-primary/[0.02] text-primary"
                          : "border-muted/20 bg-card text-muted-foreground hover:border-muted/40"
                      )}
                    >
                      <role.icon className={cn("h-4 w-4", selectedRole === role.id ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[10px] font-medium tracking-tight uppercase">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                disabled={isLoading}
                className="relative h-11 w-full rounded-xl text-sm font-medium transition-transform active:scale-[0.98]"
                type="submit"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
                {!isLoading && <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />}
              </Button>
            </div>

            {apiError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-[12px] font-medium text-destructive">
                {apiError}
              </p>
            )}

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              By signing up, you agree to our
              <Link className="mx-1 font-medium text-foreground hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              and
              <Link className="mx-1 font-medium text-foreground hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>.
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center border-t border-muted/10 pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
