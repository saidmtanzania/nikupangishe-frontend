"use client"

import { useEffect, useState } from "react"
import { DollarSign, Calendar, ArrowLeftRight, Home, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { agentsApi, type ApiCommissionSummary } from "@/lib/api"
import { cn } from "@/lib/utils"

function formatMoney(amount: number, currency = "TZS") {
    return `${currency} ${Math.round(amount).toLocaleString()}`
}

export default function AgentEarningsPage() {
    const { token } = useAuth()
    const [summary, setSummary] = useState<ApiCommissionSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return
        let cancelled = false
        agentsApi.myCommissions(token)
            .then((res) => { if (!cancelled) setSummary(res) })
            .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load commissions") })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [token])

    const commissions = summary?.items ?? []
    const totals = summary?.totals
    const currency = totals?.currency ?? "TZS"

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Earnings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Commissions recorded when an owner approves your tenant, and again every time a house you manage changes hands through an exchange.
                    </p>
                </div>
            </header>

            <div className="px-4 space-y-8 pb-20">
                {error && (
                    <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-sm text-red-600">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign className="size-24 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Total Earned</p>
                        <h3 className="text-2xl font-medium text-slate-700 dark:text-white">{formatMoney(totals?.allTime ?? 0, currency)}</h3>
                        <p className="mt-4 text-[10px] font-medium text-slate-400">{commissions.length} commission{commissions.length !== 1 ? "s" : ""} recorded</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <Calendar className="size-3" /> This Month
                        </p>
                        <h3 className="text-2xl font-medium text-slate-700 dark:text-white">{formatMoney(totals?.thisMonth ?? 0, currency)}</h3>
                    </div>
                    <div className="bg-primary/90 p-8 rounded-3xl shadow-xl shadow-primary/10 text-white">
                        <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-2">Deals</p>
                        <div className="flex items-end gap-6">
                            <div>
                                <h3 className="text-2xl font-medium">{totals?.placements ?? 0}</h3>
                                <p className="text-[10px] text-white/70 uppercase tracking-widest flex items-center gap-1"><Home className="size-3" /> Placements</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium">{totals?.exchanges ?? 0}</h3>
                                <p className="text-[10px] text-white/70 uppercase tracking-widest flex items-center gap-1"><ArrowLeftRight className="size-3" /> Exchanges</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-medium uppercase tracking-tight text-slate-700 dark:text-white">Commission History</h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-medium uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Ref</th>
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Tenant</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                                            <Loader2 className="size-5 animate-spin inline" />
                                        </td>
                                    </tr>
                                ) : commissions.length > 0 ? commissions.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="px-6 py-5 text-[10px] font-mono font-medium text-slate-400 uppercase">#{c.id.slice(-6)}</td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.propertyTitle}</p>
                                            {c.propertyLocation && <p className="text-[11px] text-slate-400">{c.propertyLocation}</p>}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{c.tenantName || "—"}</td>
                                        <td className="px-6 py-5">
                                            <span className={cn(
                                                "text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-widest border",
                                                c.type === "exchange"
                                                    ? "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/20"
                                                    : "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20"
                                            )}>
                                                {c.type === "exchange" ? "Exchange" : "Placement"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-800 dark:text-white">{formatMoney(c.amount, c.currency)}</td>
                                        <td className="px-6 py-5 text-xs font-medium text-slate-400">
                                            {new Date(c.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                                            No commissions yet. They appear here when an owner approves a tenant you showed a house to.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
