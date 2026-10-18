"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import dynamic from "next/dynamic"
import {
    Check,
    Upload,
    Trash2,
    Loader2,
    MapPin,
    Pencil,
    Star,
    ChevronLeft,
    ChevronRight,
    FileText,
    Sparkles,
    Camera,
    ClipboardCheck,
    Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { propertiesApi } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import {
    type WizardStep,
    WizardHeader,
    WizardStepper,
    WizardFooter,
    StepHeading,
    SideTip,
    ReviewSection,
    ReviewItem,
    ReviewTag,
    fieldLabel,
    inputClass,
    selectTriggerClass,
    textareaClass,
    groupHeading,
} from "@/components/dashboard/listing-wizard"

const LocationPickerMap = dynamic(
    () => import("@/components/properties/location-picker-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-slate-100 dark:bg-slate-800/30 rounded-lg flex flex-col items-center justify-center gap-2 animate-pulse">
                <MapPin className="size-5 text-slate-300" />
                <span className="text-xs font-medium text-slate-400">Loading map…</span>
            </div>
        ),
    }
)

const steps: WizardStep[] = [
    { id: 1, name: "Basic Details", description: "Type, size & rent", icon: FileText },
    { id: 2, name: "Location", description: "Address & map pin", icon: MapPin },
    { id: 3, name: "Features", description: "Utilities & rules", icon: Sparkles },
    { id: 4, name: "Media", description: "Photos & video", icon: Camera },
    { id: 5, name: "Review", description: "Confirm & save", icon: ClipboardCheck },
]

const houseTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "studio", label: "Studio" },
    { value: "room", label: "Room" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "standalone", label: "Standalone" },
    { value: "single-room", label: "Single Room" },
    { value: "commercial", label: "Commercial" },
]

const furnishingOptions = [
    { value: "furnished", label: "Furnished" },
    { value: "semi_furnished", label: "Semi-Furnished" },
    { value: "unfurnished", label: "Unfurnished" },
]

const amenityOptions = [
    "Parking", "Security", "Water Supply", "Balcony", "Swimming Pool",
    "Air Conditioning", "Wi-Fi", "Gym", "Elevator", "Generator", "Laundry", "Rooftop",
]

const ruleOptions = [
    "No smoking", "No pets", "No loud music after 10pm",
    "Visitors must register", "No subletting", "Maintain cleanliness",
]

interface HouseForm {
    title: string
    description: string
    houseType: string
    propertyType: string
    furnishingStatus: string
    address: string
    area: string
    city: string
    latitude: string
    longitude: string
    rentAmount: string
    currency: string
    depositMonths: string
    bedrooms: string
    bathrooms: string
    squareMeters: string
    parkingSpaces: string
    hasWater: boolean
    hasElectricity: boolean
    hasInternet: boolean
    hasGarden: boolean
    hasSecurityGuard: boolean
    hasCCTV: boolean
    petFriendly: boolean
    availableFrom: string
    minimumLeaseDuration: string
    amenities: string[]
    rules: string[]
    isUnique: boolean
    isOpenToExchange: boolean
    verificationVideoUrl: string
    ownerVerificationNote: string
}

const defaultForm: HouseForm = {
    title: "", description: "", houseType: "apartment", propertyType: "apartment",
    furnishingStatus: "unfurnished", address: "", area: "", city: "Dar es Salaam",
    latitude: "", longitude: "", rentAmount: "", currency: "TZS", depositMonths: "2",
    bedrooms: "1", bathrooms: "1", squareMeters: "", parkingSpaces: "0",
    hasWater: false, hasElectricity: false, hasInternet: false, hasGarden: false,
    hasSecurityGuard: false, hasCCTV: false, petFriendly: false,
    availableFrom: "", minimumLeaseDuration: "", amenities: [], rules: [],
    isUnique: false, isOpenToExchange: false,
    verificationVideoUrl: "", ownerVerificationNote: "",
}

export default function EditHousePage() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { token } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [form, setForm] = useState<HouseForm>(defaultForm)
    const [loadingHouse, setLoadingHouse] = useState(true)
    // Existing images from backend (URLs)
    const [existingImages, setExistingImages] = useState<string[]>([])
    // Track original order to detect if reorder API call is needed
    const [originalImages, setOriginalImages] = useState<string[]>([])
    // New files selected by user
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [ruleInput, setRuleInput] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Load existing house data
    useEffect(() => {
        if (!token || !id) return
        setLoadingHouse(true)
        propertiesApi.get(id, token)
            .then((house) => {
                setForm({
                    title: house.title ?? "",
                    description: house.description ?? "",
                    houseType: house.houseType ?? "apartment",
                    propertyType: house.propertyType ?? house.houseType ?? "apartment",
                    furnishingStatus: house.furnishingStatus ?? "unfurnished",
                    address: house.address ?? "",
                    area: house.area ?? "",
                    city: house.city ?? "Dar es Salaam",
                    latitude: house.latitude ? String(house.latitude) : "",
                    longitude: house.longitude ? String(house.longitude) : "",
                    rentAmount: String(house.rentAmount ?? house.price ?? ""),
                    currency: house.currency ?? "TZS",
                    depositMonths: String(house.depositMonths ?? 2),
                    bedrooms: String(house.bedrooms ?? 1),
                    bathrooms: String(house.bathrooms ?? 1),
                    squareMeters: house.squareMeters ? String(house.squareMeters) : "",
                    parkingSpaces: "0",
                    hasWater: house.hasWater ?? false,
                    hasElectricity: house.hasElectricity ?? false,
                    hasInternet: house.hasInternet ?? false,
                    hasGarden: house.hasGarden ?? false,
                    hasSecurityGuard: house.hasSecurityGuard ?? false,
                    hasCCTV: house.hasCCTV ?? false,
                    petFriendly: house.petFriendly ?? false,
                    availableFrom: house.availableFrom
                        ? String(house.availableFrom).split("T")[0]
                        : "",
                    minimumLeaseDuration: "",
                    amenities: house.amenities ?? [],
                    rules: [],
                    isUnique: house.isUnique ?? false,
                    isOpenToExchange: house.isOpenToExchange ?? false,
                    verificationVideoUrl: house.verificationVideoUrl ?? "",
                    ownerVerificationNote: house.ownerVerificationNote ?? "",
                })
                const imgs = house.images ?? []
                setExistingImages(imgs)
                setOriginalImages(imgs)
            })
            .catch(() => setError("Failed to load house details."))
            .finally(() => setLoadingHouse(false))
    }, [token, id])

    const set = <K extends keyof HouseForm>(key: K, value: HouseForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }))

    const toggleAmenity = (a: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(a)
                ? prev.amenities.filter((x) => x !== a)
                : [...prev.amenities, a],
        }))
    }

    const addRule = () => {
        const r = ruleInput.trim()
        if (r && !form.rules.includes(r)) {
            set("rules", [...form.rules, r])
            setRuleInput("")
        }
    }
    const removeRule = (r: string) => set("rules", form.rules.filter((x) => x !== r))

    const nextStep = () => setCurrentStep((p) => Math.min(p + 1, steps.length))
    const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1))

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            setNewImageFiles((prev) => [...prev, ...newFiles])
            setNewImagePreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))])
        }
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index])
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index))
    }

    // Move image at `index` to position 0 (makes it the cover)
    const setCoverImage = (index: number) => {
        if (index === 0) return
        setExistingImages((prev) => {
            const next = [...prev]
            const [picked] = next.splice(index, 1)
            next.unshift(picked)
            return next
        })
    }

    // Swap image at `index` with the one to its left or right
    const swapImage = (index: number, direction: "left" | "right") => {
        setExistingImages((prev) => {
            const next = [...prev]
            const target = direction === "left" ? index - 1 : index + 1
            if (target < 0 || target >= next.length) return prev
            ;[next[index], next[target]] = [next[target], next[index]]
            return next
        })
    }

    const handleSubmit = async () => {
        if (!token) { setError("You must be logged in."); return }
        if (!form.title.trim()) { setError("Property title is required."); setCurrentStep(1); return }
        if (!form.description.trim()) { setError("Description is required."); setCurrentStep(1); return }
        if (!form.rentAmount || Number(form.rentAmount) <= 0) { setError("Monthly rent must be greater than 0."); setCurrentStep(1); return }

        setSubmitting(true)
        setError("")
        try {
            const payload: Record<string, unknown> = {
                title: form.title,
                description: form.description,
                houseType: form.houseType,
                propertyType: form.houseType,
                furnishingStatus: form.furnishingStatus,
                address: form.address || undefined,
                area: form.area || undefined,
                city: form.city,
                latitude: form.latitude ? parseFloat(form.latitude) : undefined,
                longitude: form.longitude ? parseFloat(form.longitude) : undefined,
                rentAmount: Number(form.rentAmount),
                price: Number(form.rentAmount),
                currency: form.currency,
                depositMonths: Number(form.depositMonths) || 0,
                bedrooms: Number(form.bedrooms) || 0,
                bathrooms: Number(form.bathrooms) || 0,
                squareMeters: Number(form.squareMeters) || 0,
                parkingSpaces: Number(form.parkingSpaces) || 0,
                hasWater: form.hasWater,
                hasElectricity: form.hasElectricity,
                hasInternet: form.hasInternet,
                hasGarden: form.hasGarden,
                hasSecurityGuard: form.hasSecurityGuard,
                hasCCTV: form.hasCCTV,
                petFriendly: form.petFriendly,
                availableFrom: form.availableFrom ? new Date(form.availableFrom).toISOString() : undefined,
                minimumLeaseDuration: Number(form.minimumLeaseDuration) || 0,
                amenities: form.amenities,
                rules: form.rules,
                isUnique: form.isUnique,
                isOpenToExchange: form.isOpenToExchange,
                verificationVideoUrl: form.verificationVideoUrl || undefined,
                ownerVerificationNote: form.ownerVerificationNote || undefined,
                location:
                    form.latitude && form.longitude
                        ? { lat: parseFloat(form.latitude), lng: parseFloat(form.longitude), neighborhood: form.area, city: form.city }
                        : undefined,
            }
            Object.keys(payload).forEach((k) => { if (payload[k] === undefined) delete payload[k] })

            await propertiesApi.updateHouse(id, payload, token)

            // Reorder photos if the cover (or order) changed
            const orderChanged =
                existingImages.length !== originalImages.length ||
                existingImages.some((url, i) => url !== originalImages[i])
            if (orderChanged && existingImages.length > 0) {
                try {
                    await propertiesApi.reorderPhotos(id, existingImages, token)
                } catch {
                    // Non-blocking
                }
            }

            // Upload any new photos
            if (newImageFiles.length > 0) {
                try {
                    await propertiesApi.uploadPhotos(id, newImageFiles, token)
                } catch {
                    // Non-blocking — house was updated successfully
                }
            }

            router.push("/dashboard/owner/houses")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save changes")
        } finally {
            setSubmitting(false)
        }
    }

    if (loadingHouse) {
        return (
            <div className="flex h-full items-center justify-center py-32">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading house…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-8 py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <WizardHeader icon={Pencil} title="Edit Listing" subtitle={form.title || "Update your property details"} />
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                    {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% complete
                </span>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Card Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <WizardStepper steps={steps} current={currentStep} onStepClick={setCurrentStep} />

                <div className="flex flex-col divide-slate-100 lg:flex-row lg:divide-x dark:divide-slate-800">
                    {/* Form Side */}
                    <div key={currentStep} className="min-w-0 flex-1 space-y-8 p-6 animate-in fade-in slide-in-from-right-4 duration-300 sm:p-10">

                        {/* ─── STEP 1: Basic Details ──────────────────── */}
                        {currentStep === 1 && (
                            <>
                                <StepHeading icon={FileText} title="House Details" description="The essentials tenants look at first: type, size and rent." />
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label className={fieldLabel}>Property Title *</Label>
                                        <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Spacious 2BR Apartment in Masaki" className={inputClass} />
                                    </div>
                                    <div className="grid gap-6 grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>House Type</Label>
                                            <Select value={form.houseType} onValueChange={(v) => { set("houseType", v); set("propertyType", v) }}>
                                                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                                <SelectContent>{houseTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Bedrooms</Label>
                                            <Input type="number" min={0} value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Bathrooms</Label>
                                            <Input type="number" min={0} value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="grid gap-6 grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Furnishing</Label>
                                            <Select value={form.furnishingStatus} onValueChange={(v) => set("furnishingStatus", v)}>
                                                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                                <SelectContent>{furnishingOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Square Meters</Label>
                                            <Input type="number" min={0} value={form.squareMeters} onChange={(e) => set("squareMeters", e.target.value)} placeholder="0" className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Parking Spaces</Label>
                                            <Input type="number" min={0} value={form.parkingSpaces} onChange={(e) => set("parkingSpaces", e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="grid gap-6 grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Monthly Rent *</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">{form.currency}</span>
                                                <Input type="number" min={0} value={form.rentAmount} onChange={(e) => set("rentAmount", e.target.value)} placeholder="0" className={cn(inputClass, "pl-12")} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Deposit (months)</Label>
                                            <Input type="number" min={0} value={form.depositMonths} onChange={(e) => set("depositMonths", e.target.value)} className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Currency</Label>
                                            <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                                                <SelectTrigger className={selectTriggerClass}><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TZS">TZS</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={fieldLabel}>Available From</Label>
                                        <Input type="date" value={form.availableFrom} onChange={(e) => set("availableFrom", e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={fieldLabel}>Description *</Label>
                                        <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the property highlights, nearby landmarks, etc." className={textareaClass} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ─── STEP 2: Location ──────────────────────── */}
                        {currentStep === 2 && (
                            <>
                                <StepHeading icon={MapPin} title="Property Location" description="Pin the exact spot so tenants can find it on the map." />
                                <div className="grid gap-6">
                                    <div className="grid gap-6 grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>City</Label>
                                            <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Dar es Salaam" className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Neighborhood / Area</Label>
                                            <Input value={form.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Masaki" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={fieldLabel}>Street Address</Label>
                                        <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="e.g. Plot 45, Haile Selassie Road" className={inputClass} />
                                    </div>
                                    <div className="grid gap-6 grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Latitude</Label>
                                            <Input type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="-6.7734" className={inputClass} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Longitude</Label>
                                            <Input type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="39.2687" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className={fieldLabel}>Pin on Map</Label>
                                        <p className="text-xs text-slate-400">Click anywhere on the map to update the property location</p>
                                    </div>
                                    <div className="relative z-0 h-80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                        <LocationPickerMap
                                            lat={form.latitude ? parseFloat(form.latitude) : null}
                                            lng={form.longitude ? parseFloat(form.longitude) : null}
                                            onSelect={(lat, lng) => { set("latitude", String(lat)); set("longitude", String(lng)) }}
                                            onLocationFound={({ address, city, area }) => {
                                                if (address) set("address", address)
                                                if (area) set("area", area)
                                                if (city) set("city", city)
                                            }}
                                        />
                                        {form.latitude && form.longitude && (
                                            <div className="absolute bottom-3 left-3 z-7 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-md px-3 py-1.5 shadow-sm border border-slate-100 dark:border-slate-700">
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 font-mono">
                                                    {parseFloat(form.latitude).toFixed(6)}, {parseFloat(form.longitude).toFixed(6)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ─── STEP 3: Features & Amenities ──────────── */}
                        {currentStep === 3 && (
                            <>
                                <StepHeading icon={Sparkles} title="Features & Amenities" description="Utilities, amenities, listing options and house rules." />
                                <div className="space-y-4">
                                    <h4 className={groupHeading}>Utilities & Features</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(
                                            [
                                                ["hasWater", "Water Supply"],
                                                ["hasElectricity", "Electricity"],
                                                ["hasInternet", "Internet / Wi-Fi"],
                                                ["hasGarden", "Garden"],
                                                ["hasSecurityGuard", "Security Guard"],
                                                ["hasCCTV", "CCTV"],
                                                ["petFriendly", "Pet Friendly"],
                                            ] as [keyof HouseForm, string][]
                                        ).map(([key, label]) => (
                                            <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/30 dark:border-slate-700 dark:bg-slate-900">
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
                                                <Switch checked={form[key] as boolean} onCheckedChange={(v) => set(key, v as HouseForm[typeof key])} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className={groupHeading}>Amenities</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {amenityOptions.map((a) => (
                                            <label key={a} className={cn("flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all hover:border-primary/40", form.amenities.includes(a) ? "bg-primary/5 border-primary/30" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700")} onClick={() => toggleAmenity(a)}>
                                                <div className={cn("size-5 rounded-md border-2 flex items-center justify-center transition-colors", form.amenities.includes(a) ? "bg-primary border-primary" : "border-slate-200 dark:border-slate-700")}>
                                                    {form.amenities.includes(a) && <Check className="size-2.5 text-white" strokeWidth={3} />}
                                                </div>
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{a}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className={groupHeading}>Listing Options</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/30 dark:border-slate-700 dark:bg-slate-900">
                                            <div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 block">Open To Exchange</span>
                                                <span className="text-xs text-slate-400">Allow tenants to request swaps</span>
                                            </div>
                                            <Switch checked={form.isOpenToExchange} onCheckedChange={(v) => set("isOpenToExchange", v)} />
                                        </div>
                                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-primary/30 dark:border-slate-700 dark:bg-slate-900">
                                            <div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 block">Unique Property</span>
                                                <span className="text-xs text-slate-400">Feature as a unique listing</span>
                                            </div>
                                            <Switch checked={form.isUnique} onCheckedChange={(v) => set("isUnique", v)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className={groupHeading}>House Rules</h4>
                                    <div className="flex gap-2">
                                        <Input value={ruleInput} onChange={(e) => setRuleInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRule() } }} placeholder="Type a rule and press Enter" className={inputClass} />
                                        <Button type="button" variant="outline" onClick={addRule} className="h-11 rounded-xl px-5 shadow-none">Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ruleOptions.filter((r) => !form.rules.includes(r)).map((r) => (
                                            <button key={r} onClick={() => set("rules", [...form.rules, r])} className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700">+ {r}</button>
                                        ))}
                                    </div>
                                    {form.rules.length > 0 && (
                                        <div className="space-y-1.5">
                                            {form.rules.map((r) => (
                                                <div key={r} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/30">
                                                    <span className="text-sm text-slate-700 dark:text-slate-200">{r}</span>
                                                    <button onClick={() => removeRule(r)} className="text-slate-400 hover:text-red-500"><Trash2 className="size-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ─── STEP 4: Media ─────────────────────────── */}
                        {currentStep === 4 && (
                            <>
                                <StepHeading icon={Camera} title="Photos & Media" description="Manage existing photos, add new ones and set the cover." />
                                <div className="space-y-6">
                                    {/* Existing photos */}
                                    {existingImages.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className={groupHeading}>Current Photos</h4>
                                            <div className="grid grid-cols-4 gap-4">
                                                {existingImages.map((url, index) => (
                                                    <div key={url} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                        <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                                                        {/* Trash */}
                                                        <button onClick={() => removeExistingImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500">
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                        {/* Swap left / right arrows */}
                                                        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {index > 0 && (
                                                                <button
                                                                    onClick={() => swapImage(index, "left")}
                                                                    className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500"
                                                                    title="Move left"
                                                                >
                                                                    <ChevronLeft className="size-3.5" />
                                                                </button>
                                                            )}
                                                            {index < existingImages.length - 1 && (
                                                                <button
                                                                    onClick={() => swapImage(index, "right")}
                                                                    className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500"
                                                                    title="Move right"
                                                                >
                                                                    <ChevronRight className="size-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        {/* Cover badge / Set-as-cover button */}
                                                        {index === 0 ? (
                                                            <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded">
                                                                <Star className="size-2 fill-white" /> Cover
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => setCoverImage(index)}
                                                                className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                                                            >
                                                                <Star className="size-2" /> Set Cover
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload new photos */}
                                    <div className="space-y-3">
                                        <h4 className={groupHeading}>Add New Photos</h4>
                                        <div onClick={() => fileInputRef.current?.click()} className="h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/20 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5">
                                            <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} />
                                            <div className="size-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                                                <Upload className="size-5 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload photos</p>
                                                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — max 10 MB per file</p>
                                            </div>
                                        </div>
                                        {newImagePreviews.length > 0 && (
                                            <div className="grid grid-cols-4 gap-4">
                                                {newImagePreviews.map((url, index) => (
                                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                        <img src={url} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                                        <button onClick={() => removeNewImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500">
                                                            <Trash2 className="size-3.5" />
                                                        </button>
                                                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded">New</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                    {/* Verification evidence for admin */}
                                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <h4 className={groupHeading}>Verification Evidence</h4>
                                            <p className="text-xs text-slate-400 mt-1">Help the admin verify your property — optional but speeds up getting the Verified badge</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Verification Video URL</Label>
                                            <Input
                                                value={form.verificationVideoUrl}
                                                onChange={(e) => set("verificationVideoUrl", e.target.value)}
                                                placeholder="https://youtube.com/... or Google Drive link"
                                                className={inputClass}
                                            />
                                            <p className="text-xs text-slate-400">Walk-through video of the property — YouTube, Google Drive, or any public link</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={fieldLabel}>Note to Admin</Label>
                                            <Textarea
                                                value={form.ownerVerificationNote}
                                                onChange={(e) => set("ownerVerificationNote", e.target.value)}
                                                placeholder="Describe ownership proof, any supporting information, or special notes for the reviewer..."
                                                className={textareaClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {currentStep === 5 && (
                            <>
                                <StepHeading icon={ClipboardCheck} title="Review Changes" description="Double-check everything before saving." />
                                <div className="space-y-4">
                                    <ReviewSection title="Basic Details">
                                        <ReviewItem label="Title" value={form.title || "—"} />
                                        <ReviewItem label="Type" value={form.houseType} />
                                        <ReviewItem label="Furnishing" value={form.furnishingStatus} />
                                        <ReviewItem label="Bedrooms / Bathrooms" value={`${form.bedrooms} bed / ${form.bathrooms} bath`} />
                                        <ReviewItem label="Rent" value={`${form.currency} ${Number(form.rentAmount || 0).toLocaleString()}/mo`} />
                                        <ReviewItem label="Deposit" value={`${form.depositMonths} month(s)`} />
                                        <ReviewItem label="Size" value={form.squareMeters ? `${form.squareMeters} m²` : "—"} />
                                        <ReviewItem label="Parking" value={`${form.parkingSpaces} spaces`} />
                                    </ReviewSection>
                                    <ReviewSection title="Location">
                                        <ReviewItem label="City" value={form.city} />
                                        <ReviewItem label="Area" value={form.area || "—"} />
                                        <ReviewItem label="Address" value={form.address || "—"} />
                                        <ReviewItem label="GPS" value={form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "—"} />
                                    </ReviewSection>
                                    <ReviewSection title="Features">
                                        <div className="flex flex-wrap gap-2">
                                            {form.hasWater && <ReviewTag>Water</ReviewTag>}
                                            {form.hasElectricity && <ReviewTag>Electricity</ReviewTag>}
                                            {form.hasInternet && <ReviewTag>Internet</ReviewTag>}
                                            {form.hasGarden && <ReviewTag>Garden</ReviewTag>}
                                            {form.hasSecurityGuard && <ReviewTag>Security Guard</ReviewTag>}
                                            {form.hasCCTV && <ReviewTag>CCTV</ReviewTag>}
                                            {form.petFriendly && <ReviewTag>Pet Friendly</ReviewTag>}
                                            {form.isOpenToExchange && <ReviewTag>Open To Exchange</ReviewTag>}
                                            {form.isUnique && <ReviewTag>Unique</ReviewTag>}
                                        </div>
                                    </ReviewSection>
                                    {form.amenities.length > 0 && (
                                        <ReviewSection title="Amenities">
                                            <div className="flex flex-wrap gap-2">{form.amenities.map((a) => <ReviewTag key={a}>{a}</ReviewTag>)}</div>
                                        </ReviewSection>
                                    )}
                                    <ReviewSection title={`Photos (${existingImages.length} existing + ${newImagePreviews.length} new)`}>
                                        {existingImages.length === 0 && newImagePreviews.length === 0
                                            ? <p className="text-sm text-slate-400">No photos.</p>
                                            : <div className="grid grid-cols-6 gap-2">
                                                {existingImages.map((url, i) => <div key={`e-${i}`} className="aspect-square rounded-lg overflow-hidden border border-slate-100"><img src={url} alt="" className="w-full h-full object-cover" /></div>)}
                                                {newImagePreviews.map((url, i) => <div key={`n-${i}`} className="aspect-square rounded-lg overflow-hidden border border-emerald-200"><img src={url} alt="" className="w-full h-full object-cover" /></div>)}
                                            </div>
                                        }
                                    </ReviewSection>
                                    <ReviewSection title="Description">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{form.description || "—"}</p>
                                    </ReviewSection>
                                    {(form.verificationVideoUrl || form.ownerVerificationNote) && (
                                        <ReviewSection title="Verification Evidence">
                                            {form.verificationVideoUrl && <ReviewItem label="Video URL" value={form.verificationVideoUrl} />}
                                            {form.ownerVerificationNote && <ReviewItem label="Note to Admin" value={form.ownerVerificationNote} />}
                                        </ReviewSection>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Side Panel */}
                    <aside className="flex shrink-0 flex-col gap-6 bg-slate-50/50 p-6 sm:p-8 lg:w-80 dark:bg-slate-800/10">
                        {currentStep === 1 && (
                            <section>
                                <h4 className={cn(groupHeading, "mb-4")}>Edit Tips</h4>
                                <div className="space-y-3">
                                    <SideTip title="Accurate Pricing" text="Update rent if market rates have changed." />
                                    <SideTip title="Keep It Fresh" text="Updated listings attract more views." />
                                </div>
                            </section>
                        )}
                        {currentStep === 2 && (
                            <section className="space-y-6">
                                <h4 className={groupHeading}>Location Tips</h4>
                                <div className="space-y-3">
                                    <SideTip title="GPS Coordinates" text="Use the map to set the precise location." />
                                    <SideTip title="Landmarks" text="Nearby landmarks help tenants orient quickly." />
                                </div>
                            </section>
                        )}
                        {currentStep === 3 && (
                            <section className="space-y-6">
                                <h4 className={groupHeading}>Feature Tips</h4>
                                <div className="space-y-3">
                                    <SideTip title="Be Honest" text="Accurate features build trust with potential tenants." />
                                    <SideTip title="Rules Matter" text="Clear house rules prevent future disputes." />
                                </div>
                            </section>
                        )}
                        {currentStep === 4 && (
                            <section className="space-y-6">
                                <h4 className={groupHeading}>Photo Tips</h4>
                                <div className="space-y-3">
                                    <SideTip title="Quality Photos" text="Well-lit photos get 3x more views." />
                                    <SideTip title="New uploads" text="New photos are added to existing ones (not replaced)." />
                                    <SideTip title="Verified Badge" text="Upload a walk-through video and a note so the admin can grant you the Verified badge faster." />
                                </div>
                            </section>
                        )}
                        {currentStep === 5 && (
                            <section className="space-y-6">
                                <h4 className={groupHeading}>Before Saving</h4>
                                <div className="space-y-3">
                                    <SideTip title="Review Carefully" text="Changes are applied immediately after saving." />
                                </div>
                            </section>
                        )}
                        <div className="mt-auto flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-900/10">
                            <Lock className="size-4 shrink-0 text-emerald-600" />
                            <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                                Your details are stored securely and only shared with verified tenants.
                            </p>
                        </div>
                    </aside>
                </div>

                <WizardFooter
                    current={currentStep}
                    total={steps.length}
                    onBack={() => { if (currentStep === 1) router.back(); else prevStep() }}
                    onNext={currentStep === steps.length ? handleSubmit : nextStep}
                    submitting={submitting}
                    nextLabel={`Next: ${steps[currentStep]?.name ?? ""}`}
                    finalLabel="Save Changes"
                    submittingLabel="Saving…"
                />
            </div>
        </div>
    )
}
