"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    AlertCircle,
    RefreshCw,
    MessageSquare,
    Home,
} from "lucide-react"
import Image from "next/image"
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

type Tab = "pending" | "confirmed" | "completed" | "all"

export default function AgentViewingsPage() {
    const { token } = useAuth()
    const [viewings, setViewings] = useState<ApiViewingRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<Tab>("pending")
    const [error, setError] = useState<string | null>(null)
    const [confirmDate, setConfirmDate] = useState<Record<string, string>>({})
    const [showOutcome, setShowOutcome] = useState<Record<string, boolean>>({})
    const [agentNotes, setAgentNotes] = useState<Record<string, string>>({})
    const [busy, setBusy] = useState<Record<string, boolean>>({})

    const loadViewings = useCallback(() => {
        if (!token) return
        setLoading(true)
        viewingsApi.myViewings(token)
            .then(setViewings)
            .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false))
    }, [token])

    useEffect(() => { loadViewings() }, [loadViewings])

    async function handleConfirm(id: string) {
        if (!token) return
        const date = confirmDate[id]
        if (!date) { setError("Please pick a confirmed date/time first."); return }
        setBusy((p) => ({ ...p, [id]: true })); setError(null)
        try {
            const updated = await viewingsApi.update(id, { status: "confirmed", confirmedDate: date }, token)
            setViewings((prev) => prev.map((v) => v.id === id ? { ...v, ...updated } : v))
        } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed") }
        finally { setBusy((p) => ({ ...p, [id]: false })) }
    }

    async function handleOutcome(id: string, interested: boolean) {
        if (!token) return
        setBusy((p) => ({ ...p, [id]: true })); setError(null)
        try {
            const updated = await viewingsApi.update(id, {
                status: "completed",
                agentNotes: agentNotes[id] ?? "",
                tenantInterestedAfterViewing: interested,
            }, token)
            setViewings((prev) => prev.map((v) => v.id === id ? { ...v, ...updated } : v))
            setShowOutcome((p) => ({ ...p, [id]: false }))
        } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed") }
        finally { setBusy((p) => ({ ...p, [id]: false })) }
    }

    async function handleCancel(id: string) {
        if (!token) return
        setBusy((p) => ({ ...p, [id]: true })); setError(null)
        try {
            const updated = await viewingsApi.update(id, { status: "cancelled", cancellationReason: "Cancelled by agent" }, token)
            setViewings((prev) => prev.map((v) => v.id === id ? { ...v, ...updated } : v))
        } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed") }
        finally { setBusy((p) => ({ ...p, [id]: false })) }
    }

    const filtered = viewings.filter((v) => tab === "all" || v.status === tab)
    const tabCount = (t: Tab) => t === "all" ? viewings.length : viewings.filter((v) => v.status === t).length

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">My Viewings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Confirm, manage, and log outcomes for house viewings.</p>
                </div>
                <button
                    onClick={loadViewings}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="px-4 pb-20 space-y-6">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                    {(["pending", "confirmed", "completed", "all"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => setTab(t)} className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-all",
                            tab === t ? "bg-white dark:bg-slate-900 text-slate-700 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}>
                            {t}
                            <span className={cn("text-[9px] rounded-full px-1.5 py-0.5 font-medium", tab === t ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-500 dark:bg-slate-700")}>
                                {tabCount(t)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Calendar className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">No {tab} viewings.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filtered.map((v) => {
                                const isBusy = busy[v.id]
                                const thumb = v.house?.images?.[0] ?? "/images/house-placeholder.jpg"
                                return (
                                    <div key={v.id} className="p-6 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-start gap-5">
                                            <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                                <Image src={thumb} alt={v.house?.title ?? "House"} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-white uppercase tracking-tight truncate">
                                                        <Home className="h-3.5 w-3.5 inline mr-1 text-slate-400" />
                                                        {v.house?.title ?? v.houseId}
                                                    </p>
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", STATUS_CHIP[v.status] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {v.status.replace("_", " ")}
                                                    </span>
                                                    {v.tenantInterestedAfterViewing && (
                                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest">✓ Tenant Interested</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {v.tenant && <span className="text-[10px] font-medium text-slate-500">👤 {v.tenant.firstName} {v.tenant.lastName}{v.tenant.phone && ` · ${v.tenant.phone}`}</span>}
                                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> Preferred: {fmtDate(v.preferredDate)}
                                                    </span>
                                                    {v.confirmedDate && <span className="text-[10px] font-medium text-blue-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Confirmed: {fmtDate(v.confirmedDate)}</span>}
                                                </div>
                                                {v.tenantMessage && <p className="text-[10px] text-slate-400 italic border-l-2 border-slate-200 pl-2">&ldquo;{v.tenantMessage}&rdquo;</p>}
                                                {v.agentNotes && <p className="text-[10px] text-slate-500 flex items-start gap-1"><MessageSquare className="h-3 w-3 shrink-0 mt-0.5 text-slate-400" />{v.agentNotes}</p>}

                                                {/* Actions */}
                                                <div className="pt-2 space-y-3">
                                                    {v.status === "pending" && (
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <input type="datetime-local" value={confirmDate[v.id] ?? ""} onChange={(e) => setConfirmDate((p) => ({ ...p, [v.id]: e.target.value }))}
                                                                className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white" />
                                                            <button disabled={isBusy} onClick={() => handleConfirm(v.id)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm">
                                                                {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Confirm Time
                                                            </button>
                                                            <button disabled={isBusy} onClick={() => handleCancel(v.id)}
                                                                className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <XCircle className="h-3 w-3 inline mr-1" />Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                    {v.status === "confirmed" && (
                                                        <div className="space-y-2">
                                                            {showOutcome[v.id] ? (
                                                                <div className="flex flex-col gap-2">
                                                                    <textarea rows={2} placeholder="Agent notes (describe the viewing, tenant's feedback…)"
                                                                        value={agentNotes[v.id] ?? ""}
                                                                        onChange={(e) => setAgentNotes((p) => ({ ...p, [v.id]: e.target.value }))}
                                                                        className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:text-white resize-none placeholder:text-slate-400" />
                                                                    <div className="flex gap-2">
                                                                        <button disabled={isBusy} onClick={() => handleOutcome(v.id, true)}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-emerald-200">
                                                                            {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />} Tenant Interested
                                                                        </button>
                                                                        <button disabled={isBusy} onClick={() => handleOutcome(v.id, false)}
                                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
                                                                            {isBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsDown className="h-3 w-3" />} Not Interested
                                                                        </button>
                                                                        <button onClick={() => setShowOutcome((p) => ({ ...p, [v.id]: false }))} className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600">Back</button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setShowOutcome((p) => ({ ...p, [v.id]: true }))}
                                                                    className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium uppercase tracking-widest bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95">
                                                                    <CheckCircle2 className="h-3 w-3" /> Log Viewing Outcome
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    {v.status === "completed" && (
                                                        <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
                                                            {v.tenantInterestedAfterViewing ? "✓ Awaiting owner approval" : "Viewing complete — tenant not interested"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
