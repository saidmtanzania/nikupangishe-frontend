"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    AlertCircle,
    RefreshCw,
    Home,
    Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { viewingsApi, type ApiViewingRequest } from "@/lib/api"

function fmtDate(iso?: string) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-TZ", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
}

const STATUS_CHIP: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-blue-50 text-blue-600 border-blue-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
    no_show: "bg-slate-50 text-slate-500 border-slate-100",
}

const STATUS_DESC: Record<string, string> = {
    pending: "Awaiting agent confirmation",
    confirmed: "Viewing scheduled — check your confirmed date",
    completed: "Viewing done",
    cancelled: "Cancelled",
    no_show: "Marked as no-show",
}

export default function TenantViewingsPage() {
    const { token } = useAuth()
    const [viewings, setViewings] = useState<ApiViewingRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadViewings = useCallback(() => {
        if (!token) return
        setLoading(true)
        viewingsApi.myViewings(token)
            .then(setViewings)
            .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false))
    }, [token])

    useEffect(() => { loadViewings() }, [loadViewings])

    const active = viewings.filter((v) => v.status === "pending" || v.status === "confirmed")
    const past = viewings.filter((v) => v.status === "completed" || v.status === "cancelled" || v.status === "no_show")

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">My Viewings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track your house viewing requests and their status.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadViewings}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                    </button>
                    <Link href="/browse"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-medium uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <Plus className="h-3.5 w-3.5" /> Book a Viewing
                    </Link>
                </div>
            </header>

            <div className="px-4 pb-20 space-y-8">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                ) : viewings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Calendar className="h-12 w-12 text-slate-200 mb-4" />
                        <p className="text-sm font-medium text-slate-400 mb-2">No viewing requests yet.</p>
                        <Link href="/browse" className="text-primary text-[10px] font-medium uppercase tracking-widest hover:underline">
                            Browse houses to book a viewing
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Active viewings */}
                        {active.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4 px-1">Active Viewings</h3>
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {active.map((v) => <ViewingRow key={v.id} v={v} />)}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Past viewings */}
                        {past.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4 px-1">Past Viewings</h3>
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden opacity-75">
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {past.map((v) => <ViewingRow key={v.id} v={v} />)}
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function ViewingRow({ v }: { v: ApiViewingRequest }) {
    const thumb = v.house?.images?.[0] ?? "/images/house-placeholder.jpg"

    return (
        <div className="p-5 flex items-start gap-5 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
            <div className="relative size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                <Image src={thumb} alt={v.house?.title ?? "House"} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <p className="text-sm font-medium text-slate-700 dark:text-white uppercase tracking-tight truncate">
                        <Home className="h-3.5 w-3.5 inline mr-1 text-slate-400" />
                        {v.house?.title ?? v.houseId}
                    </p>
                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest",
                        STATUS_CHIP[v.status] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                        {v.status.replace("_", " ")}
                    </span>
                </div>

                <p className="text-[10px] text-slate-400 font-medium mb-1.5">
                    {STATUS_DESC[v.status] ?? v.status}
                </p>

                <div className="flex flex-wrap gap-3">
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Preferred: {new Date(v.preferredDate).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {v.confirmedDate && (
                        <span className="text-[10px] font-medium text-blue-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Confirmed: {new Date(v.confirmedDate).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                    {v.house && (
                        <span className="text-[10px] font-medium text-slate-400">
                            📍 {v.house.area}{v.house.city && `, ${v.house.city}`}
                        </span>
                    )}
                </div>

                {v.agentNotes && (
                    <div className="mt-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700">
                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Agent Notes</p>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300">{v.agentNotes}</p>
                    </div>
                )}

                {v.tenantInterestedAfterViewing && v.status === "completed" && (
                    <div className="mt-2 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <p className="text-[10px] text-emerald-600 font-medium">
                            You expressed interest — awaiting owner approval to create your tenancy record.
                        </p>
                    </div>
                )}

                {v.cancellationReason && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> {v.cancellationReason}
                    </p>
                )}
            </div>
        </div>
    )
}
