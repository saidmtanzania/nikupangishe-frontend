"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    Camera,
    CheckCircle2,
    Building2,
    User,
    ChevronDown,
    Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function OwnerProfileOnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [role, setRole] = useState<"individual" | "company">("individual")
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        companyName: "",
        phone: "+255 712 345 678",
        email: "john.owner@example.com",
        city: "Dar es Salaam"
    })

    useEffect(() => {
        if (!profilePhoto) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(profilePhoto)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [profilePhoto])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push("/onboarding/owner/property") // Next logical step
        }, 1500)
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-4 lg:py-8">
            <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-lg shadow-primary/5">
                {/* Step Progress Header */}
                <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                        <span>Step 3: Owner Profile</span>
                        <span className="text-primary">3 / 5</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[60%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                        Almost there! Complete your profile to build trust with tenants.
                    </p>
                </div>

                <div className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
                            {/* Left Side: Photo & Role */}
                            <div className="space-y-6 lg:pr-8">
                                {/* Profile Photo Section */}
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative mb-3 h-20 w-20 cursor-pointer"
                                    >
                                        <div className="h-full w-full overflow-hidden rounded-full border-2 border-border bg-muted transition-all group-hover:border-primary/50">
                                            {previewUrl ? (
                                                <Image
                                                    src={previewUrl}
                                                    alt="Profile Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <User className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white transition-transform group-hover:scale-110">
                                            <Camera className="h-3 w-3" />
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                                        />
                                    </div>
                                    <h3 className="text-[11px] font-bold uppercase tracking-tight">Profile Photo</h3>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-[10px] font-medium text-primary hover:underline mt-1"
                                    >
                                        Tap to change photo
                                    </button>
                                </div>

                                {/* Role Selector */}
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                        Account Type
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRole("individual")}
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all",
                                                role === "individual"
                                                    ? "border-primary bg-primary/[0.02]"
                                                    : "border-border bg-card hover:border-muted hover:bg-muted/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                                                role === "individual" ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                                            )}>
                                                <div className={cn("h-1.5 w-1.5 rounded-full bg-white", role === "individual" ? "block" : "hidden")} />
                                            </div>
                                            <span className={cn("text-[10px] font-bold uppercase tracking-tight", role === "individual" ? "text-primary" : "text-muted-foreground")}>Individual</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("company")}
                                            className={cn(
                                                "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all",
                                                role === "company"
                                                    ? "border-primary bg-primary/[0.02]"
                                                    : "border-border bg-card hover:border-muted hover:bg-muted/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                                                role === "company" ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                                            )}>
                                                <div className={cn("h-1.5 w-1.5 rounded-full bg-white", role === "company" ? "block" : "hidden")} />
                                            </div>
                                            <span className={cn("text-[10px] font-bold uppercase tracking-tight", role === "company" ? "text-primary" : "text-muted-foreground")}>Company</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Contact Fields */}
                            <div className="grid gap-5 content-start">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                        Company Name (Optional)
                                    </Label>
                                    <Input
                                        id="companyName"
                                        placeholder="e.g. BlueSky Properties Ltd"
                                        className="h-10 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                readOnly
                                                className="h-10 border-muted/50 bg-muted/5 font-normal text-muted-foreground pr-20"
                                                value={formData.phone}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
                                                <CheckCircle2 className="h-2.5 w-2.5" />
                                                <span>VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                            City
                                        </Label>
                                        <Select
                                            value={formData.city}
                                            onValueChange={(val) => setFormData({ ...formData, city: val })}
                                        >
                                            <SelectTrigger id="city" className="h-10 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all">
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                                                <SelectItem value="Mwanza">Mwanza</SelectItem>
                                                <SelectItem value="Arusha">Arusha</SelectItem>
                                                <SelectItem value="Dodoma">Dodoma</SelectItem>
                                                <SelectItem value="Zanzibar">Zanzibar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-10 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {/* Security Notice */}
                                <div className="mt-2 rounded-xl border border-primary/10 bg-primary/[0.02] p-3">
                                    <div className="flex gap-2.5">
                                        <Globe className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                                        <p className="text-[10px] leading-relaxed text-muted-foreground">
                                            Your primary contact details are used to coordinate property visits and key handovers. We never share your email publicly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="border-t border-border/50 bg-muted/5 px-6 py-6 lg:px-10">
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-xl border-border bg-white px-8 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95 transition-all"
                                    onClick={() => router.back()}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative h-11 rounded-xl bg-primary px-10 text-sm font-medium text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 group"
                                >
                                    {isLoading ? "Saving..." : (
                                        <>
                                            <span>Save & Continue</span>
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
