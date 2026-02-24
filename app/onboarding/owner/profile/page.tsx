"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    Building2,
    User,
    Globe,
    ArrowRight
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
            router.push("/onboarding/owner/property")
        }, 1500)
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 lg:py-10">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Owner Profile</h3>
                            <p className="text-[11px] text-muted-foreground">Step 3 of 5</p>
                        </div>
                        <span className="text-sm font-bold text-primary">60%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[60%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
                        {/* Left Column: Media & Role */}
                        <div className="space-y-8">
                            {/* Profile Photo */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative mb-4 h-24 w-24 cursor-pointer"
                                >
                                    <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-muted shadow-xl transition-all group-hover:border-primary/20">
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Profile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted/50">
                                                <User className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white transition-transform group-hover:scale-110">
                                        <Camera className="h-4 w-4" />
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <h3 className="text-[11px] font-bold uppercase tracking-tight text-foreground">Profile Photo</h3>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-[10px] font-medium text-primary hover:underline">Tap to change</button>
                            </div>

                            {/* Account Type */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole("individual")}
                                        className={cn(
                                            "flex items-center gap-3 rounded-2xl border-2 p-3 transition-all text-left",
                                            role === "individual" ? "border-primary bg-primary/[0.02]" : "border-muted/40 bg-card hover:border-muted/60"
                                        )}
                                    >
                                        <div className={cn("h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center", role === "individual" ? "border-primary" : "border-muted-foreground/30")}>
                                            {role === "individual" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <div className="min-w-0">
                                            <span className={cn("text-[10px] font-bold uppercase tracking-tight block truncate", role === "individual" ? "text-primary" : "text-muted-foreground")}>Individual</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("company")}
                                        className={cn(
                                            "flex items-center gap-3 rounded-2xl border-2 p-3 transition-all text-left",
                                            role === "company" ? "border-primary bg-primary/[0.02]" : "border-muted/40 bg-card hover:border-muted/60"
                                        )}
                                    >
                                        <div className={cn("h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center", role === "company" ? "border-primary" : "border-muted-foreground/30")}>
                                            {role === "company" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <div className="min-w-0">
                                            <span className={cn("text-[10px] font-bold uppercase tracking-tight block truncate", role === "company" ? "text-primary" : "text-muted-foreground")}>Company</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Information Form */}
                        <div className="space-y-6">
                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Company Name (Optional)</Label>
                                    <Input
                                        id="companyName"
                                        placeholder="e.g. BlueSky Properties Ltd"
                                        className="h-11 rounded-xl border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                                        <div className="relative">
                                            <Input
                                                id="phone"
                                                readOnly
                                                className="h-11 rounded-xl border-muted/50 bg-muted/5 font-normal text-muted-foreground pr-20"
                                                value={formData.phone}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-600">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span>VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">City</Label>
                                        <Select
                                            value={formData.city}
                                            onValueChange={(val) => setFormData({ ...formData, city: val })}
                                        >
                                            <SelectTrigger id="city" className="h-11 rounded-xl border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all text-xs">
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
                                    <Label htmlFor="email" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="h-11 rounded-xl border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                {/* Privacy Note */}
                                <div className="rounded-2xl border border-primary/10 bg-primary/[0.01] p-4">
                                    <div className="flex gap-4">
                                        <Globe className="h-5 w-5 shrink-0 text-primary/60" />
                                        <p className="text-[10px] leading-relaxed text-muted-foreground">
                                            Your profile information is shared with tenants only when you approve an application or message them. We keep your primary contact details private until a viewing is scheduled.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back</span>
                        </button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 rounded-xl bg-primary px-12 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? "Saving..." : "Save & Continue"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
