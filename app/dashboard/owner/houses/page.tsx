"use client"

import { useState, useMemo } from "react"
import {
    Search,
    Plus,
    IdCard,
    ChevronLeft,
    ChevronRight,
    Share,
    Lock
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { mockProperties, mockUsers } from "@/lib/mock-data"

export default function MyHousesPage() {
    const owner = mockUsers.find((u) => u.id === "user-3")!
    const ownerProperties = mockProperties.filter(p => p.ownerId === owner.id)

    const [searchQuery, setSearchQuery] = useState("")

    const filteredProperties = useMemo(() => {
        return ownerProperties.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [ownerProperties, searchQuery])

    return (
        <div className="flex flex-col min-h-full">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 dark:bg-[#221610]/80 backdrop-blur-md px-8 py-8 transition-all">
                <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-slate-800 dark:text-white uppercase">All Houses</h2>
                        <p className="text-sm text-slate-500 font-normal mt-1">Every property you manage in one place.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-200 transition-all shadow-sm active:scale-95">
                            <Share className="h-4 w-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-primary/20 active:scale-95">
                            <Plus className="h-4 w-4" />
                            Add House
                        </button>
                    </div>
                </div>
            </header>

            <div className="px-8 pb-12 max-w-7xl mx-auto space-y-6 w-full">
                {/* Section 1: Verification Banner */}
                <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 transition-all group-hover:bg-primary"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:text-primary transition-colors">
                                <IdCard className="h-7 w-7" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-800 dark:text-white text-lg">Identity Verification Required</h4>
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mt-1 font-normal">
                                    Complete your profile verification to publish new listings and assign agents to your properties.
                                    This helps maintain a trusted community of property owners in Tanzania.
                                </p>
                            </div>
                        </div>
                        <button className="whitespace-nowrap px-8 py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-primary transition-all shadow-lg active:scale-95">
                            Verify Now
                        </button>
                    </div>
                </section>

                {/* Section 2: Filter Bar */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400/70 font-normal"
                                placeholder="Search by name or ID..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-600 dark:text-slate-300">
                            <option>All Statuses</option>
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Rented</option>
                        </select>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-600 dark:text-slate-300">
                            <option>All Cities</option>
                            <option>Dar es Salaam</option>
                            <option>Arusha</option>
                            <option>Zanzibar</option>
                        </select>
                        <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm py-2.5 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-slate-600 dark:text-slate-300">
                            <option>Price Range</option>
                        </select>
                        <div className="flex items-center justify-end">
                            <label className="inline-flex items-center cursor-pointer group">
                                <span className="mr-3 text-[10px] font-medium text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Needs Action</span>
                                <div className="relative">
                                    <input className="sr-only peer" type="checkbox" />
                                    <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Section 3: Main Table */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-5">House</th>
                                    <th className="px-6 py-5">Location</th>
                                    <th className="px-6 py-5">Price (TZS)</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Verification</th>
                                    <th className="px-6 py-5">Agent</th>
                                    <th className="px-6 py-5">Updated</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredProperties.map((p, idx) => {
                                    const agent = mockUsers.find(u => u.id === p.agentId)
                                    const isLock = idx === 3; // Simulate "Masaki Apartment" logic

                                    return (
                                        <tr key={p.id} className={cn(
                                            "hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group",
                                            isLock && "opacity-80 grayscale-[0.4]"
                                        )}>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200/50">
                                                        <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105 duration-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-slate-800 dark:text-white truncate text-sm mb-0.5">{p.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">#NKP-{p.id.split('-')[1]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium text-slate-600 dark:text-slate-400 text-[11px]">
                                                {p.location.neighborhood}, {p.location.city}
                                            </td>
                                            <td className="px-6 py-6 font-medium text-slate-800 dark:text-white text-sm">
                                                {(p.price / 1000000).toFixed(1)}M <span className="text-[9px] text-slate-400 uppercase tracking-tighter ml-0.5">/mo</span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider shadow-sm",
                                                    p.status === "available" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100" :
                                                        p.status === "pending" ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 border border-amber-100" :
                                                            idx === 4 ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-600 dark:bg-red-950/30 border border-red-100"
                                                )}>
                                                    {idx === 4 ? "Rented" : p.status === "available" ? "Published" : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.isVerified && (
                                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-blue-50 text-blue-500 dark:bg-blue-950/30 border border-blue-100 uppercase">GPS</span>
                                                    )}
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-md text-[9px] font-medium uppercase border",
                                                        p.isVerified ? "bg-blue-50 text-blue-500 border-blue-100" : "text-slate-300 border-slate-100"
                                                    )}>
                                                        {p.isVerified ? "Verified" : "Pending"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {agent ? (
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden text-slate-400">
                                                            <span className="text-[9px] font-medium uppercase">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                                                        </div>
                                                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[90px]">{agent.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-medium text-slate-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-[10px] font-medium text-slate-400">
                                                {idx === 0 ? "2h ago" : idx === 1 ? "Yesterday" : idx === 2 ? "3 days ago" : "2 weeks ago"}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                {isLock ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter mb-1.5 flex items-center gap-1">
                                                            <Lock className="h-2.5 w-2.5" /> Action Req.
                                                        </span>
                                                        <button className="text-slate-300 text-[11px] font-medium disabled opacity-50 uppercase tracking-wider cursor-not-allowed">Publish</button>
                                                    </div>
                                                ) : (
                                                    <button className="text-slate-500 text-[11px] font-medium hover:text-primary transition-colors uppercase tracking-wider border-b border-transparent hover:border-primary">
                                                        {idx === 4 ? "View Tenancy" : "View Listing"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination / Footer */}
                    <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Bulk Actions</span>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Archive</button>
                                <button className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Unpublish</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-primary transition-all">
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-[11px] font-medium text-primary px-4 bg-primary/10 py-1 rounded-lg">1</span>
                            <button className="px-4 py-1 text-sm font-medium text-slate-400 hover:text-slate-600 transition-all">2</button>
                            <button className="px-4 py-1 text-sm font-medium text-slate-400 hover:text-slate-600 transition-all">3</button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-all">
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
