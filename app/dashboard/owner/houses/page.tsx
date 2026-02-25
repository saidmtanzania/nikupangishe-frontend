"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import {
    Search,
    MapPin,
    Filter,
    Bell,
    Bed,
    Maximize,
    LayoutList,
    Map as MapIcon,
    LayoutGrid,
    ChevronRight,
    Plus
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

// Dynamic import for the Map component to avoid SSR issues
const PropertyMap = dynamic(() => import("@/components/properties/property-map"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <MapIcon className="h-8 w-8 text-slate-300" />
        </div>
    )
})

export default function MyHousesPage() {
    const owner = mockUsers.find((u) => u.id === "user-3")!
    const userName = owner.name
    const ownerProperties = mockProperties.filter(p => p.ownerId === owner.id)

    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"list" | "map" | "combined">("combined")

    const filteredProperties = useMemo(() => {
        return ownerProperties.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [ownerProperties, searchQuery])

    return (
        <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-slate-950 flex justify-center">
            <div className="relative flex w-full max-w-[1540px] px-0 sm:px-0 lg:px-0">
                <DashboardSidebar role="owner" userName={userName} />

                <main className="flex-1 pl-[260px] flex flex-col h-screen overflow-hidden">
                    {/* Top Search & Navigation Bar */}
                    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
                        <div className="flex-1 max-w-2xl relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search properties by address, neighborhood or name..."
                                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center bg-slate-50 p-1 rounded-xl">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                        viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <LayoutList className="h-3.5 w-3.5" /> List view
                                </button>
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                        viewMode === "map" ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <MapIcon className="h-3.5 w-3.5" /> Map view
                                </button>
                                <button
                                    onClick={() => setViewMode("combined")}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                                        viewMode === "combined" ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" /> Combined view
                                </button>
                            </div>

                            <button className="relative p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                                <Bell className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-1 right-1 size-2 bg-primary rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Panel: Property List */}
                        <div className={cn(
                            "flex-col bg-white border-r border-slate-100 transition-all duration-300",
                            viewMode === "list" ? "w-full" : viewMode === "map" ? "w-0 overflow-hidden" : "w-[480px]"
                        )}>
                            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                                <h2 className="text-xl font-bold text-slate-900">Properties ({filteredProperties.length})</h2>
                                <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary px-3 py-1.5 rounded-lg border border-slate-200 transition-all">
                                    <Filter className="h-3 w-3" /> Filter
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {filteredProperties.map((p) => (
                                    <PropertyCardCombined key={p.id} property={p} />
                                ))}

                                {filteredProperties.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <p className="text-slate-400 text-sm">No properties found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Map */}
                        <div className={cn(
                            "flex-1 relative bg-slate-200",
                            viewMode === "list" ? "hidden" : "block"
                        )}>
                            <PropertyMap properties={filteredProperties} />

                            {/* Floating Map Card - Floating detail view from the image */}
                            <div className="absolute top-8 right-8 z-[1000] w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex gap-4">
                                    <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                        <Image src={ownerProperties[0]?.images[0]} alt="Property" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">Mbezi Beach Villa</h3>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Last viewing: 2h ago</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Available</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                                    View Listing
                                </button>
                            </div>

                            {/* Map Zoom Controls */}
                            <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-2">
                                <button className="size-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-95 border border-slate-100">
                                    <Plus className="h-5 w-5" />
                                </button>
                                <div className="w-10 h-px bg-slate-100" />
                                <button className="size-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-95 border border-slate-100 font-bold text-xl">−</button>
                            </div>

                            <div className="absolute bottom-36 right-10 z-[1000]">
                                <button className="size-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95 border border-slate-100">
                                    <MapPin className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function PropertyCardCombined({ property }: { property: any }) {
    return (
        <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.isVerified && (
                        <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                            <span className="size-1 bg-white rounded-full animate-pulse" /> Verified
                        </span>
                    )}
                    <span className="bg-primary/90 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> GPS
                    </span>
                </div>
                <button className="absolute top-4 right-4 size-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all">
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{property.title}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin className="h-3 w-3" /> {property.location.neighborhood}, {property.location.city}
                </p>

                <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Bed className="h-3.5 w-3.5 text-slate-400" /> {property.bedrooms} Rooms
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Maximize className="h-3.5 w-3.5 text-slate-400" /> {property.area}sqm
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-primary font-bold text-lg leading-none">TZS {(property.price / 1000000).toFixed(1)}M</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">/ Month</span>
                    </div>
                    <button className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
                        Details
                    </button>
                </div>
            </div>
        </div>
    )
}
