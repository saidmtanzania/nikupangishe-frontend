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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/dashboard/${selectedRole}`)
    }, 1200)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5 md:flex-row">

        {/* Left Side: Brand Experience */}
        <div className="relative flex w-full flex-col justify-center bg-primary p-10 text-primary-foreground md:w-2/5 lg:p-12">
          {/* Background Texture Overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay grayscale"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=2070')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className="relative z-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-tight lg:text-4xl">Find your perfect space.</h1>
            <p className="mb-10 text-lg leading-relaxed text-white/80">
              Join Tanzania&apos;s most trusted rental platform and connect with verified properties.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, text: "Verified Listings" },
                { icon: Users, text: "Trusted Community" },
                { icon: Headphones, text: "Platform Support" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="flex-1 px-6 py-10 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Create account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Join the future of renting in Dar es Salaam.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" className="pl-10 h-12 bg-muted/30 focus-visible:ring-primary/20 transition-all border-border" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="john@example.com" className="pl-10 h-12 bg-muted/30 focus-visible:ring-primary/20 transition-all border-border" required />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+255 7XX XXX XXX" className="pl-10 h-12 bg-muted/30 focus-visible:ring-primary/20 transition-all border-border" required />
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">I am a...</Label>
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
                        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                        selectedRole === role.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-muted/20 bg-card text-muted-foreground hover:border-muted/40"
                      )}
                    >
                      <role.icon className={cn("h-5 w-5", selectedRole === role.id ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                disabled={isLoading}
                className="h-14 w-full gap-2 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
                type="submit"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
                {!isLoading && <ChevronRight className="h-5 w-5" />}
              </Button>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              By signing up, you agree to our
              <Link className="mx-1 font-bold text-foreground hover:text-primary transition-colors underline decoration-primary/30" href="/terms">Terms of Service</Link>
              and
              <Link className="mx-1 font-bold text-foreground hover:text-primary transition-colors underline decoration-primary/30" href="/privacy">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
