"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Shield, ArrowRight, CheckCircle2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        // Simulate API call with token
        setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        }, 1500)
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:px-8 selection:bg-primary/10">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

                {/* Top Color Accent */}
                <div className="h-1.5 w-full bg-primary" />

                <div className="relative p-6 lg:p-10">
                    {!isSuccess ? (
                        <div className="flex flex-col gap-6 pt-4">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <Lock className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
                                <p className="text-sm text-muted-foreground">
                                    Create a new, strong password for your account.
                                </p>
                            </div>

                            {!token && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
                                    Warning: No security token found. This request might fail.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                                {/* New Password */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={cn(
                                                "h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                                                errors.password && "border-destructive focus-visible:ring-destructive/20"
                                            )}
                                            value={formData.password}
                                            onChange={(e) => {
                                                setFormData({ ...formData, password: e.target.value })
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

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmPassword" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={cn(
                                                "h-11 bg-muted/20 border-border focus-visible:ring-primary/20 transition-all font-normal",
                                                errors.confirmPassword && "border-destructive focus-visible:ring-destructive/20"
                                            )}
                                            value={formData.confirmPassword}
                                            onChange={(e) => {
                                                setFormData({ ...formData, confirmPassword: e.target.value })
                                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-[11px] font-medium text-destructive ml-1">{errors.confirmPassword}</p>}
                                </div>

                                <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Update Password"}
                                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 pt-12 pb-4 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 shadow-inner text-green-500">
                                <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-300" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">Password Reset!</h2>
                                <p className="text-sm text-muted-foreground px-8">
                                    Your password has been successfully updated. Redirecting you to login...
                                </p>
                            </div>
                            <div className="pt-4">
                                <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">
                                    Click here if you aren&apos;t redirected
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
