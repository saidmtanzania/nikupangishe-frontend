"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Briefcase,
    Loader2,
    AlertCircle,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Star,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { adminApi, agentsApi, type ApiAgentProfile } from "@/lib/api"

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_TABS = ["all", "pending", "verified", "rejected"] as const
const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAgentsPage() {
    const { token } = useAuth()
    const searchParams = useSearchParams()
    const initialStatus = searchParams.get("status") ?? "all"

    const [agents, setAgents] = useState<ApiAgentProfile[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus)

    const [loading, setLoading] = useState(true)
    const [agentAction, setAgentAction] = useState<Record<string, "reject" | null>>({})
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
    const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    const loadAgents = useCallback(() => {
        if (!token) return
        setLoading(true)
        adminApi.adminListAgents(
            { verificationStatus: statusFilter === "all" ? undefined : statusFilter, page, limit: 20 },
            token
        )
            .then((res) => {
                setAgents(res.data)
                setTotal(res.meta.total)
                setTotalPages(res.meta.totalPages)
            })
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load agents."))
            .finally(() => setLoading(false))
    }, [token, page, statusFilter])

    useEffect(() => { loadAgents() }, [loadAgents])
    useEffect(() => { setPage(1) }, [statusFilter])

    async function handleVerify(agentId: string, approved: boolean) {
        if (!token) return
        const reason = rejectReason[agentId] ?? ""
        if (!approved && !reason.trim()) {
            setError("Please provide a rejection reason before rejecting.")
            return
        }
        setActionLoading((p) => ({ ...p, [agentId]: true }))
        setError(null)
        try {
            await agentsApi.verify(agentId, approved ? { approved: true } : { approved: false, rejectionReason: reason }, token)
            setAgents((prev) => prev.map((a) =>
                a.id === agentId
                    ? { ...a, verificationStatus: approved ? "verified" : "rejected", rejectionReason: approved ? undefined : reason }
                    : a
            ))
        } catch (e) {
            setError(e instanceof Error ? e.message : "Action failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [agentId]: false }))
            setAgentAction((p) => ({ ...p, [agentId]: null }))
        }
    }

    // Revoke = reject a verified agent
    async function handleRevoke(agentId: string) {
        if (!token) return
        const reason = rejectReason[`${agentId}-revoke`] ?? ""
        if (!reason.trim()) {
            setError("Please provide a reason for revoking this agent.")
            return
        }
        setActionLoading((p) => ({ ...p, [`${agentId}-revoke`]: true }))
        setError(null)
        try {
            await agentsApi.verify(agentId, { approved: false, rejectionReason: reason }, token)
            setAgents((prev) => prev.map((a) =>
                a.id === agentId ? { ...a, verificationStatus: "rejected", rejectionReason: reason } : a
            ))
        } catch (e) {
            setError(e instanceof Error ? e.message : "Revoke failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [`${agentId}-revoke`]: false }))
            setAgentAction((p) => ({ ...p, [agentId]: null }))
        }
    }

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">All Agents</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} agent profile{total !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={loadAgents} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="space-y-5 px-4 pb-20">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    {STATUS_TABS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                "px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all",
                                statusFilter === s
                                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Agent list */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : agents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Briefcase className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">No agents found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {agents.map((agent) => {
                                const u = agent.user
                                const initials = u ? `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase() : "?"
                                const isPending = agent.verificationStatus === "pending"
                                const isVerified = agent.verificationStatus === "verified"
                                const busy = actionLoading[agent.id]
                                const revokeBusy = actionLoading[`${agent.id}-revoke`]
                                const isRejecting = agentAction[agent.id] === "reject"
                                const isRevoking = agentAction[agent.id] === ("revoke" as "reject" | null)

                                return (
                                    <div key={agent.id} className="px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center text-sm font-medium text-purple-600 border border-purple-100 shrink-0">
                                                {initials}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-white uppercase tracking-tight">
                                                        {u ? `${u.firstName} ${u.lastName}` : agent.userId}
                                                    </p>
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", STATUS_COLORS[agent.verificationStatus] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {agent.verificationStatus}
                                                    </span>
                                                </div>
                                                {u?.email && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{u.email}</p>}
                                                <div className="flex flex-wrap gap-3 mt-1.5">
                                                    {agent.agencyName && <span className="text-[10px] text-slate-500 font-medium">🏢 {agent.agencyName}</span>}
                                                    {agent.licenseNumber && <span className="text-[10px] text-slate-500 font-medium">🪪 {agent.licenseNumber}</span>}
                                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                                                        <Star className="h-3 w-3" /> {Number(agent.rating).toFixed(1)} · {agent.totalCompletedDeals} deals
                                                    </span>
                                                    {agent.commissionRate != null && (
                                                        <span className="text-[10px] text-slate-400 font-medium">Commission: {agent.commissionRate}%</span>
                                                    )}
                                                </div>
                                                {agent.bio && <p className="text-[10px] text-slate-400 mt-1.5 italic line-clamp-2">{agent.bio}</p>}
                                                {agent.rejectionReason && (
                                                    <p className="text-[10px] text-red-500 mt-1.5">Reason: {agent.rejectionReason}</p>
                                                )}

                                                {/* Reject reason input for pending */}
                                                {isRejecting && (
                                                    <div className="mt-3">
                                                        <input type="text" placeholder="Reason for rejection..." value={rejectReason[agent.id] ?? ""} onChange={(e) => setRejectReason((p) => ({ ...p, [agent.id]: e.target.value }))} className="w-full max-w-sm text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white placeholder:text-slate-400" />
                                                    </div>
                                                )}

                                                {/* Revoke reason input for verified */}
                                                {isRevoking && (
                                                    <div className="mt-3">
                                                        <input type="text" placeholder="Reason for revoking..." value={rejectReason[`${agent.id}-revoke`] ?? ""} onChange={(e) => setRejectReason((p) => ({ ...p, [`${agent.id}-revoke`]: e.target.value }))} className="w-full max-w-sm text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white placeholder:text-slate-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                                {isPending && !isRejecting && (
                                                    <>
                                                        <button disabled={busy} onClick={() => handleVerify(agent.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Approve
                                                        </button>
                                                        <button disabled={busy} onClick={() => setAgentAction((p) => ({ ...p, [agent.id]: "reject" }))} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                            <XCircle className="h-3 w-3" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {isRejecting && (
                                                    <>
                                                        <button disabled={busy} onClick={() => handleVerify(agent.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Confirm
                                                        </button>
                                                        <button disabled={busy} onClick={() => setAgentAction((p) => ({ ...p, [agent.id]: null }))} className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                                                    </>
                                                )}
                                                {isVerified && !isRevoking && (
                                                    <button
                                                        disabled={revokeBusy}
                                                        onClick={() => setAgentAction((p) => ({ ...p, [agent.id]: "revoke" as "reject" | null }))}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-3 w-3" /> Revoke
                                                    </button>
                                                )}
                                                {isRevoking && (
                                                    <>
                                                        <button disabled={revokeBusy} onClick={() => handleRevoke(agent.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                            {revokeBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Confirm Revoke
                                                        </button>
                                                        <button disabled={revokeBusy} onClick={() => setAgentAction((p) => ({ ...p, [agent.id]: null }))} className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                            Page {page} of {totalPages} · {total} agents
                        </p>
                        <div className="flex items-center gap-2">
                            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
