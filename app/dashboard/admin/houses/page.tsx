"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Home,
    Search,
    Loader2,
    AlertCircle,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Trash2,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { adminApi, toProperty, type ApiProperty } from "@/lib/api"

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_TABS = ["all", "pending_verification", "active", "draft", "rejected", "rented", "inactive"] as const
const STATUS_LABELS: Record<string, string> = {
    all: "All",
    pending_verification: "Pending",
    active: "Active",
    draft: "Draft",
    rejected: "Rejected",
    rented: "Rented",
    inactive: "Inactive",
}
const STATUS_COLORS: Record<string, string> = {
    pending_verification: "bg-amber-50 text-amber-600 border-amber-100",
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    draft: "bg-slate-50 text-slate-500 border-slate-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
    rented: "bg-blue-50 text-blue-600 border-blue-100",
    inactive: "bg-slate-100 text-slate-400 border-slate-200",
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminHousesPage() {
    const { token } = useAuth()
    const searchParams = useSearchParams()
    const initialStatus = searchParams.get("status") ?? "all"

    const [houses, setHouses] = useState<ApiProperty[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus)

    const [loading, setLoading] = useState(true)
    const [houseAction, setHouseAction] = useState<Record<string, "approve" | "reject" | null>>({})
    const [houseLoading, setHouseLoading] = useState<Record<string, boolean>>({})
    const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({})
    const [error, setError] = useState<string | null>(null)

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState("")

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400)
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
    }, [search])

    const loadHouses = useCallback(() => {
        if (!token) return
        setLoading(true)
        adminApi.adminListHouses(
            { status: statusFilter === "all" ? undefined : statusFilter, search: debouncedSearch || undefined, page, limit: 20 },
            token
        )
            .then((res) => {
                setHouses(res.data)
                setTotal(res.meta.total)
                setTotalPages(res.meta.totalPages)
            })
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load houses."))
            .finally(() => setLoading(false))
    }, [token, page, statusFilter, debouncedSearch])

    useEffect(() => { loadHouses() }, [loadHouses])
    useEffect(() => { setPage(1) }, [statusFilter, debouncedSearch])

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
            // Update isVerified badge only — listing status stays unchanged
            setHouses((prev) => prev.map((h) => h.id === houseId ? { ...h, isVerified: approved } : h))
        } catch (e) {
            setError(e instanceof Error ? e.message : "Action failed.")
        } finally {
            setHouseLoading((p) => ({ ...p, [houseId]: false }))
            setHouseAction((p) => ({ ...p, [houseId]: null }))
        }
    }

    async function handleDelete(houseId: string) {
        if (!token) return
        setDeleteLoading((p) => ({ ...p, [houseId]: true }))
        setError(null)
        try {
            await adminApi.deleteHouse(houseId, token)
            setHouses((prev) => prev.filter((h) => h.id !== houseId))
            setTotal((t) => t - 1)
        } catch (e) {
            setError(e instanceof Error ? e.message : "Delete failed.")
        } finally {
            setDeleteLoading((p) => ({ ...p, [houseId]: false }))
            setDeleteConfirm(null)
        }
    }

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">All Listings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} house{total !== 1 ? "s" : ""} on platform</p>
                </div>
                <button onClick={loadHouses} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
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

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                </div>

                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-wrap">
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
                            {STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>

                {/* House list */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                        </div>
                    ) : houses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Home className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-medium text-slate-400">No listings found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {houses.map((house) => {
                                const p = toProperty(house)
                                const houseStatus = house.status ?? "active"
                                const isVerified = !!house.isVerified
                                // Revoking = removing the verified badge from a verified listing
                                const isRevoking = houseAction[house.id] === "reject"
                                const isRejecting = isRevoking
                                const busy = houseLoading[house.id]
                                const delBusy = deleteLoading[house.id]
                                const confirmingDelete = deleteConfirm === house.id
                                return (
                                    <div key={house.id} className="px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-start gap-4">
                                            {/* Thumbnail */}
                                            <div className="relative size-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                                                {p.images[0] ? (
                                                    <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <Home className="h-5 w-5 text-slate-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2 flex-wrap">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-white uppercase tracking-tight truncate">{p.title}</p>
                                                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest shrink-0", STATUS_COLORS[houseStatus] ?? "bg-slate-50 text-slate-500 border-slate-100")}>
                                                        {STATUS_LABELS[houseStatus] ?? houseStatus}
                                                    </span>
                                                    {isVerified && (
                                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border uppercase tracking-widest shrink-0 bg-blue-50 text-blue-600 border-blue-100">✓ Verified</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-3 mt-1">
                                                    <span className="text-[10px] font-medium text-slate-400">📍 {p.location.neighborhood}, {p.location.city}</span>
                                                    <span className="text-[10px] font-medium text-slate-400">🏠 {p.propertyType} · {p.bedrooms}BR</span>
                                                    {house.owner && <span className="text-[10px] font-medium text-slate-400">👤 {house.owner.firstName} {house.owner.lastName}</span>}
                                                    <span className="text-[10px] font-medium text-slate-400">💵 {house.currency ?? "TZS"} {p.price.toLocaleString()}/mo</span>
                                                </div>

                                                {/* Owner verification evidence */}
                                                {(house.verificationVideoUrl || house.ownerVerificationNote) && (
                                                    <div className="mt-3 p-3 bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg space-y-2">
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-500">Owner Verification Evidence</p>
                                                        {house.verificationVideoUrl && (
                                                            <a
                                                                href={house.verificationVideoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[10px] font-medium text-blue-600 hover:underline break-all"
                                                            >
                                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                                                {house.verificationVideoUrl}
                                                            </a>
                                                        )}
                                                        {house.ownerVerificationNote && (
                                                            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{house.ownerVerificationNote}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {isRevoking && (
                                                    <div className="mt-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Reason for revoking verified badge..."
                                                            value={rejectReason[house.id] ?? ""}
                                                            onChange={(e) => setRejectReason((prev) => ({ ...prev, [house.id]: e.target.value }))}
                                                            className="w-full max-w-sm text-xs border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-300 dark:bg-slate-800 dark:border-slate-600 dark:text-white placeholder:text-slate-400"
                                                        />
                                                    </div>
                                                )}

                                                {confirmingDelete && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <p className="text-xs font-medium text-red-600">Delete this listing permanently?</p>
                                                        <button onClick={() => handleDelete(house.id)} disabled={delBusy} className="flex items-center gap-1 px-3 py-1 text-[10px] font-medium uppercase tracking-widest bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50">
                                                            {delBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Yes, Delete
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-all">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                                {/* Verify badge — only shown on active, unverified listings */}
                                                {houseStatus === "active" && !isVerified && !isRevoking && (
                                                    <button disabled={busy} onClick={() => handleVerify(house.id, true)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Verify
                                                    </button>
                                                )}
                                                {/* Revoke badge — shown on verified listings */}
                                                {isVerified && !isRevoking && (
                                                    <button disabled={busy} onClick={() => setHouseAction((pa) => ({ ...pa, [house.id]: "reject" }))} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                        <XCircle className="h-3 w-3" /> Revoke
                                                    </button>
                                                )}
                                                {isRevoking && (
                                                    <>
                                                        <button disabled={busy} onClick={() => handleVerify(house.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95 disabled:opacity-50">
                                                            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Confirm Revoke
                                                        </button>
                                                        <button disabled={busy} onClick={() => setHouseAction((pa) => ({ ...pa, [house.id]: null }))} className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-600 text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                                                    </>
                                                )}
                                                <Link
                                                    href={`/properties/${house.id.slice(0, 8)}`}
                                                    target="_blank"
                                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                    title="View property"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Link>
                                                {!confirmingDelete && (
                                                    <button
                                                        onClick={() => setDeleteConfirm(house.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete listing"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
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
                            Page {page} of {totalPages} · {total} listings
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
