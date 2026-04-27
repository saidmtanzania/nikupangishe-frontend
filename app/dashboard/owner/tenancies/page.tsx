"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Users,
    Home,
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRightLeft,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { exchangeApi, ApiTenancy } from "@/lib/api"

// ── Helpers ───────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}

function formatDate(iso: string | null | undefined) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function formatRent(amount: number | null | undefined, currency: string) {
    if (!amount) return "—"
    return `${currency} ${Number(amount).toLocaleString()}/mo`
}

function tenantInitials(t: ApiTenancy["tenant"]) {
    if (!t) return "?"
    return `${t.firstName?.[0] ?? ""}${t.lastName?.[0] ?? ""}`.toUpperCase()
}

function tenantName(t: ApiTenancy["tenant"]) {
    if (!t) return "Unknown Tenant"
    return `${t.firstName} ${t.lastName}`
}

// ── Status badge ──────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
    active: {
        label: "Active",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    pending_owner_confirmation: {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-50 text-amber-600 border-amber-100",
    },
    ended: {
        label: "Ended",
        icon: XCircle,
        className: "bg-slate-100 text-slate-500 border-slate-200",
    },
    transferred: {
        label: "Transferred",
        icon: ArrowRightLeft,
        className: "bg-blue-50 text-blue-600 border-blue-100",
    },
}

export default function OwnerTenanciesPage() {
    const router = useRouter()
    const { token } = useAuth()
    const [tenancies, setTenancies] = useState<ApiTenancy[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    useEffect(() => {
        if (!token) { setIsLoading(false); return }
        setIsLoading(true)
        exchangeApi.myTenancies(token)
            .then(setTenancies)
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load tenancies"))
            .finally(() => setIsLoading(false))
    }, [token])

    const filtered = useMemo(() => {
        let list = tenancies
        if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter)
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter((t) =>
                tenantName(t.tenant).toLowerCase().includes(q) ||
                (t.tenant?.email ?? "").toLowerCase().includes(q) ||
                (t.tenant?.phone ?? "").toLowerCase().includes(q) ||
                (t.house?.title ?? "").toLowerCase().includes(q) ||
                (t.house?.area ?? "").toLowerCase().includes(q)
            )
        }
        return list
    }, [tenancies, statusFilter, search])

    // Stats
    const active = tenancies.filter((t) => t.status === "active").length
    const pending = tenancies.filter((t) => t.status === "pending_owner_confirmation").length
    const totalRent = tenancies
        .filter((t) => t.status === "active" && t.agreedRent)
        .reduce((acc, t) => acc + Number(t.agreedRent ?? 0), 0)

    return (
        <div className="flex flex-col min-h-full">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#f8f6f6]/80 dark:bg-[#221610]/80 backdrop-blur-md px-8 py-8">
                <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
                    <div>
                        <h2 className="text-xl font-medium tracking-tight text-slate-800 dark:text-white uppercase">Tenancies</h2>
                        <p className="text-sm text-slate-500 font-normal mt-1">All tenants across your properties.</p>
                    </div>
                </div>
            </header>

            <div className="px-8 pb-12 max-w-7xl mx-auto space-y-6 w-full">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3 text-sm font-medium">{error}</div>
                )}

                {/* Stats */}
                {!isLoading && tenancies.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon={Users} label="Total Tenants" value={tenancies.length} color="text-primary" />
                        <StatCard icon={CheckCircle2} label="Active" value={active} color="text-emerald-500" />
                        <StatCard icon={Clock} label="Pending Approval" value={pending} color="text-amber-500" />
                        <StatCard
                            icon={TrendingUp}
                            label="Monthly Revenue"
                            value={totalRent > 0 ? `TZS ${(totalRent / 1000).toFixed(0)}K` : "—"}
                            color="text-blue-500"
                        />
                    </div>
                )}

                {/* Filters */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400/70"
                                placeholder="Search by tenant name, email, phone or property…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {["all", "active", "pending_owner_confirmation", "ended", "transferred"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                                        statusFilter === s
                                            ? "bg-primary text-white shadow-sm"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                                    )}
                                >
                                    {s === "all" ? "All" : s === "pending_owner_confirmation" ? "Pending" : s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Table */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium uppercase tracking-wider">Loading tenancies…</span>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Users className="h-7 w-7 text-slate-300" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-slate-600 dark:text-slate-300">
                                    {tenancies.length === 0 ? "No tenancies yet" : "No results match your filters"}
                                </p>
                                <p className="text-sm mt-1">
                                    {tenancies.length === 0
                                        ? "Confirm a tenant from the Viewings page to create a tenancy."
                                        : "Try adjusting your search or filter."}
                                </p>
                            </div>
                            {tenancies.length === 0 && (
                                <button
                                    onClick={() => router.push("/dashboard/owner/viewings")}
                                    className="mt-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all"
                                >
                                    Go to Viewings
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-225">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-5">Tenant</th>
                                        <th className="px-6 py-5">Property</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5">Rent</th>
                                        <th className="px-6 py-5">Start Date</th>
                                        <th className="px-6 py-5">Since</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filtered.map((t) => {
                                        const cfg = statusConfig[t.status] ?? statusConfig.ended
                                        const StatusIcon = cfg.icon
                                        const houseImg = t.house?.images?.[0]

                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                                {/* Tenant */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-primary/10">
                                                            {t.tenant?.avatar ? (
                                                                <Image src={t.tenant.avatar} alt="" width={40} height={40} className="object-cover w-full h-full" />
                                                            ) : (
                                                                <span className="text-xs font-bold text-primary">{tenantInitials(t.tenant)}</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{tenantName(t.tenant)}</p>
                                                            <p className="text-[10px] text-slate-400 truncate">{t.tenant?.phone ?? t.tenant?.email ?? "—"}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Property */}
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200/50">
                                                            {houseImg ? (
                                                                <Image src={houseImg} alt="" fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Home className="h-4 w-4 text-slate-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{t.house?.title ?? "—"}</p>
                                                            <p className="text-[10px] text-slate-400">{t.house?.area}, {t.house?.city}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-6">
                                                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border", cfg.className)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {cfg.label}
                                                    </span>
                                                </td>

                                                {/* Rent */}
                                                <td className="px-6 py-6">
                                                    <span className="text-sm font-medium text-slate-800 dark:text-white">
                                                        {formatRent(t.agreedRent, t.currency)}
                                                    </span>
                                                </td>

                                                {/* Start Date */}
                                                <td className="px-6 py-6 text-[11px] font-medium text-slate-500">
                                                    {formatDate(t.startDate)}
                                                </td>

                                                {/* Since */}
                                                <td className="px-6 py-6 text-[10px] font-medium text-slate-400">
                                                    {relativeTime(t.createdAt)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {t.tenant?.id && (
                                                            <button
                                                                onClick={() => router.push(`/dashboard/owner/chat`)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                                                title="Open chat"
                                                            >
                                                                <MessageSquare className="h-3 w-3" />
                                                                Chat
                                                            </button>
                                                        )}
                                                        {t.house?.id && (
                                                            <button
                                                                onClick={() => router.push(`/dashboard/owner/houses/${t.house!.id}/edit`)}
                                                                className="p-1.5 text-slate-300 hover:text-primary transition-colors"
                                                                title="View house"
                                                            >
                                                                <Home className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer count */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                                {filtered.length} tenanc{filtered.length !== 1 ? "ies" : "y"}
                                {statusFilter !== "all" || search ? ` (filtered from ${tenancies.length})` : ""}
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

// ── Sub-components ──────────────────────────────────────────────────────────
function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType
    label: string
    value: number | string
    color: string
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className={cn("size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{value}</p>
            </div>
        </div>
    )
}
