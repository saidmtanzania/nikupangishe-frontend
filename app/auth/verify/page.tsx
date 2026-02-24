"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Smartphone, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const rawPhone = searchParams.get("phone") || ""

    const maskPhoneNumber = (phone: string) => {
        if (!phone) return "+255 ••• ••67"
        if (phone.length < 6) return phone
        const first = phone.slice(0, 4)
        const last = phone.slice(-2)
        return `${first} ••• ••${last}`
    }

    const displayPhone = maskPhoneNumber(rawPhone)

    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [code, setCode] = useState(["", "", "", ""])
    const inputs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [countdown])

    const handleResend = () => {
        if (countdown > 0 || isResending) return
        setIsResending(true)
        setTimeout(() => {
            setIsResending(false)
            setCountdown(60)
        }, 2000)
    }

    const handleInput = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1)
        }

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < 3) {
            inputs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard/tenant")
        }, 1500)
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:py-12 selection:bg-primary/10">
            <div className="flex w-full max-w-md flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-sm sm:max-w-[480px] sm:rounded-[32px]">
                {/* Top Color Accent */}
                <div className="h-1.5 w-full bg-primary" />

                <div className="relative p-6 lg:p-10">
                    <div className="flex flex-col items-center text-center pt-2">
                        {/* Phone Icon */}
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <Smartphone className="h-7 w-7 text-primary" />
                        </div>

                        <h1 className="mb-1.5 text-xl font-medium tracking-tight text-foreground lg:text-2xl">
                            Verify your number
                        </h1>

                        <div className="mb-8 text-muted-foreground">
                            <p className="text-sm">We&apos;ve sent a 4-digit verification code to</p>
                            <p className="mt-1 text-sm font-bold text-foreground">{displayPhone}</p>
                        </div>

                        <form onSubmit={handleVerify} className="w-full space-y-6 sm:space-y-8">
                            {/* OTP Input Fields */}
                            <div className="flex justify-between gap-2 sm:gap-3">
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputs.current[i] = el }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInput(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        className={cn(
                                            "h-12 w-full rounded-xl border border-slate-200 bg-white text-center text-xl font-bold transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10",
                                            digit ? "border-primary" : "border-slate-200"
                                        )}
                                    />
                                ))}
                            </div>

                            <Button
                                disabled={isLoading || code.some(d => !d)}
                                className="relative h-11 w-full rounded-xl bg-[#ef5413] text-sm font-semibold text-white transition-all hover:bg-[#ef5413]/90 active:scale-[0.98]"
                                type="submit"
                            >
                                {isLoading ? "Verifying..." : "Verify & Continue"}
                                {!isLoading && <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4" />}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-slate-500">
                                    Didn&apos;t receive the code?{" "}
                                    <button
                                        type="button"
                                        disabled={isResending || countdown > 0}
                                        onClick={handleResend}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 font-bold text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {isResending ? (
                                            <>
                                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                <span>Resending...</span>
                                            </>
                                        ) : countdown > 0 ? (
                                            <span>Resend in {countdown}s</span>
                                        ) : (
                                            "Resend Code"
                                        )}
                                    </button>
                                </p>
                            </div>

                            {/* Secure Footer */}
                            <div className="flex items-center justify-center gap-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                                <Lock className="h-3 w-3" />
                                SECURE VERIFICATION
                            </div>

                            {/* Bottom Back Link */}
                            <div className="mt-4 border-t border-muted/10 pt-6 text-left">
                                <Link
                                    href="/auth/register"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                                >
                                    <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    <span>Back to Sign Up</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#f8fbff] font-sans selection:bg-primary/10">
            <Suspense fallback={
                <div className="flex flex-1 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    )
}
