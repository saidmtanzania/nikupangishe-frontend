"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import {
    Users,
    Search,
    Loader2,
    AlertCircle,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Mail,
    KeyRound,
    CheckCircle2,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { adminApi, type ApiUser } from "@/lib/api"

// ─── Constants ────────────────────────────────────────────────────────────────
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

const ROLE_TABS = ["all", "owner", "agent", "tenant"] as const
const STATUS_TABS = ["all", "active", "pending", "suspended", "banned"] as const

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
    const { user: currentUser, token } = useAuth()

    const [users, setUsers] = useState<ApiUser[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
    const [resetSuccess, setResetSuccess] = useState<Record<string, string>>({})
    const [error, setError] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const LIMIT = 20

    const loadUsers = useCallback(() => {
        if (!token) return
        setLoading(true)
        const filters: Record<string, string | number> = { page, limit: LIMIT }
        if (roleFilter !== "all") filters.role = roleFilter
        if (statusFilter !== "all") filters.status = statusFilter
        adminApi.listUsers(filters as Parameters<typeof adminApi.listUsers>[0], token)
            .then((res) => {
                setUsers(res.data)
                setTotal(res.meta.total)
                setTotalPages(res.meta.totalPages)
            })
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users."))
            .finally(() => setLoading(false))
    }, [token, page, roleFilter, statusFilter])

    useEffect(() => { loadUsers() }, [loadUsers])

    // Reset page when filters change
    useEffect(() => { setPage(1) }, [roleFilter, statusFilter])

    const filteredUsers = search
        ? users.filter((u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        : users

    async function handleStatus(userId: string, status: "active" | "suspended" | "banned") {
        if (!token) return
        setActionLoading((p) => ({ ...p, [userId]: true }))
        setActionError(null)
        const prev = users
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u))
        try {
            await adminApi.updateUserStatus(userId, status, token)
        } catch (e) {
            setUsers(prev)
            setActionError(e instanceof Error ? e.message : "Status update failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [userId]: false }))
        }
    }

    async function handleRole(userId: string, role: "owner" | "agent" | "tenant") {
        if (!token) return
        setActionLoading((p) => ({ ...p, [`${userId}-role`]: true }))
        setActionError(null)
        const prev = users
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
        try {
            await adminApi.updateUserRole(userId, role, token)
        } catch (e) {
            setUsers(prev)
            setActionError(e instanceof Error ? e.message : "Role update failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [`${userId}-role`]: false }))
        }
    }

    async function handlePasswordReset(userId: string) {
        if (!token) return
        setActionLoading((p) => ({ ...p, [`${userId}-reset`]: true }))
        setActionError(null)
        try {
            await adminApi.sendPasswordReset(userId, token)
            setResetSuccess((p) => ({ ...p, [userId]: "Reset sent!" }))
            setTimeout(() => setResetSuccess((p) => { const n = { ...p }; delete n[userId]; return n }), 4000)
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Failed to send reset.")
        } finally {
            setActionLoading((p) => ({ ...p, [`${userId}-reset`]: false }))
        }
    }

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">User Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} registered user{total !== 1 ? "s" : ""}</p>
                </div>
                <button onClick={loadUsers} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
            </header>

            <div className="space-y-5 px-4 pb-20">
                {(error || actionError) && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error ?? actionError}</span>
                        <button onClick={() => { setError(null); setActionError(null) }} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-4">
                    {/* Role */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        {ROLE_TABS.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRoleFilter(r)}
                                className={cn(
                                    "px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all",
                                    roleFilter === r
                                        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    {/* Status */}
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
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Users className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">No users found.</p>
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
                                    {filteredUsers.map((u) => {
                                        const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()
                                        const isSelf = u.id === currentUser?.id
                                        const busy = actionLoading[u.id]
                                        const roleBusy = actionLoading[`${u.id}-role`]
                                        const resetBusy = actionLoading[`${u.id}-reset`]
                                        const resetDone = resetSuccess[u.id]
                                        return (
                                            <tr key={u.id} className={cn("hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", isSelf && "opacity-60")}>
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
                                                <td className="px-4 py-4">
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", ROLE_COLORS[u.role] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", STATUS_COLORS[u.status] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-[10px] font-medium text-slate-400">
                                                        {u.isEmailVerified ? "✓ Email" : "—"}
                                                        {u.isPhoneVerified ? " · ✓ Phone" : ""}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isSelf ? (
                                                        <span className="text-[10px] text-slate-300 font-medium float-right">—</span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                                            {/* Status actions */}
                                                            {busy ? <Loader2 className="h-4 w-4 animate-spin text-slate-300" /> : (
                                                                <>
                                                                    {u.status !== "active" && (
                                                                        <button onClick={() => handleStatus(u.id, "active")} className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all">Activate</button>
                                                                    )}
                                                                    {u.status !== "suspended" && (
                                                                        <button onClick={() => handleStatus(u.id, "suspended")} className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-100 rounded-lg hover:bg-orange-100 transition-all">Suspend</button>
                                                                    )}
                                                                    {u.status !== "banned" && (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (window.confirm(`Ban ${u.firstName} ${u.lastName}? They will not be able to log in.`)) {
                                                                                    handleStatus(u.id, "banned")
                                                                                }
                                                                            }}
                                                                            className="px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-all"
                                                                        >
                                                                            Ban
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                            {/* Role change */}
                                                            {roleBusy ? <Loader2 className="h-4 w-4 animate-spin text-slate-300" /> : u.role !== "admin" && (
                                                                <select
                                                                    value={u.role}
                                                                    onChange={(e) => handleRole(u.id, e.target.value as "owner" | "agent" | "tenant")}
                                                                    className="text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/30"
                                                                >
                                                                    <option value="owner">Owner</option>
                                                                    <option value="agent">Agent</option>
                                                                    <option value="tenant">Tenant</option>
                                                                </select>
                                                            )}
                                                            {/* Password reset */}
                                                            {resetDone ? (
                                                                <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-600">
                                                                    <CheckCircle2 className="h-3 w-3" /> Sent
                                                                </span>
                                                            ) : resetBusy ? (
                                                                <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                                                            ) : (
                                                                <button
                                                                    onClick={() => handlePasswordReset(u.id)}
                                                                    title="Send password reset email"
                                                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                                >
                                                                    <KeyRound className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                            {/* Email copy */}
                                                            <a href={`mailto:${u.email}`} title="Email user" className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                                <Mail className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                            Page {page} of {totalPages} · {total} users
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
