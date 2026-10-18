"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Users,
    Home,
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    Loader2,
    AlertCircle,
    RefreshCw,
    Briefcase,
    ArrowRight,
    ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { adminApi, agentsApi, toProperty, type ApiProperty, type ApiAgentProfile } from "@/lib/api"

// --- Helpers ---
function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return days === 1 ? "1d ago" : `${days}d ago`
}

// --- Page ---
export default function AdminDashboard() {
    const { user, token } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : "Admin"

    const [totalUsers, setTotalUsers] = useState(0)
    const [totalHouses, setTotalHouses] = useState(0)
    const [pendingHouses, setPendingHouses] = useState<ApiProperty[]>([])
    const [pendingAgents, setPendingAgents] = useState<ApiAgentProfile[]>([])
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingHouses, setLoadingHouses] = useState(true)
    const [loadingAgents, setLoadingAgents] = useState(true)

    const [houseAction, setHouseAction] = useState<Record<string, "approve" | "reject" | null>>({})
    const [houseLoading, setHouseLoading] = useState<Record<string, boolean>>({})
    const [agentLoading, setAgentLoading] = useState<Record<string, boolean>>({})
    const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)

    const loadData = useCallback(() => {
        if (!token) return
        setLoadingStats(true)
        setLoadingHouses(true)
        setLoadingAgents(true)

        adminApi.listUsers({ limit: 1, page: 1 }, token)
            .then((res) => setTotalUsers(res.meta.total))
            .catch(() => {})
            .finally(() => setLoadingStats(false))

        adminApi.allHousesMeta(token)
            .then((res) => setTotalHouses(res.meta?.total ?? 0))
            .catch(() => {})

        adminApi.pendingHouses(token)
            .then((res) => setPendingHouses(res.slice(0, 5)))
            .catch(() => {})
            .finally(() => setLoadingHouses(false))

        agentsApi.pendingVerification(token)
            .then((res) => setPendingAgents(res.slice(0, 5)))
            .catch(() => {})
            .finally(() => setLoadingAgents(false))
    }, [token])

    useEffect(() => { loadData() }, [loadData])

    async function handleVerify(houseId: string, approved: boolean) {
        if (!token) return
        const reason = rejectReason[houseId] ?? ""
        if (!approved && !reason.trim()) {
            setError("Please provide a reason before revoking verification.")
            return
        }
        setHouseLoading((p) => ({ ...p, [houseId]: true }))
        setError(null)
        try {
            await adminApi.verifyHouse(
                houseId,
                approved ? { approved: true } : { approved: false, rejectionReason: reason },
                token
            )
            setPendingHouses((prev) => prev.filter((h) => h.id !== houseId))
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Action failed.")
        } finally {
            setHouseLoading((p) => ({ ...p, [houseId]: false }))
            setHouseAction((p) => ({ ...p, [houseId]: null }))
        }
    }

    async function handleVerifyAgent(agentId: string, approved: boolean) {
        if (!token) return
        setAgentLoading((p) => ({ ...p, [agentId]: true }))
        setError(null)
        try {
            await agentsApi.verify(agentId, { approved }, token)
            setPendingAgents((prev) => prev.filter((a) => a.id !== agentId))
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Action failed.")
        } finally {
            setAgentLoading((p) => ({ ...p, [agentId]: false }))
        }
    }

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Platform Admin</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Karibu, {userName.split(" ")[0]}. Platform overview and quick actions.</p>
                </div>
                <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="space-y-8 px-4 pb-20">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">X</button>
                    </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard icon={Users} label="Total Users" value={totalUsers} sub="registered accounts" color="text-blue-500" bg="bg-blue-50/60" loading={loadingStats} />
                    <StatCard icon={Home} label="Total Listings" value={totalHouses} sub="all houses on platform" color="text-emerald-500" bg="bg-emerald-50/60" loading={loadingStats} />
                    <StatCard icon={ShieldCheck} label="Pending Houses" value={pendingHouses.length} sub="awaiting verification" color="text-amber-500" bg="bg-amber-50/60" loading={loadingHouses} />
                    <StatCard icon={Briefcase} label="Pending Agents" value={pendingAgents.length} sub="awaiting approval" color="text-purple-500" bg="bg-purple-50/60" loading={loadingAgents} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { href: "/dashboard/admin/users", label: "Manage Users", desc: "Search, filter and manage all accounts", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                        { href: "/dashboard/admin/houses", label: "All Listings", desc: "Browse, verify and moderate all houses", icon: Home, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { href: "/dashboard/admin/agents", label: "All Agents", desc: "Review agent profiles and verifications", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
                    ].map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                            <div className={cn("size-11 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                                <item.icon className={cn("h-5 w-5", item.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 dark:text-white uppercase tracking-tight">{item.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.desc}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white">Unverified Active Listings</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                Showing up to 5 — <Link href="/dashboard/admin/houses" className="text-primary hover:underline">view all</Link>
                            </p>
                        </div>
                        <span className="text-[9px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">Admin Only</span>
                    </div>
                    {loadingHouses ? (
                        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    ) : pendingHouses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">All caught up.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {pendingHouses.map((house) => {
                                const p = toProperty(house)
                                const isRejecting = houseAction[house.id] === "reject"
                                const busy = houseLoading[house.id]
                                return (
                                    <div key={house.id} className="px-6 py-5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <div className="flex items-start gap-5">
                                            <div className="relative size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                                                {p.images[0] ? (
                                                    <Image src={p.images[0]} alt={p.title} fill sizes="56px" className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <Home className="h-5 w-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-white truncate uppercase tracking-tight">{p.title}</p>
                                                <div className="flex flex-wrap gap-3 mt-1">
                                                    <span className="text-[10px] font-medium text-slate-400">📍 {p.location.neighborhood}, {p.location.city}</span>
                                                    <span className="text-[10px] font-medium text-slate-400">🏠 {p.propertyType} · {p.bedrooms}BR</span>
                                                    {house.owner && <span className="text-[10px] font-medium text-slate-400">👤 {house.owner.firstName} {house.owner.lastName}</span>}
                                                    <span className="text-[10px] font-medium text-slate-300 flex items-center gap-0.5"><Clock className="h-3 w-3" /> {relativeTime(p.createdAt)}</span>
                                                </div>

                                                {/* Owner verification evidence */}
                                                {(house.verificationVideoUrl || house.ownerVerificationNote) && (
                                                    <div className="mt-2 p-2.5 bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg space-y-1.5">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-500">Owner Evidence</p>
                                                        {house.verificationVideoUrl && (
                                                            <a href={house.verificationVideoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-medium text-blue-600 hover:underline break-all">
                                                                <ExternalLink className="h-3 w-3 shrink-0" /> {house.verificationVideoUrl}
                                                            </a>
                                                        )}
                                                        {house.ownerVerificationNote && (
                                                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{house.ownerVerificationNote}</p>
                                                        )}
                                                    </div>
                                                )}
                                                {isRejecting && (
                                                    <div className="mt-3">
                                                        <input type="text" placeholder="Reason for revoking verified badge..." value={rejectReason[house.id] ?? ""} onChange={(e) => setRejectReason((prev) => ({ ...prev, [house.id]: e.target.value }))} className="w-full max-w-sm text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white placeholder:text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isRejecting ? (
                                                    <>
                                                        <button disabled={busy} onClick={() => handleVerify(house.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">{busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Confirm Revoke</button>
                                                        <button disabled={busy} onClick={() => setHouseAction((pa) => ({ ...pa, [house.id]: null }))} className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button disabled={busy} onClick={() => handleVerify(house.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">{busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Verify</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white">Pending Agent Verification</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Showing up to 5 — <Link href="/dashboard/admin/agents?status=pending" className="text-primary hover:underline">view all</Link></p>
                        </div>
                        <span className="text-[9px] font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-widest">Admin Only</span>
                    </div>
                    {loadingAgents ? (
                        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    ) : pendingAgents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">All agents reviewed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {pendingAgents.map((agent) => {
                                const busy = agentLoading[agent.id]
                                const u = agent.user
                                const initials = u ? `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase() : "?"
                                return (
                                    <div key={agent.id} className="px-6 py-5 flex items-start gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="size-11 rounded-full bg-purple-50 flex items-center justify-center text-sm font-medium text-purple-600 border border-purple-100 shrink-0">{initials}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-white uppercase tracking-tight">{u ? `${u.firstName} ${u.lastName}` : agent.userId}</p>
                                            {u?.email && <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>}
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {agent.agencyName && <span className="text-[10px] text-slate-500 font-medium">🏢 {agent.agencyName}</span>}
                                                {agent.licenseNumber && <span className="text-[10px] text-slate-500 font-medium">🪪 {agent.licenseNumber}</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button disabled={busy} onClick={() => handleVerifyAgent(agent.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">{busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Approve</button>
                                            <button disabled={busy} onClick={() => handleVerifyAgent(agent.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95 disabled:opacity-50">{busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Reject</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, sub, color, bg, loading }: {
    icon: React.ElementType; label: string; value: string | number; sub: string; color: string; bg: string; loading?: boolean
}) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={cn("size-10 rounded-xl flex items-center justify-center mb-4", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</p>
            {loading ? <div className="h-7 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-1" /> : <p className="text-xl font-medium text-slate-700 dark:text-white mt-1">{value}</p>}
            <p className="text-[10px] font-medium text-slate-300 mt-0.5">{sub}</p>
        </div>
    )
}
