"use client"

import Link from "next/link"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#f8fbff]">
            {/* Onboarding Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-sm font-bold text-primary-foreground">N</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">
                            Nikupangishe
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            {/* Simplified Footer */}
            <footer className="py-10 text-center">
                <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        SECURE PLATFORM
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-70">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        PREMIUM SERVICE
                    </div>
                </div>
                <p className="mt-6 text-[11px] text-muted-foreground/40">
                    © 2026 Nikupangishe Inc. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
