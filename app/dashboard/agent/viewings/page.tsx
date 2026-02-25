"use client"

import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Search, Filter } from "lucide-react"
import { mockViewings, mockUsers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AgentViewingsPage() {
    const agent = mockUsers.find(u => u.id === "user-5")!
    const viewings = mockViewings.filter(v => v.agentId === agent.id)

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Viewing Schedule</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and update status for all upcoming property tours.</p>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                    Sync with Google
                </button>
            </header>

            <div className="px-4 space-y-6 pb-20">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest px-3">Filter:</span>
                            <button className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-medium rounded-md uppercase tracking-widest transition-colors">Today</button>
                            <button className="px-3 py-1 text-slate-400 text-[10px] font-medium rounded-md uppercase tracking-widest hover:bg-slate-50 transition-colors">This Week</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-medium uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Tenant Name</th>
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {viewings.map((viewing) => (
                                    <tr key={viewing.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 flex items-center justify-center text-slate-400 font-medium text-[10px] group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {viewing.tenantName.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{viewing.tenantName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-medium text-slate-500 dark:text-slate-400">{viewing.propertyTitle}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                <Clock className="size-3.5" /> {viewing.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm border border-emerald-100">
                                                {viewing.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Mark as Completed">
                                                    <CheckCircle2 className="size-4" />
                                                </button>
                                                <button className="p-2 text-red-300 hover:bg-red-50 rounded-lg transition-all" title="Cancel">
                                                    <XCircle className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
