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
    UserCheck,
    Eye,
    ThumbsUp,
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

type Tab = "all" | "interested" | "pending" | "completed"

export default function OwnerViewingsPage() {
    const { token } = useAuth()
    const [viewings, setViewings] = useState<ApiViewingRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<Tab>("interested")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Confirm tenancy dialog state
    const [tenancyFor, setTenancyFor] = useState<ApiViewingRequest | null>(null)
    const [agreedRent, setAgreedRent] = useState("")
    const [startDate, setStartDate] = useState("")
    const [paymentInstructions, setPaymentInstructions] = useState("")
    const [tenancyBusy, setTenancyBusy] = useState(false)

    const loadViewings = useCallback(() => {
        if (!token) return
        setLoading(true)
        viewingsApi.myViewings(token)
            .then(setViewings)
            .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false))
    }, [token])

    useEffect(() => { loadViewings() }, [loadViewings])

    function closeTenancyDialog() {
        setTenancyFor(null)
        setAgreedRent(""); setStartDate(""); setPaymentInstructions("")
    }

    async function handleConfirmTenancy() {
        if (!token || !tenancyFor?.tenant) return
        if (!paymentInstructions.trim()) {
            setError("Add the payment details the tenant should use to pay you.")
            return
        }
        setTenancyBusy(true); setError(null)
        try {
            const result = await viewingsApi.approveTenant(tenancyFor.id, {
                paymentInstructions: paymentInstructions.trim(),
                startDate: startDate || undefined,
                agreedRent: agreedRent ? parseFloat(agreedRent) : undefined,
            }, token)
            const commissionNote = result.commission
                ? ` The agent's commission of ${result.commission.currency} ${result.commission.amount.toLocaleString()} (${result.commission.rate}% of one month's rent) has been recorded.`
                : ""
            setSuccess(`Tenancy confirmed for ${tenancyFor.tenant.firstName} ${tenancyFor.tenant.lastName}. They can now see your payment details.${commissionNote}`)
            closeTenancyDialog()
            loadViewings()
        } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to confirm tenancy") }
        finally { setTenancyBusy(false) }
    }

    const interested = viewings.filter((v) => v.tenantInterestedAfterViewing && v.status === "completed")
    const filtered = viewings.filter((v) => {
        if (tab === "all") return true
        if (tab === "interested") return v.tenantInterestedAfterViewing && v.status === "completed"
        if (tab === "pending") return v.status === "pending" || v.status === "confirmed"
        if (tab === "completed") return v.status === "completed"
        return true
    })

    const tabCount = (t: Tab) => {
        if (t === "all") return viewings.length
        if (t === "interested") return interested.length
        if (t === "pending") return viewings.filter((v) => v.status === "pending" || v.status === "confirmed").length
        if (t === "completed") return viewings.filter((v) => v.status === "completed").length
        return 0
    }

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Viewing Requests</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Review all viewing activity on your properties. Approve interested tenants to create an official tenancy.
                    </p>
                </div>
                <button onClick={loadViewings}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="px-4 pb-20 space-y-6">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" /><span>{success}</span>
                        <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-400 hover:text-emerald-600">✕</button>
                    </div>
                )}

                {/* Attention banner: interested tenants awaiting your decision */}
                {interested.length > 0 && tab !== "interested" && (
                    <button onClick={() => setTab("interested")}
                        className="w-full flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 hover:bg-amber-100 transition-all text-left">
                        <ThumbsUp className="h-4 w-4 shrink-0 text-amber-500" />
                        <span>
                            <strong>{interested.length}</strong> tenant{interested.length !== 1 ? "s" : ""} expressed interest after viewing —
                            <span className="underline ml-1">review and confirm tenancy</span>
                        </span>
                    </button>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl w-fit flex-wrap">
                    {(["interested", "pending", "completed", "all"] as Tab[]).map((t) => (
                        <button key={t} onClick={() => setTab(t)} className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-all",
                            tab === t ? "bg-white dark:bg-slate-900 text-slate-700 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}>
                            {t === "interested" ? "Tenant Interested" : t}
                            <span className={cn("text-[9px] rounded-full px-1.5 py-0.5 font-medium",
                                tab === t ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-500 dark:bg-slate-700",
                                t === "interested" && tabCount(t) > 0 && tab !== t ? "bg-amber-100 text-amber-600" : ""
                            )}>
                                {tabCount(t)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Eye className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">
                                {tab === "interested" ? "No tenants have expressed interest yet." : `No ${tab} viewings.`}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filtered.map((v) => {
                                const thumb = v.house?.images?.[0] ?? "/images/house-placeholder.jpg"
                                const isInterested = v.tenantInterestedAfterViewing && v.status === "completed"
                                return (
                                    <div key={v.id} className={cn(
                                        "p-6 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors",
                                        isInterested && "border-l-4 border-l-emerald-400"
                                    )}>
                                        <div className="flex items-start gap-5">
                                            <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                                <Image src={thumb} alt={v.house?.title ?? "House"} fill sizes="64px" className="object-cover" />
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
                                                    {isInterested && (
                                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest">✓ Interested</span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    {v.tenant && (
                                                        <span className="text-[10px] font-medium text-slate-500">
                                                            👤 <strong>{v.tenant.firstName} {v.tenant.lastName}</strong>
                                                            {v.tenant.email && ` · ${v.tenant.email}`}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> Preferred: {fmtDate(v.preferredDate)}
                                                    </span>
                                                    {v.confirmedDate && (
                                                        <span className="text-[10px] font-medium text-blue-500 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" /> Confirmed: {fmtDate(v.confirmedDate)}
                                                        </span>
                                                    )}
                                                </div>

                                                {v.agentNotes && (
                                                    <div className="flex items-start gap-2 mt-1 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700">
                                                        <p className="text-[10px] text-slate-600 dark:text-slate-300">
                                                            <span className="font-medium text-slate-400 uppercase tracking-widest text-[9px] block mb-0.5">Agent Notes</span>
                                                            {v.agentNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Owner action: approve interested tenant */}
                                                {isInterested && (
                                                    <div className="pt-2">
                                                        <button
                                                            onClick={() => setTenancyFor(v)}
                                                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 shadow-sm shadow-emerald-200"
                                                        >
                                                            <UserCheck className="h-3.5 w-3.5" /> Approve & Create Tenancy
                                                        </button>
                                                        <p className="text-[9px] text-slate-400 mt-1.5 font-medium">
                                                            This will create an official tenancy record. Rent is paid directly to you.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Tenancy Modal */}
            {tenancyFor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-8">
                        <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white mb-1">Confirm Tenancy</h3>
                        <p className="text-[11px] text-slate-400 mb-6 font-medium">
                            Creating an official tenancy record for <strong>{tenancyFor.tenant?.firstName} {tenancyFor.tenant?.lastName}</strong> at <strong>{tenancyFor.house?.title}</strong>.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest block mb-1.5">
                                    Agreed Monthly Rent (TZS)
                                </label>
                                <input type="number" placeholder="Leave empty to use the listing rent" value={agreedRent}
                                    onChange={(e) => setAgreedRent(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white placeholder:text-slate-400" />
                            </div>
                            <div>
                                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest block mb-1.5">
                                    Start Date
                                </label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white" />
                            </div>

                            <div>
                                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest block mb-1.5">
                                    Payment Details for the Tenant
                                </label>
                                <textarea rows={3} required maxLength={1000}
                                    placeholder="e.g. M-Pesa 0712 345 678 (Juma Ali) or CRDB acc. 0150... Reference: house name"
                                    value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)}
                                    className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white placeholder:text-slate-400 resize-none" />
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                                <p className="text-[10px] text-amber-700 font-medium">
                                    ⚠️ Rent is paid directly to you — never through the platform or the agent. Only this tenant will see these details.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button disabled={tenancyBusy} onClick={handleConfirmTenancy}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-medium uppercase tracking-widest rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-emerald-200">
                                {tenancyBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                Confirm Tenancy
                            </button>
                            <button disabled={tenancyBusy} onClick={closeTenancyDialog}
                                className="flex-1 py-3 border border-slate-200 dark:border-slate-600 text-slate-500 text-[10px] font-medium uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <XCircle className="h-4 w-4 inline mr-1.5" />Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
