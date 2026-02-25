"use client"

import { useState, useRef } from "react"
import { Check, Info, Shield, Sparkles, Camera, Image, FileText, Upload, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
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

const steps = [
    { id: 1, name: "Basic Details" },
    { id: 2, name: "Location" },
    { id: 3, name: "Media" },
    { id: 4, name: "Ownership" },
    { id: 5, name: "Review" },
]

const amenities = [
    { id: "parking", label: "Parking" },
    { id: "security", label: "Security" },
    { id: "water", label: "Water Supply" },
    { id: "balcony", label: "Balcony" },
    { id: "pool", label: "Swimming Pool" },
    { id: "ac", label: "Air Conditioning" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "gym", label: "Gym" },
]

export default function AddHousePage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isAvailable, setIsAvailable] = useState(true)
    const [images, setImages] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file))
            setImages(prev => [...prev, ...newImages])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="py-8 px-8 h-full flex flex-col items-center">
            {/* Minimal Header */}
            <header className="w-full max-w-4xl flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <PlusIcon className="size-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight uppercase">Add New Listing</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Owner Portal</span>
                            <span className="size-1 bg-slate-200 rounded-full" />
                            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Step {currentStep}: {steps[currentStep - 1].name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { if (currentStep === 1) { /* handle cancel */ } else prevStep() }}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4 h-9"
                    >
                        {currentStep === 1 ? "Cancel" : "Back"}
                    </button>
                    <Button
                        onClick={nextStep}
                        className="bg-primary text-white text-[10px] font-bold rounded-lg h-9 px-6 uppercase tracking-widest transition-colors shadow-none"
                    >
                        {currentStep === steps.length ? "Publish" : `Next: ${steps[currentStep].name}`}
                    </Button>
                </div>
            </header>

            {/* Static Card Container */}
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm">

                {/* Progress Strip - Static */}
                <div className="flex">
                    {steps.map((step) => (
                        <div key={step.id} className="flex-1">
                            <div className={cn(
                                "h-1",
                                step.id === currentStep ? "bg-primary" : step.id < currentStep ? "bg-slate-800 dark:bg-slate-200" : "bg-slate-50 dark:bg-slate-800"
                            )} />
                        </div>
                    ))}
                </div>

                <div className="flex divide-x divide-slate-50 dark:divide-slate-800 h-full">
                    {/* Form Side */}
                    <div className="flex-1 p-10 space-y-8">
                        {currentStep === 1 ? (
                            <>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">House Details</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Core property definitions</p>
                                </div>

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Property Title</Label>
                                        <Input
                                            placeholder="e.g. Modern Executive Apartment in Masaki"
                                            className="h-10 border-slate-100 bg-slate-50/50 dark:bg-slate-800/20 focus-visible:ring-primary/20 text-sm font-medium rounded-lg placeholder:font-normal placeholder:text-slate-300 shadow-none transition-none"
                                        />
                                    </div>

                                    <div className="grid gap-6 grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Type</Label>
                                            <Select defaultValue="apartment">
                                                <SelectTrigger className="h-10 border-slate-100 bg-slate-50/50 focus:ring-primary/20 rounded-lg text-xs font-medium shadow-none">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="apartment">Apartment</SelectItem>
                                                    <SelectItem value="villa">Villa</SelectItem>
                                                    <SelectItem value="room">Room</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Bedrooms</Label>
                                            <Input type="number" defaultValue={1} className="h-10 border-slate-100 bg-slate-50/50 rounded-lg text-sm font-medium shadow-none transition-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Bathrooms</Label>
                                            <Input type="number" defaultValue={1} className="h-10 border-slate-100 bg-slate-50/50 rounded-lg text-sm font-medium shadow-none transition-none" />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Monthly Rent</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">TZS</span>
                                                <Input placeholder="0.00" className="h-10 pl-12 border-slate-100 bg-slate-50/50 rounded-lg text-sm font-bold shadow-none transition-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Availability</Label>
                                            <div className="flex items-center justify-between h-10 px-5 bg-slate-50/50 border border-slate-100 rounded-lg">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Now</span>
                                                <button
                                                    onClick={() => setIsAvailable(!isAvailable)}
                                                    className={cn("w-8 h-4.5 rounded-full p-1 transition-all relative", isAvailable ? "bg-slate-800 dark:bg-slate-200" : "bg-slate-200 dark:bg-slate-700")}
                                                >
                                                    <div className={cn("size-2.5 bg-white dark:bg-slate-900 rounded-full transition-all", isAvailable ? "translate-x-3.5" : "translate-x-0")} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Description</Label>
                                        <textarea
                                            placeholder="Property highlights..."
                                            className="w-full min-h-[100px] p-5 border border-slate-100 bg-slate-50/50 focus:ring-0 focus:border-slate-300 focus:outline-none text-xs font-medium rounded-lg resize-none leading-relaxed transition-none"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : currentStep === 2 ? (
                            <>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">Property Location</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Address and landmarks</p>
                                </div>

                                <div className="grid gap-6">
                                    <div className="grid gap-6 grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">City</Label>
                                            <Select defaultValue="dar">
                                                <SelectTrigger className="h-10 border-slate-100 bg-slate-50/50 focus:ring-0 rounded-lg text-xs font-medium shadow-none">
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dar">Dar es Salaam</SelectItem>
                                                    <SelectItem value="arusha">Arusha</SelectItem>
                                                    <SelectItem value="dodoma">Dodoma</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Neighborhood</Label>
                                            <Input placeholder="e.g. Masaki" className="h-10 border-slate-100 bg-slate-50/50 rounded-lg text-sm font-medium shadow-none transition-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Street Address</Label>
                                        <Input
                                            placeholder="e.g. Kimweri Avenue"
                                            className="h-10 border-slate-100 bg-slate-50/50 rounded-lg text-sm font-medium shadow-none transition-none"
                                        />
                                    </div>

                                    <div className="aspect-[16/6] bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-slate-200 bg-center bg-cover opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800')" }} />
                                        <div className="relative z-10 flex flex-col items-center gap-2">
                                            <div className="size-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <MapPinIcon className="size-3.5 text-slate-900" />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-800 dark:text-white uppercase tracking-widest bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-md backdrop-blur-sm">Click to PIN ON MAP</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : currentStep === 3 ? (
                            <>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">Photos & Media</h3>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Property visuals</p>
                                </div>

                                <div className="space-y-6">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-40 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/20 flex flex-col items-center justify-center gap-3 cursor-pointer transition-none"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <div className="size-9 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
                                            <Upload className="size-4 text-slate-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Upload photos</p>
                                        </div>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {images.map((url, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100">
                                                    <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                                                    <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded text-white">
                                                        <Trash2 className="size-2.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Sparkles className="size-8 text-slate-300 mb-3" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Section Active</h3>
                            </div>
                        )}
                    </div>

                    {/* Static Side Panel */}
                    <div className="w-[320px] bg-slate-50/30 dark:bg-slate-800/10 p-10 flex flex-col gap-8 shrink-0">
                        {currentStep === 1 ? (
                            <section>
                                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-6">Amenities</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {amenities.map((item) => (
                                        <label key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg cursor-default">
                                            <div className="size-3 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                                                <input type="checkbox" className="sr-only peer" />
                                                <Check className="size-1.5 text-primary opacity-0 peer-checked:opacity-100 transition-none" strokeWidth={5} />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        ) : currentStep === 2 ? (
                            <section className="space-y-6">
                                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-6">Location Insights</h4>
                                <div className="space-y-3">
                                    <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 shadow-none">
                                        <p className="text-[9px] font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-1.5">Precision</p>
                                        <p className="text-[9px] leading-relaxed text-slate-400 uppercase font-medium">Exact street names improve discovery.</p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 shadow-none">
                                        <p className="text-[9px] font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-1.5">Landmarks</p>
                                        <p className="text-[9px] leading-relaxed text-slate-400 uppercase font-medium">Nearby icons help tenants orient quickly.</p>
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        <div className="mt-auto p-6 border border-slate-100 dark:border-slate-800 rounded-lg relative overflow-hidden">
                            <div className="flex gap-4 relative z-10 items-center">
                                <Shield className="h-4 w-4 text-slate-300 shrink-0" />
                                <div>
                                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Verified Data</h5>
                                    <p className="text-[9px] leading-relaxed text-slate-500 font-medium uppercase">Information is encrypted.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PlusIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}

function MapPinIcon(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 01Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}
