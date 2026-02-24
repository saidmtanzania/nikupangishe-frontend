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
                    {!isSent ? (
                        <div className="flex flex-col gap-6 pt-4">
                            <div className="mb-5">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="h-4 w-1 bg-primary rounded-full" />
                                    <h2 className="text-xl font-medium text-foreground lg:text-xl">Forgot Password?</h2>
                                </div>
                                <p className="text-sm text-muted-foreground">Enter your details and we&apos;ll send you instructions to reset your password.</p>
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

                                <Button type="submit" className="relative h-11 w-full rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Reset Password"}
                                    {!isLoading && <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4" />}
                                </Button>
                            </form>

                            {/* Bottom Back Link */}
                            <div className="mt-3 border-t border-muted/10 pt-6">
                                <Link
                                    href="/auth/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                                >
                                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    <span>Back to Log In</span>
                                </Link>
                            </div>
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

                                <Link
                                    href={`/auth/reset-password?token=demo&id=${encodeURIComponent(identifier)}`}
                                    className="flex h-11 w-full items-center justify-center rounded-xl bg-primary/5 text-sm font-semibold text-primary/80 hover:bg-primary/10 transition-colors"
                                >
                                    Simulate Email Link (Demo)
                                </Link>

                                <Link
                                    href="/auth/login"
                                    className="relative flex h-11 w-full items-center justify-center rounded-xl border border-muted/20 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                                >
                                    <ChevronLeft className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <span>Back to Log In</span>
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
