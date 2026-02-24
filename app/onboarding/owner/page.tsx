"use client"

import Link from "next/link"
import { Shield, Users, Home, Settings, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function OwnerOnboardingWelcomePage() {
    const features = [
        {
            icon: Shield,
            title: "Verified Houses",
            description: "All property listings must pass our physical verification standards.",
            iconColor: "text-orange-500",
            bgColor: "bg-orange-50",
        },
        {
            icon: Settings,
            title: "Owner Control",
            description: "You maintain full authority over your property management dashboard.",
            iconColor: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            icon: Users,
            title: "Agent Hierarchy",
            description: "Agents work specifically under owner-defined guidelines and tasks.",
            iconColor: "text-orange-600",
            bgColor: "bg-orange-100/50",
        },
        {
            icon: Home,
            title: "One House Listing",
            description: "Single listing per physical property for data integrity and clarity.",
            iconColor: "text-[#ef5413]",
            bgColor: "bg-[#ef5413]/5",
        },
    ]

    return (
        <div className="mx-auto max-w-2xl px-4 py-4 lg:py-8">
            <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-lg shadow-primary/5">
                {/* Step Progress Header */}
                <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                    <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                        <span>Step 1: Welcome</span>
                        <span className="text-primary">1 / 5</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[20%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    {/* Hero Content */}
                    <div className="flex flex-col items-center text-center">
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                            Welcome, Owner
                        </h1>
                        <p className="mb-8 max-w-md text-balance text-[13px] text-muted-foreground leading-relaxed">
                            Let&apos;s set up your profile and properties on Tanzania&apos;s most trusted rental platform.
                        </p>

                        {/* Feature Grid */}
                        <div className="grid w-full gap-3 sm:grid-cols-2 mb-8">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 rounded-xl border border-border/40 bg-muted/5 p-4 text-left transition-all hover:bg-muted/10"
                                >
                                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", feature.bgColor)}>
                                        <feature.icon className={cn("h-4 w-4", feature.iconColor)} />
                                    </div>
                                    <div>
                                        <h3 className="mb-0.5 text-[13px] font-bold text-foreground">{feature.title}</h3>
                                        <p className="text-[11px] leading-snug text-muted-foreground line-clamp-2">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Action Component */}
                        <div className="relative w-full max-w-[280px]">
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-primary/10 opacity-40 blur-lg" />
                            <Button
                                asChild
                                className="relative h-12 w-full rounded-xl bg-primary text-sm font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98] group"
                            >
                                <Link href="/onboarding/owner/details">
                                    <span>Get Started</span>
                                    <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                            <span>Need help?</span>
                            <Link href="#" className="flex items-center gap-1 text-primary hover:underline">
                                <MessageCircle className="h-3 w-3" />
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
