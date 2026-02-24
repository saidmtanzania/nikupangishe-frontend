"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    FileText,
    CreditCard,
    Camera,
    Shield,
    X,
    UserCheck
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
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 lg:py-16">
            <div className="space-y-8 sm:space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Verify Identity</h3>
                            <p className="text-[11px] text-muted-foreground">Step 2 of 5</p>
                        </div>
                        <span className="text-sm font-bold text-primary">40%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[40%] rounded-full bg-primary transition-all duration-500" />
                    </div>
                    <p className="text-[12px] italic text-muted-foreground/80">
                        "Your security is our priority. Please provide valid documents."
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                    {/* Form Fields Section */}
                    <div className="grid gap-6 sm:gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                            <Input
                                id="fullName"
                                placeholder="Enter your full legal name"
                                className={cn(
                                    "h-12 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all rounded-xl",
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

                        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
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
                                        "h-12 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all rounded-xl",
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
                                        "h-12 border-muted/50 bg-muted/5 focus-visible:ring-primary/20 font-normal transition-all rounded-xl",
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

                        {/* Document Uploads Grid */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground ml-1">Document Attachments</Label>
                            <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                                <UploadBox
                                    icon={FileText}
                                    label="ID Front"
                                    info="PNG, JPG (5MB)"
                                    file={formData.idFront}
                                    error={errors.idFront}
                                    onFileSelect={(file) => handleFileChange("idFront", file)}
                                />
                                <UploadBox
                                    icon={CreditCard}
                                    label="ID Back"
                                    info="PNG, JPG (5MB)"
                                    file={formData.idBack}
                                    error={errors.idBack}
                                    onFileSelect={(file) => handleFileChange("idBack", file)}
                                />
                                <UploadBox
                                    icon={Camera}
                                    label="Take Selfie"
                                    info="Live Capture"
                                    file={formData.selfie}
                                    error={errors.selfie}
                                    onFileSelect={(file) => handleFileChange("selfie", file)}
                                />
                            </div>
                        </div>

                        {/* Security Privacy Notice */}
                        <div className="rounded-2xl sm:rounded-[24px] border border-primary/10 bg-primary/[0.02] p-5">
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">
                                    We protect your data with end-to-end encryption. Identification is required by Tanzanian law for real estate transactions to prevent fraud and ensure the safety of all parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-6 sm:pt-10 border-t border-border/50">
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
                            className="h-12 rounded-xl bg-primary px-8 sm:px-12 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? "Saving..." : "Save & Continue"}
                        </Button>
                    </div>
                </form>
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

    const handleBoxClick = () => fileInputRef.current?.click()

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
                    "group relative flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed bg-card p-4 transition-all cursor-pointer overflow-hidden min-h-[120px] sm:min-h-[140px]",
                    file ? "border-primary/40 bg-primary/[0.01]" : "border-muted hover:border-primary/20 hover:bg-primary/[0.01]",
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
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/preview:opacity-100">
                            <p className="text-[9px] font-bold text-white uppercase tracking-wider">Change</p>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-destructive shadow-lg hover:scale-110 transition-all border border-border"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                            <Icon className="h-6 w-6 text-primary/80 transition-colors group-hover:text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">{label}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{info}</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] font-medium text-destructive text-center">{error}</p>}
        </div>
    )
}
