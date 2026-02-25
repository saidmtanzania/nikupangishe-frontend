"use client"

import { ArrowLeftRight, Search, Plus, Filter, Clock, MapPin, Building2, ChevronRight, MoreHorizontal } from "lucide-react"
import { mockExchangeRequests, mockUsers, mockProperties } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function TenantExchangePage() {
    const tenant = mockUsers.find(u => u.id === "user-2")!
    const requests = mockExchangeRequests.filter(e => e.fromTenantId === tenant.id)

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">House Exchange</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your swap requests and find tenants interested in your area.</p>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2">
                    <Plus className="size-4" /> New Request
                </button>
            </header>

            <div className="px-4 space-y-8 pb-20">
                {/* Active Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {requests.map((req) => {
                        const property = mockProperties.find(p => p.id === req.toPropertyId)
                        return (
                            <div key={req.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-slate-200 transition-all">
                                <div className="h-48 relative">
                                    {property?.images[0] ? (
                                        <Image src={property.images[0]} alt="Property" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="size-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                            <Building2 className="size-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                                        <span className={cn(
                                            "text-[9px] font-medium uppercase tracking-widest",
                                            req.status === "approved" ? "text-emerald-500" : req.status === "pending" ? "text-amber-500" : "text-red-500"
                                        )}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                        <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-1">Target Home</p>
                                        <h3 className="text-xl font-medium text-white">{req.toPropertyTitle}</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-10">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Trading From</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{req.fromPropertyTitle}</p>
                                        </div>
                                        <div className="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                            <ArrowLeftRight className="size-5" />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Requested On</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{req.createdAt}</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex gap-2">
                                        <button className="flex-1 py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white text-[10px] font-medium rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">View Details</button>
                                        <button className="px-5 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all">
                                            <MoreHorizontal className="size-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info Box */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <ArrowLeftRight className="size-48 text-primary" />
                    </div>
                    <div className="relative max-w-xl">
                        <h3 className="text-xl font-medium uppercase tracking-tight mb-4 text-slate-800 dark:text-white">How Exchange works</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-medium">Nikupangishe is the first platform in Tanzania to allow direct house swaps. Simply list your current house for exchange, find your dream location, and if both parties agree, we handle the contract transfer.</p>
                        <div className="flex flex-wrap gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-primary font-medium text-lg uppercase tracking-widest">01</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">List Yours</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-800 dark:text-white font-medium text-lg uppercase tracking-widest">02</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Request Swap</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-800 dark:text-white font-medium text-lg uppercase tracking-widest">03</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Move In</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
