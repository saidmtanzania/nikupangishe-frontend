"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    FileText,
    CreditCard,
    Camera,
    Shield,
    UserCheck,
    X
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

export default function IdentityVerificationPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        idType: "",
        idNumber: "",
        idFront: null as File | null,
        idBack: null as File | null,
        selfie: null as File | null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.idType) newErrors.idType = "ID type is required"
        if (!formData.idNumber.trim()) newErrors.idNumber = "ID number is required"
        if (!formData.idFront) newErrors.idFront = "ID Front is required"
        if (!formData.idBack) newErrors.idBack = "ID Back is required"
        if (!formData.selfie) newErrors.selfie = "Selfie is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push("/onboarding/owner/profile")
        }, 1500)
    }

    const handleFileChange = (field: string, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }))
        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev }
                delete newErrs[field]
                return newErrs
            })
        }
    }

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
                    {/* Intro Section
                    <div className="mb-8 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                            <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-medium text-foreground tracking-tight">Verify your identity</h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Please provide your legal identification details.
                            </p>
                        </div>
                    </div> */}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Form Fields */}
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full legal name"
                                    className={cn(
                                        "h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all",
                                        errors.fullName && "border-destructive focus-visible:ring-destructive/20"
                                    )}
                                    value={formData.fullName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, fullName: e.target.value })
                                        if (errors.fullName) setErrors({ ...errors, fullName: "" })
                                    }}
                                />
                                {errors.fullName && <p className="text-[10px] font-medium text-destructive ml-1">{errors.fullName}</p>}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="idType" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">ID Type</Label>
                                    <Select
                                        value={formData.idType}
                                        onValueChange={(val) => {
                                            setFormData({ ...formData, idType: val })
                                            if (errors.idType) setErrors({ ...errors, idType: "" })
                                        }}
                                    >
                                        <SelectTrigger id="idType" className={cn(
                                            "h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all",
                                            errors.idType && "border-destructive focus-visible:ring-destructive/20"
                                        )}>
                                            <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nida">NIDA (National ID)</SelectItem>
                                            <SelectItem value="passport">Passport</SelectItem>
                                            <SelectItem value="driving">Driving License</SelectItem>
                                            <SelectItem value="voter">Voter ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.idType && <p className="text-[10px] font-medium text-destructive ml-1">{errors.idType}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idNumber" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">ID Number</Label>
                                    <Input
                                        id="idNumber"
                                        placeholder="Enter ID number"
                                        className={cn(
                                            "h-11 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all",
                                            errors.idNumber && "border-destructive focus-visible:ring-destructive/20"
                                        )}
                                        value={formData.idNumber}
                                        onChange={(e) => {
                                            setFormData({ ...formData, idNumber: e.target.value })
                                            if (errors.idNumber) setErrors({ ...errors, idNumber: "" })
                                        }}
                                    />
                                    {errors.idNumber && <p className="text-[10px] font-medium text-destructive ml-1">{errors.idNumber}</p>}
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
                                    file={formData.idFront}
                                    error={errors.idFront}
                                    onFileSelect={(file) => handleFileChange("idFront", file)}
                                />
                                <UploadBox
                                    icon={CreditCard}
                                    label="ID Back"
                                    info="PNG, JPG up to 5MB"
                                    file={formData.idBack}
                                    error={errors.idBack}
                                    onFileSelect={(file) => handleFileChange("idBack", file)}
                                />
                                <UploadBox
                                    icon={Camera}
                                    label="Take Selfie"
                                    info="Live capture or upload"
                                    file={formData.selfie}
                                    error={errors.selfie}
                                    onFileSelect={(file) => handleFileChange("selfie", file)}
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

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-8">
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
                    </form>
                </div>
            </div>

            {/* Bottom Support Link */}
            <div className="mt-8 text-center text-[12px] font-medium text-muted-foreground">
                Having trouble? <Link href="#" className="text-primary hover:underline transition-colors">Contact Support</Link>
            </div>
        </div>
    )
}

function UploadBox({
    icon: Icon,
    label,
    info,
    file,
    error,
    onFileSelect
}: {
    icon: any,
    label: string,
    info: string,
    file: File | null,
    error?: string,
    onFileSelect: (file: File | null) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null)
            return
        }

        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        return () => URL.revokeObjectURL(url)
    }, [file])

    const handleBoxClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        onFileSelect(selectedFile)
    }

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation()
        onFileSelect(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className="space-y-1">
            <div
                onClick={handleBoxClick}
                className={cn(
                    "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-white p-2 transition-all cursor-pointer overflow-hidden min-h-[120px]",
                    file ? "border-primary/50 bg-primary/[0.02]" : "border-muted hover:border-primary/40 hover:bg-primary/5",
                    error && "border-destructive/50 bg-destructive/[0.02]"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {previewUrl ? (
                    <div className="relative h-full w-full group/preview">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/preview:opacity-100">
                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">Change Image</p>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-destructive shadow-md hover:scale-110 active:scale-95 transition-all border border-border"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 transition-colors group-hover:bg-primary/10">
                            <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        </div>
                        <div className="text-center px-4">
                            <p className="text-[11px] font-bold text-foreground uppercase tracking-tight leading-tight">{label}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{info}</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] font-medium text-destructive text-center">{error}</p>}
        </div>
    )
}
