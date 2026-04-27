"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Share,
    Loader2,
    Eye,
    EyeOff,
    Trash2,
    Pencil,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { propertiesApi, toProperty } from "@/lib/api"

// ── Relative time helper ──────────────────────────────────────────────────
function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(iso).toLocaleDateString()
}

export default function MyHousesPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [ownerProperties, setOwnerProperties] = useState<ReturnType<typeof toProperty>[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
    const [actionError, setActionError] = useState<string | null>(null)

    const loadHouses = useCallback(() => {
        if (!token) { setIsLoading(false); return }
        setIsLoading(true)
        propertiesApi.myHouses(token)
            .then((res) => setOwnerProperties(res.map(toProperty)))
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [token])

    useEffect(() => { loadHouses() }, [loadHouses])

    const [searchQuery, setSearchQuery] = useState("")

    const filteredProperties = useMemo(() => {
        return ownerProperties.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [ownerProperties, searchQuery])

    const handlePublish = async (id: string) => {
        if (!token) return
        setActionLoading(prev => ({ ...prev, [id]: true }))
        setActionError(null)
        try {
            await propertiesApi.publishHouse(id, token)
            setOwnerProperties(prev =>
                prev.map(p => p.id === id ? { ...p, status: "available" as const } : p)
            )
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Failed to publish")
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }))
        }
    }

    const handleUnpublish = async (id: string) => {
        if (!token) return
        setActionLoading(prev => ({ ...prev, [id]: true }))
        setActionError(null)
        try {
            await propertiesApi.unpublishHouse(id, token)
            setOwnerProperties(prev =>
                prev.map(p => p.id === id ? { ...p, status: "pending" as const } : p)
            )
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Failed to unpublish")
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }))
        }
    }

    const handleDelete = async (id: string) => {
        if (!token || !confirm("Deactivate this listing? It will no longer be visible.")) return
        setActionLoading(prev => ({ ...prev, [id]: true }))
        try {
            await propertiesApi.delete(id, token)
            setOwnerProperties(prev => prev.filter(p => p.id !== id))
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Failed to delete")
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }))
        }
    }

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
                        <button
                            onClick={loadHouses}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-200 transition-all shadow-sm active:scale-95"
                        >
                            <Share className="h-4 w-4" />
                            Refresh
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/owner/houses/new")}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-sm font-medium text-white transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add House
                        </button>
                    </div>
                </div>
            </header>

            <div className="px-8 pb-12 max-w-7xl mx-auto space-y-6 w-full">
                {/* Error banner */}
                {actionError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3 text-sm font-medium">
                        {actionError}
                    </div>
                )}

                {/* Section 1: Filter Bar */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400/70 font-normal"
                                placeholder="Search by name, location or ID..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Main Table */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium uppercase tracking-wider">Loading houses…</span>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Plus className="h-7 w-7 text-slate-300" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-slate-600 dark:text-slate-300">No listings yet</p>
                                <p className="text-sm mt-1">Add your first property to get started.</p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/owner/houses/new")}
                                className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all"
                            >
                                Add House
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-250">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-5">House</th>
                                        <th className="px-6 py-5">Location</th>
                                        <th className="px-6 py-5">Price (TZS)</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5">Verification</th>
                                        <th className="px-6 py-5">Agent</th>
                                        <th className="px-6 py-5">Created</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filteredProperties.map((p) => {
                                        const isPending = p.status === "pending"
                                        const isActive = p.status === "available"
                                        const isOccupied = p.status === "occupied"
                                        const isLoading = actionLoading[p.id]

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200/50">
                                                            <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-transform duration-500 hover:scale-125" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 dark:text-white truncate text-sm mb-0.5">{p.title}</p>
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
                                                        isActive && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border border-emerald-100",
                                                        isPending && "bg-amber-50 text-amber-600 dark:bg-amber-950/30 border border-amber-100",
                                                        isOccupied && "bg-slate-100 text-slate-600 border border-slate-200",
                                                        !isActive && !isPending && !isOccupied && "bg-red-50 text-red-600 dark:bg-red-950/30 border border-red-100",
                                                    )}>
                                                        {isActive ? "Published" : isOccupied ? "Rented" : isPending ? "Pending" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-md text-[9px] font-medium uppercase border",
                                                        p.isVerified ? "bg-blue-50 text-blue-500 border-blue-100" : "text-slate-300 border-slate-100"
                                                    )}>
                                                        {p.isVerified ? "Verified" : "Unverified"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    {p.agentId ? (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden text-slate-400">
                                                                <span className="text-[9px] font-medium uppercase">{p.agentId.slice(0, 2).toUpperCase()}</span>
                                                            </div>
                                                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-22.5">Assigned</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 text-[10px] font-medium text-slate-400">
                                                    {relativeTime(p.createdAt)}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isPending && (
                                                            <button
                                                                onClick={() => handlePublish(p.id)}
                                                                disabled={isLoading}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                                            >
                                                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                                                Publish
                                                            </button>
                                                        )}
                                                        {isActive && (
                                                            <button
                                                                onClick={() => handleUnpublish(p.id)}
                                                                disabled={isLoading}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                                            >
                                                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <EyeOff className="h-3 w-3" />}
                                                                Unpublish
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => router.push(`/dashboard/owner/houses/${p.id}/edit`)}
                                                            className="p-1.5 text-slate-300 hover:text-primary transition-colors"
                                                            title="Edit listing"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            disabled={isLoading}
                                                            className="p-1.5 text-slate-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                            title="Delete listing"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    {!isLoading && filteredProperties.length > 0 && (
                        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                                {filteredProperties.length} listing{filteredProperties.length !== 1 ? "s" : ""}
                            </span>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-primary transition-all">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="text-[11px] font-medium text-primary px-4 bg-primary/10 py-1 rounded-lg">1</span>
                                <button className="p-2 text-slate-400 hover:text-primary transition-all">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
