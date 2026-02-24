"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Mail, Phone, Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
    const [identifier, setIdentifier] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [error, setError] = useState("")

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    const validate = () => {
        if (!identifier.trim()) {
            setError("Please enter your email or phone number")
            return false
        }
        setError("")
        return true
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            setIsSent(true)
            setCountdown(60) // 60 seconds cooldown
        }, 1500)
    }

    const handleResend = () => {
        if (countdown > 0) return
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setCountdown(60)
        }, 1500)
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:px-8 selection:bg-primary/10">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

                {/* Top Color Accent */}
                <div className="h-1.5 w-full bg-primary" />

                <div className="relative p-6 lg:p-10">
                    {/* Back Button */}
                    <Link
                        href="/auth/login"
                        className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 lg:left-10 lg:top-10"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>

                    {!isSent ? (
                        <div className="flex flex-col gap-6 pt-8">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
                                <p className="text-sm text-muted-foreground">
                                    No worries! Enter your details and we&apos;ll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="identifier" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Email or Phone Number</Label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="identifier"
                                            type="text"
                                            placeholder="e.g. +255... or your@email.com"
                                            className={cn(
                                                "pl-10 h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                                                error && "border-destructive focus-visible:ring-destructive/20"
                                            )}
                                            value={identifier}
                                            onChange={(e) => {
                                                setIdentifier(e.target.value)
                                                if (error) setError("")
                                            }}
                                        />
                                    </div>
                                    {error && <p className="text-[11px] font-medium text-destructive ml-1">{error}</p>}
                                </div>

                                <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Reset Password"}
                                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 pt-12 pb-4 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 shadow-inner">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
                                <p className="text-sm text-muted-foreground px-4">
                                    We&apos;ve sent reset instructions to <span className="font-semibold text-foreground">{identifier}</span>
                                </p>
                            </div>

                            <div className="flex flex-col w-full gap-4 pt-4">
                                <Button
                                    onClick={handleResend}
                                    disabled={countdown > 0 || isLoading}
                                    variant="outline"
                                    className="h-11 rounded-xl text-sm font-semibold"
                                >
                                    {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive it? Resend"}
                                </Button>

                                <Link href={`/auth/reset-password?token=demo&id=${encodeURIComponent(identifier)}`} className="text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
                                    Simulate Email Link (Demo)
                                </Link>

                                <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    Back to Log In
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
