"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, Mail, Eye, EyeOff, Shield } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/tenant")
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
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your Nikupangishe account
        </p>
      </div>

      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phone">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                  +255
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="7XX XXX XXX"
                  className="flex-1"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone-password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="phone-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="email">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="email-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5 text-primary" />
        <span>Your data is encrypted and secure</span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  )
}
