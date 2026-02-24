"use client"

import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    ShieldCheck,
    Star,
    Clock,
    ArrowRight,
    Circle,
    UserCircle2,
    Home,
    ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function OnboardingCompletionPage() {
    const router = useRouter()

    const summaryItems = [
        {
            label: "Identity submitted",
            status: "Verified",
            done: true,
            icon: ShieldCheck
        },
        {
            label: "Profile created",
            status: "Completed",
            done: true,
            icon: UserCircle2
        },
        {
            label: "First house (optional)",
            status: "Skip for now",
            done: false,
            icon: Home
        }
    ]

    return (
        <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6 lg:py-10">
            <div className="space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Step 5: Completion</h3>
                        </div>
                        <span className="text-sm font-bold text-primary">100%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-full rounded-full bg-primary" />
                    </div>
                </div>

                {/* Main Content Area - Open Layout */}
                <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 py-0 sm:py-2">
                    {/* Hero Illustration */}
                    <div className="relative">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner ring-1 ring-emerald-100">
                            <ShieldCheck className="h-12 w-12" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white">
                            <Star className="h-3.5 w-3.5 fill-current" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">Owner setup almost complete</h1>
                        <p className="mx-auto max-w-lg text-sm text-muted-foreground leading-relaxed">
                            Your profile is currently being processed by our verification team. We usually finish in under 24 hours.
                        </p>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 border border-amber-200/50 shadow-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Verification Under Review</span>
                    </div>

                    {/* Summary Section - Centered or contained width */}
                    <div className="w-full max-w-lg space-y-6 pt-2">
                        <div className="flex items-center justify-between border-b border-border/50 pb-3">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Onboarding Summary</h2>
                        </div>
                        <div className="space-y-4">
                            {summaryItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                                            item.done ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground/40"
                                        )}>
                                            {item.done ? (
                                                <CheckCircle2 className="h-4.5 w-4.5" />
                                            ) : (
                                                <Circle className="h-4.5 w-4.5" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-tight",
                                                item.done ? "text-foreground" : "text-muted-foreground/60"
                                            )}>{item.label}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-medium italic",
                                        item.done ? "text-emerald-600" : "text-muted-foreground/40"
                                    )}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Standard Footer Actions */}
                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border/50">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back</span>
                    </button>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="h-12 rounded-xl bg-primary px-6 sm:px-12 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                        <span>Go to Owner Dashboard</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </Button>
                </div>
            </div>

            {/* Global Footer Copyright */}
            <p className="mt-6 sm:mt-12 text-center text-[10px] text-muted-foreground/40 tracking-tight">
                © 2024 Nikupangishe. All rights reserved. Professional Property Management Simplified.
            </p>
        </div>
    )
}
