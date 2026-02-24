"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ChevronLeft,
    ArrowRight,
    Upload,
    FileText,
    CreditCard,
    Camera,
    Shield,
    Info,
    UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function IdentityVerificationPage() {
    const router = useRouter()

    return (
        <div className="mx-auto max-w-2xl px-4 py-4 lg:py-8">
            <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-lg shadow-primary/5">
                {/* Step Progress Header */}
                <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                    <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                        <span>Step 2: Verify Identity</span>
                        <span className="text-primary">2 / 5</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[40%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                </div>

                <div className="p-6 lg:p-10">
                    {/* Intro Section */}
                    <div className="mb-8 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                            <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-medium text-foreground tracking-tight">Verify your identity</h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Please provide your legal identification details as they appear on your documents.
                            </p>
                        </div>
                    </div>

                    <form className="space-y-8">
                        {/* Form Fields */}
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full legal name"
                                    className="h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="idType" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">ID Type</Label>
                                    <Select>
                                        <SelectTrigger id="idType" className="h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all">
                                            <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nida">NIDA (National ID)</SelectItem>
                                            <SelectItem value="passport">Passport</SelectItem>
                                            <SelectItem value="driving">Driving License</SelectItem>
                                            <SelectItem value="voter">Voter ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idNumber" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">ID Number</Label>
                                    <Input
                                        id="idNumber"
                                        placeholder="Enter ID number"
                                        className="h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Document Uploads</Label>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <UploadBox
                                    icon={FileText}
                                    label="ID Front"
                                    info="PNG, JPG up to 5MB"
                                />
                                <UploadBox
                                    icon={CreditCard}
                                    label="ID Back"
                                    info="PNG, JPG up to 5MB"
                                />
                                <UploadBox
                                    icon={Camera}
                                    label="Take Selfie"
                                    info="Live capture or upload"
                                />
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-4 sm:p-5">
                            <div className="flex gap-3">
                                <Shield className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                <p className="text-[11px] leading-relaxed text-muted-foreground">
                                    This verification protects <span className="font-medium text-foreground">owners and tenants</span> and prevents duplicate listings. Your data is encrypted and used only for security purposes.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-border/50 bg-muted/5 px-6 py-6 lg:px-10">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            className="h-11 rounded-xl border-border bg-white px-8 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95 transition-all"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            className="relative h-11 rounded-xl bg-primary px-10 text-sm font-medium text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 group"
                            onClick={() => router.push("/onboarding/owner/address")}
                        >
                            <span>Save & Continue</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom Support Link */}
            <div className="mt-8 text-center text-[12px] font-medium text-muted-foreground">
                Having trouble? <Link href="#" className="text-primary hover:underline">Contact Support</Link>
            </div>
        </div>
    )
}

function UploadBox({ icon: Icon, label, info }: { icon: any, label: string, info: string }) {
    return (
        <button type="button" className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-muted bg-white p-6 transition-all hover:border-primary/40 hover:bg-primary/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-primary/10">
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
            <div className="text-center">
                <p className="text-[13px] font-bold text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{info}</p>
            </div>
        </button>
    )
}
