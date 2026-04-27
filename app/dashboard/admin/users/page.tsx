"use client"

import { useState, useEffect, useCallback, memo } from "react"
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

const ROLE_TABS = ["all", "owner", "agent", "tenant"] as const
const STATUS_TABS = ["all", "active", "pending", "suspended", "banned"] as const

// ─── Memoised row — only re-renders when its own data changes ─────────────────
interface UserRowProps {
    u: ApiUser
    isSelf: boolean
    busy: boolean
    roleBusy: boolean
    resetBusy: boolean
    resetDone: boolean
    isBanConfirm: boolean
    onStatus: (id: string, status: "active" | "suspended" | "banned") => void
    onRole: (id: string, role: "owner" | "agent" | "tenant") => void
    onPasswordReset: (id: string) => void
    onBanConfirm: (id: string | null) => void
}

const UserRow = memo(function UserRow({
    u, isSelf, busy, roleBusy, resetBusy, resetDone, isBanConfirm,
    onStatus, onRole, onPasswordReset, onBanConfirm,
}: UserRowProps) {
    const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()

    return (
        <tr className={cn("hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors", isSelf && "opacity-60")}>
            {/* User */}
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
            {/* Role badge */}
            <td className="px-4 py-4">
                <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest", ROLE_COLORS[u.role] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                    {u.role}
                </span>
            </td>
            {/* Status badge */}
            <td className="px-4 py-4">
                <span className={cn(
                    "text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest",
                    u.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    u.status === "suspended" ? "bg-orange-50 text-orange-600 border-orange-100" :
                    u.status === "banned" ? "bg-red-50 text-red-600 border-red-100" :
                    "bg-amber-50 text-amber-600 border-amber-100"
                )}>
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
                {isSelf ? (
                    <span className="text-[10px] text-slate-300 font-medium float-right">—</span>
                ) : (
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                        {/* Status select */}
                        <div className="relative flex items-center">
                            <select
                                value={u.status}
                                disabled={busy}
                                onChange={(e) => {
                                    const next = e.target.value as "active" | "suspended" | "banned" | "pending"
                                    if (next === "banned") {
                                        onBanConfirm(u.id)
                                    } else {
                                        onStatus(u.id, next as "active" | "suspended")
                                    }
                                }}
                                className={cn(
                                    "text-[9px] font-medium uppercase tracking-widest border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-opacity appearance-none pr-5",
                                    busy ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                    u.status === "active" ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
                                    u.status === "suspended" ? "bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" :
                                    u.status === "banned" ? "bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" :
                                    "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                                )}
                            >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="suspended">Suspended</option>
                                <option value="banned">Banned</option>
                            </select>
                            {busy && <Loader2 className="absolute right-1 h-3 w-3 animate-spin text-slate-400 pointer-events-none" />}
                        </div>
                        {/* Inline ban confirmation */}
                        {isBanConfirm && (
                            <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2 py-1">
                                <span className="text-[9px] font-medium text-red-600 uppercase tracking-widest whitespace-nowrap">Ban {u.firstName}?</span>
                                <button onClick={() => onStatus(u.id, "banned")} className="text-[9px] font-semibold text-red-600 hover:text-red-800 uppercase tracking-widest">Yes</button>
                                <span className="text-red-200">·</span>
                                <button onClick={() => onBanConfirm(null)} className="text-[9px] font-medium text-slate-400 hover:text-slate-600 uppercase tracking-widest">No</button>
                            </div>
                        )}
                        {/* Role select */}
                        {u.role !== "admin" && (
                            <div className="relative flex items-center">
                                <select
                                    value={u.role}
                                    disabled={roleBusy}
                                    onChange={(e) => onRole(u.id, e.target.value as "owner" | "agent" | "tenant")}
                                    className={cn(
                                        "text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-opacity appearance-none pr-5",
                                        roleBusy ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                                    )}
                                >
                                    <option value="owner">Owner</option>
                                    <option value="agent">Agent</option>
                                    <option value="tenant">Tenant</option>
                                </select>
                                {roleBusy && <Loader2 className="absolute right-1 h-3 w-3 animate-spin text-slate-400 pointer-events-none" />}
                            </div>
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
                                onClick={() => onPasswordReset(u.id)}
                                title="Send password reset email"
                                className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            >
                                <KeyRound className="h-3.5 w-3.5" />
                            </button>
                        )}
                        {/* Email */}
                        <a href={`mailto:${u.email}`} title="Email user" className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <Mail className="h-3.5 w-3.5" />
                        </a>
                    </div>
                )}
            </td>
        </tr>
    )
})

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
    const [resetSuccess, setResetSuccess] = useState<Record<string, boolean>>({})
    const [banConfirm, setBanConfirm] = useState<string | null>(null)
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
    useEffect(() => { setPage(1) }, [roleFilter, statusFilter])

    // Stable handlers — depend only on token so UserRow memos stay valid across re-renders
    const handleStatus = useCallback(async (userId: string, status: "active" | "suspended" | "banned") => {
        if (!token) return
        setBanConfirm(null)
        setActionLoading((p) => ({ ...p, [userId]: true }))
        setActionError(null)
        // Capture snapshot inside the updater — avoids stale closure over `users`
        let snapshot: ApiUser[] = []
        setUsers((cur) => { snapshot = cur; return cur.map((u) => u.id === userId ? { ...u, status } : u) })
        try {
            await adminApi.updateUserStatus(userId, status, token)
        } catch (e) {
            setUsers(snapshot)
            setActionError(e instanceof Error ? e.message : "Status update failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [userId]: false }))
        }
    }, [token])

    const handleRole = useCallback(async (userId: string, role: "owner" | "agent" | "tenant") => {
        if (!token) return
        setActionLoading((p) => ({ ...p, [`${userId}-role`]: true }))
        setActionError(null)
        let snapshot: ApiUser[] = []
        setUsers((cur) => { snapshot = cur; return cur.map((u) => u.id === userId ? { ...u, role } : u) })
        try {
            await adminApi.updateUserRole(userId, role, token)
        } catch (e) {
            setUsers(snapshot)
            setActionError(e instanceof Error ? e.message : "Role update failed.")
        } finally {
            setActionLoading((p) => ({ ...p, [`${userId}-role`]: false }))
        }
    }, [token])

    const handlePasswordReset = useCallback(async (userId: string) => {
        if (!token) return
        setActionLoading((p) => ({ ...p, [`${userId}-reset`]: true }))
        setActionError(null)
        try {
            await adminApi.sendPasswordReset(userId, token)
            setResetSuccess((p) => ({ ...p, [userId]: true }))
            setTimeout(() => setResetSuccess((p) => { const n = { ...p }; delete n[userId]; return n }), 4000)
        } catch (e) {
            setActionError(e instanceof Error ? e.message : "Failed to send reset.")
        } finally {
            setActionLoading((p) => ({ ...p, [`${userId}-reset`]: false }))
        }
    }, [token])

    const filteredUsers = search
        ? users.filter((u) =>
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        : users

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
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        {ROLE_TABS.map((r) => (
                            <button key={r} onClick={() => setRoleFilter(r)} className={cn("px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all", roleFilter === r ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white")}>
                                {r}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        {STATUS_TABS.map((s) => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all", statusFilter === s ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white")}>
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
                                    {filteredUsers.map((u) => (
                                        <UserRow
                                            key={u.id}
                                            u={u}
                                            isSelf={u.id === currentUser?.id}
                                            busy={!!actionLoading[u.id]}
                                            roleBusy={!!actionLoading[`${u.id}-role`]}
                                            resetBusy={!!actionLoading[`${u.id}-reset`]}
                                            resetDone={!!resetSuccess[u.id]}
                                            isBanConfirm={banConfirm === u.id}
                                            onStatus={handleStatus}
                                            onRole={handleRole}
                                            onPasswordReset={handlePasswordReset}
                                            onBanConfirm={setBanConfirm}
                                        />
                                    ))}
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
