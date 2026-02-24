"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Home,
    Plus,
    PlusCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AddFirstHousePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleContinue = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard") // or next onboarding step if exists
        }, 1000)
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 lg:py-16">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Add First House</h3>
                            <p className="text-[11px] text-muted-foreground">Step 4 of 5</p>
                        </div>
                        <span className="text-sm font-bold text-primary">80%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[80%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                    <p className="text-[12px] italic text-muted-foreground/80">
                        "Almost there! Just one more step to start your journey."
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="space-y-10 text-center">
                    {/* Dotted Upload Area */}
                    <div className="relative overflow-hidden rounded-[32px] border-2 border-dashed border-muted bg-card px-8 py-20 transition-all hover:border-primary/20 hover:bg-primary/[0.01]">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5">
                                <div className="relative">
                                    <Home className="h-10 w-10 text-primary" />
                                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white">
                                        <Plus className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-foreground">+ Add first house</h2>
                                <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
                                    Click here to start listing your first property. You'll need photos, location details, and pricing info.
                                </p>
                            </div>

                            <Button
                                className="h-12 rounded-xl bg-primary px-10 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Start Adding
                            </Button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="text-sm font-bold text-primary underline decoration-primary/30 underline-offset-8 transition-colors hover:text-primary/80"
                    >
                        Skip for now
                    </button>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-10 border-t border-border/50">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back</span>
                    </button>
                    <Button
                        onClick={handleContinue}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-primary px-12 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? "Saving..." : "Save & Continue"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
