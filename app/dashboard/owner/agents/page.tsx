"use client"

import { useEffect, useMemo, useState } from "react"
import { Users, Search, Star, MessageSquare, Phone, MoreHorizontal, Building2 } from "lucide-react"
import { agentsApi, type ApiAgentProfile } from "@/lib/api"

const agentName = (a: ApiAgentProfile) =>
    a.name ?? (a.user ? `${a.user.firstName} ${a.user.lastName}`.trim() : "Agent")

export default function OwnerAgentsPage() {
    const [allAgents, setAllAgents] = useState<ApiAgentProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        agentsApi
            .list({ limit: 100 })
            .then((res) => setAllAgents(res.data))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load agents."))
            .finally(() => setLoading(false))
    }, [])

    const agents = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return allAgents
        return allAgents.filter((a) =>
            [agentName(a), a.agencyName, a.phone ?? a.user?.phone]
                .some((v) => v?.toLowerCase().includes(q))
        )
    }, [allAgents, search])

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Verified Agents</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional agents to help manage and rent your properties.</p>
                </div>
                <div className="relative w-full md:w-72 font-medium">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-normal"
                    />
                </div>
            </header>

            <div className="px-4 pb-20">
                {loading ? (
                    <p className="py-24 text-center text-sm font-medium text-slate-400">Loading agents…</p>
                ) : error ? (
                    <p className="py-24 text-center text-sm font-medium text-red-500">{error}</p>
                ) : agents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                            <div key={agent.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 group hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-medium text-lg shadow-inner border border-slate-100 group-hover:text-primary transition-colors">
                                            {agentName(agent).split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-700 dark:text-white group-hover:text-primary transition-colors">{agentName(agent)}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{Number(agent.rating).toFixed(1)} • {agent.totalCompletedDeals} Deals</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal className="size-5" />
                                    </button>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100/50">
                                            <Phone className="size-3.5" />
                                        </div>
                                        {agent.phone ?? agent.user?.phone ?? "—"}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100/50">
                                            <Building2 className="size-3.5" />
                                        </div>
                                        {agent.agencyName ?? "Independent agent"}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white text-[10px] font-medium rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">Assign to Property</button>
                                    <button className="size-12 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 transition-all text-slate-300 hover:text-primary active:scale-95 border border-slate-100 dark:border-slate-800">
                                        <MessageSquare className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Users className="size-16 text-slate-200 mb-4" />
                        <p className="text-sm font-medium text-slate-400">{search ? "No agents match your search." : "No verified agents available yet."}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
