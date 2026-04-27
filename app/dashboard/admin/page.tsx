"use client"

import { useState, useEffect, useCallback } from "react"
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
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { adminApi, agentsApi, toProperty, type ApiUser, type ApiProperty, type ApiAgentProfile } from "@/lib/api"

// ─── Helpers ─────────────────────────────────────────────────────────────────
function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return days === 1 ? "1d ago" : `${days}d ago`
}

const ROLE_COLORS: Record<string, string> = {
    owner: "bg-blue-50 text-blue-600 border-blue-100",
    agent: "bg-purple-50 text-purple-600 border-purple-100",
    tenant: "bg-slate-50 text-slate-600 border-slate-100",
    admin: "bg-primary/10 text-primary border-primary/20",
}

const STATUS_COLORS: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    suspended: "bg-orange-50 text-orange-600 border-orange-100",
    banned: "bg-red-50 text-red-600 border-red-100",
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user, token } = useAuth()
    const userName = user ? `${user.firstName} ${user.lastName}` : "Admin"

    // ── State ──
    const [users, setUsers] = useState<ApiUser[]>([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [pendingHouses, setPendingHouses] = useState<ApiProperty[]>([])
    const [totalHouses, setTotalHouses] = useState(0)
    const [pendingAgents, setPendingAgents] = useState<ApiAgentProfile[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingHouses, setLoadingHouses] = useState(true)
    const [loadingAgents, setLoadingAgents] = useState(true)

    // Per-row action state
    const [houseAction, setHouseAction] = useState<Record<string, "approve" | "reject" | null>>({})
    const [agentLoading, setAgentLoading] = useState<Record<string, boolean>>({})
    const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
    const [houseLoading, setHouseLoading] = useState<Record<string, boolean>>({})
    const [userLoading, setUserLoading] = useState<Record<string, boolean>>({})
    const [error, setError] = useState<string | null>(null)

    // ── Fetch ──
    const loadData = useCallback(() => {
        if (!token) return
        setLoadingUsers(true)
        setLoadingHouses(true)

        adminApi.listUsers({ limit: 50, page: 1 }, token)
            .then((res) => {
                setUsers(res.data)
                setTotalUsers(res.meta.total)
            })
            .catch(() => {})
            .finally(() => setLoadingUsers(false))

        adminApi.pendingHouses(token)
            .then((res) => setPendingHouses(res))
            .catch(() => {})
            .finally(() => setLoadingHouses(false))

        adminApi.allHousesMeta(token)
            .then((res) => setTotalHouses(res.meta?.total ?? 0))
            .catch(() => {})

        agentsApi.pendingVerification(token)
            .then((res) => setPendingAgents(res))
            .catch(() => {})
            .finally(() => setLoadingAgents(false))
    }, [token])

    useEffect(() => { loadData() }, [loadData])

    // ── House verification ──
    async function handleVerify(houseId: string, approved: boolean) {
        if (!token) return
        const reason = rejectReason[houseId] ?? ""
        if (!approved && !reason.trim()) {
            setError("Please provide a rejection reason before rejecting.")
            return
        }
        setHouseLoading((p) => ({ ...p, [houseId]: true }))
        setError(null)
        try {
            await adminApi.verifyHouse(
                houseId,
                approved
                    ? { approved: true }
                    : { approved: false, rejectionReason: reason },
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

    // ── Agent verification ──
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

    // ── User status ──
    async function handleUserStatus(userId: string, status: "active" | "suspended" | "banned") {
        if (!token) return
        setUserLoading((p) => ({ ...p, [userId]: true }))
        setError(null)
        // Optimistic update
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u))
        try {
            await adminApi.updateUserStatus(userId, status, token)
        } catch (e: unknown) {
            // Revert on error
            loadData()
            setError(e instanceof Error ? e.message : "Status update failed.")
        } finally {
            setUserLoading((p) => ({ ...p, [userId]: false }))
        }
    }

    // ── Stats ──
    const activeUsers = users.filter((u) => u.status === "active").length

    return (
        <div className="py-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">
                        Platform Admin
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Karibu, {userName.split(" ")[0]}. Manage users, verify listings, and monitor the platform.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                >
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="space-y-8 px-4 pb-20">
                {/* Error banner */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={totalUsers}
                        sub={`${activeUsers} active`}
                        color="text-blue-500"
                        bg="bg-blue-50/60"
                        loading={loadingUsers}
                    />
                    <StatCard
                        icon={ShieldCheck}
                        label="Pending Houses"
                        value={pendingHouses.length}
                        sub="listings awaiting verification"
                        color="text-amber-500"
                        bg="bg-amber-50/60"
                        loading={loadingHouses}
                    />
                    <StatCard
                        icon={Briefcase}
                        label="Pending Agents"
                        value={pendingAgents.length}
                        sub="agents awaiting verification"
                        color="text-purple-500"
                        bg="bg-purple-50/60"
                        loading={loadingAgents}
                    />
                    <StatCard
                        icon={Home}
                        label="Total Listings"
                        value={totalHouses}
                        sub="all houses on platform"
                        color="text-emerald-500"
                        bg="bg-emerald-50/60"
                        loading={loadingHouses}
                    />
                </div>

                {/* Pending House Verification */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white">
                                Pending Verification
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {pendingHouses.length} house{pendingHouses.length !== 1 ? "s" : ""} awaiting your decision
                            </p>
                        </div>
                        <span className="text-[9px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest">
                            Admin Only
                        </span>
                    </div>

                    {loadingHouses ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : pendingHouses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">All caught up — no pending listings.</p>
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
                                            {/* Thumbnail */}
                                            <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm">
                                                <Image
                                                    src={p.images[0]}
                                                    alt={p.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-white truncate uppercase tracking-tight">
                                                    {p.title}
                                                </p>
                                                <div className="flex flex-wrap gap-3 mt-1.5">
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        📍 {p.location.neighborhood}, {p.location.city}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        🏠 {p.propertyType} · {p.bedrooms}BR
                                                    </span>
                                                    {house.owner && (
                                                        <span className="text-[10px] font-medium text-slate-400">
                                                            👤 {house.owner.firstName} {house.owner.lastName}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-medium text-slate-300">
                                                        <Clock className="h-3 w-3 inline mr-0.5" />
                                                        {relativeTime(p.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Reject reason input */}
                                                {isRejecting && (
                                                    <div className="mt-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Reason for rejection…"
                                                            value={rejectReason[house.id] ?? ""}
                                                            onChange={(e) =>
                                                                setRejectReason((p) => ({ ...p, [house.id]: e.target.value }))
                                                            }
                                                            className="w-full max-w-sm text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white placeholder:text-slate-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                {isRejecting ? (
                                                    <>
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => handleVerify(house.id, false)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                                                            Confirm Reject
                                                        </button>
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => setHouseAction((p) => ({ ...p, [house.id]: null }))}
                                                            className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => handleVerify(house.id, true)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-emerald-200"
                                                        >
                                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => setHouseAction((p) => ({ ...p, [house.id]: "reject" }))}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            <XCircle className="h-3 w-3" />
                                                            Reject
                                                        </button>
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

                {/* Agent Verification */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white">Agent Verification</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {pendingAgents.length} agent{pendingAgents.length !== 1 ? "s" : ""} awaiting approval
                            </p>
                        </div>
                        <span className="text-[9px] font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-widest">Admin Only</span>
                    </div>
                    {loadingAgents ? (
                        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                    ) : pendingAgents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">All agents have been reviewed.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {pendingAgents.map((agent) => {
                                const busy = agentLoading[agent.id]
                                const u = agent.user
                                const initials = u ? `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase() : "?"
                                return (
                                    <div key={agent.id} className="px-6 py-5 flex items-start gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center text-sm font-medium text-purple-600 border border-purple-100 shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-white uppercase tracking-tight">
                                                {u ? `${u.firstName} ${u.lastName}` : agent.userId}
                                            </p>
                                            {u?.email && <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>}
                                            <div className="flex flex-wrap gap-3 mt-1.5">
                                                {agent.agencyName && (
                                                    <span className="text-[10px] text-slate-500 font-medium">🏢 {agent.agencyName}</span>
                                                )}
                                                {agent.licenseNumber && (
                                                    <span className="text-[10px] text-slate-500 font-medium">🪪 License: {agent.licenseNumber}</span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> Commission: {agent.commissionRate}%
                                                </span>
                                            </div>
                                            {agent.bio && (
                                                <p className="text-[10px] text-slate-400 mt-1.5 italic line-clamp-2">{agent.bio}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button disabled={busy} onClick={() => handleVerifyAgent(agent.id, true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 shadow-sm shadow-emerald-200">
                                                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Approve
                                            </button>
                                            <button disabled={busy} onClick={() => handleVerifyAgent(agent.id, false)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Reject
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* Users Management */}
                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                        <div>
                            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-800 dark:text-white">
                                User Management
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                {totalUsers} registered user{totalUsers !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    {loadingUsers ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-sm text-slate-400">No users found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-50 dark:border-slate-800">
                                        <th className="text-left px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">User</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Role</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Verified</th>
                                        <th className="text-right px-6 py-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {users.map((u) => {
                                        const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()
                                        const busy = userLoading[u.id]
                                        const isSelf = u.id === user?.id
                                        return (
                                            <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                {/* User info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary border border-white shadow-sm shrink-0">
                                                            {initials}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-700 dark:text-white truncate">
                                                                {u.firstName} {u.lastName}
                                                                {isSelf && <span className="ml-1.5 text-[9px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-widest">You</span>}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Role */}
                                                <td className="px-4 py-4">
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", ROLE_COLORS[u.role] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                {/* Status */}
                                                <td className="px-4 py-4">
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", STATUS_COLORS[u.status] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                {/* Verified */}
                                                <td className="px-4 py-4">
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        {u.isEmailVerified ? "✓ Email" : "—"}
                                                        {u.isPhoneVerified ? " · ✓ Phone" : ""}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isSelf ? (
                                                            <span className="text-[10px] text-slate-300 font-medium">—</span>
                                                        ) : busy ? (
                                                            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                                        ) : (
                                                            <>
                                                                {u.status !== "active" && (
                                                                    <button
                                                                        onClick={() => handleUserStatus(u.id, "active")}
                                                                        className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all"
                                                                    >
                                                                        Activate
                                                                    </button>
                                                                )}
                                                                {u.status !== "suspended" && (
                                                                    <button
                                                                        onClick={() => handleUserStatus(u.id, "suspended")}
                                                                        className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 rounded-lg hover:bg-orange-100 transition-all"
                                                                    >
                                                                        Suspend
                                                                    </button>
                                                                )}
                                                                {u.status !== "banned" && (
                                                                    <button
                                                                        onClick={() => handleUserStatus(u.id, "banned")}
                                                                        className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                                                                    >
                                                                        Ban
                                                                    </button>
                                                                )}
                                                            </>
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
                </section>
            </div>
        </div>
    )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
    bg,
    loading,
}: {
    icon: React.ElementType
    label: string
    value: string | number
    sub: string
    color: string
    bg: string
    loading?: boolean
}) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className={cn("size-10 rounded-xl flex items-center justify-center mb-4", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</p>
            {loading ? (
                <div className="h-7 w-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-1" />
            ) : (
                <p className="text-xl font-medium text-slate-700 dark:text-white mt-1">{value}</p>
            )}
            <p className="text-[10px] font-medium text-slate-300 mt-0.5">{sub}</p>
        </div>
    )
}
