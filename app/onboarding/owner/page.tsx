"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    CheckCircle2,
    ArrowRight,
    Shield,
    Users,
    Zap,
    LayoutDashboard,
    ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
    {
        title: "Verified Tenants",
        description: "Review comprehensive tenant profiles and background checks.",
        icon: Shield,
        color: "bg-blue-500/10 text-blue-600",
    },
    {
        title: "Smart Management",
        description: "Handle rents, maintenance, and contracts in one place.",
        icon: LayoutDashboard,
        color: "bg-emerald-500/10 text-emerald-600",
    },
    {
        title: "Reach More People",
        description: "Your listings are showcased to thousands of verified renters.",
        icon: Users,
        color: "bg-purple-500/10 text-purple-600",
    },
    {
        title: "Fast Onboarding",
        description: "Set up your profile and list your first house in minutes.",
        icon: Zap,
        color: "bg-amber-500/10 text-amber-600",
    }
]

export default function OwnerOnboardingWelcomePage() {
    const router = useRouter()

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 lg:py-16">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Onboarding</h3>
                            <p className="text-[11px] text-muted-foreground">Step 1 of 5</p>
                        </div>
                        <span className="text-sm font-bold text-primary">20%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[20%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                    <p className="text-[12px] italic text-muted-foreground/80">
                        "Welcome to the community of premium property owners."
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Hero Section */}
                    <div className="mx-auto max-w-2xl text-center space-y-12">
                        <div className="space-y-6">
                            <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
                                Nikupangishe provides you with the professional tools you need to list, manage, and grow your rental business seamlessly.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 text-left">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-border/50 bg-card/50 transition-all hover:border-primary/20 hover:bg-primary/[0.01]">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.color}`}>
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-[12px] font-bold text-foreground uppercase tracking-tight">{feature.title}</h3>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-10 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Exit</span>
                        </button>
                        <Button
                            asChild
                            className="h-12 rounded-xl bg-primary px-12 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Link href="/onboarding/owner/details">
                                <span>Get Started</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
