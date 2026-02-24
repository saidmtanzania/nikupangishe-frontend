"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  ChevronRight,
  Shield,
  Users,
  Headphones,
  Search,
  Building2,
  Handshake,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("tenant")

  const [phoneNumber, setPhoneNumber] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const encodedPhone = encodeURIComponent(phoneNumber)
      router.push(`/auth/verify?phone=${encodedPhone}`)
    }, 1200)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-5 lg:px-8 lg:py-6 selection:bg-primary/10">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:flex-row">

        {/* Mobile-Only Top Color Accent */}
        <div className="h-1.5 w-full bg-primary md:hidden" />

        {/* Left Side: Brand Experience (Hidden on Mobile) */}
        <div className="relative hidden w-full flex-col justify-center bg-primary p-5 text-primary-foreground md:flex md:w-2/5 lg:p-6">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay grayscale"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=2070')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className="relative z-10">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <h1 className="mb-3 text-xl font-medium leading-tight text-white lg:text-2xl">Find your perfect space.</h1>
            <p className="mb-8 text-xs leading-relaxed text-white/70 lg:text-sm">
              Join Tanzania&apos;s trusted rental platform and connect with verified properties.
            </p>

            <div className="space-y-5">
              {[
                { icon: Shield, text: "Verified Listings" },
                { icon: Users, text: "Trusted Community" },
                { icon: Headphones, text: "Platform Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/5">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-normal text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 px-4 py-4 lg:p-5">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-4 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-medium text-foreground lg:text-xl">Create account</h2>
            </div>
            <p className="text-sm text-muted-foreground">Join the future of renting in Dar es Salaam.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" className="pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="john@example.com" className="pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+255 7XX XXX XXX"
                    className="pl-10 h-11 bg-muted/30 border-border focus-visible:ring-primary/20 transition-all font-normal"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
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
                className="h-11 w-full gap-2 rounded-xl text-sm font-medium transition-transform active:scale-[0.98]"
                type="submit"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
                {!isLoading && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              By signing up, you agree to our
              <Link className="mx-1 font-medium text-foreground hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
              and
              <Link className="mx-1 font-medium text-foreground hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>.
            </p>
          </form>

          {/* Mobile Login Link */}
          <div className="mt-8 text-center md:hidden">
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
