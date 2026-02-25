"use client"

import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Download, MoreHorizontal } from "lucide-react"
import { mockCommissions, mockUsers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AgentEarningsPage() {
    const agent = mockUsers.find(u => u.id === "user-5")!
    const commissions = mockCommissions.filter(c => c.agentId === agent.id)
    const totalEarned = commissions.reduce((acc, c) => acc + c.amount, 0)

    return (
        <div className="py-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
                <div>
                    <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Earnings & Payouts</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your performance and manage your commission history.</p>
                </div>
                <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-widest shadow-lg hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center gap-2">
                    <Download className="size-4" /> Download Statement
                </button>
            </header>

            <div className="px-4 space-y-8 pb-20">
                {/* Earnings Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign className="size-24 text-slate-400" />
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Total Earnings</p>
                        <h3 className="text-2xl font-medium text-slate-700 dark:text-white">TZS {(totalEarned / 1e6).toFixed(1)}M</h3>
                        <div className="mt-4 flex items-center gap-1.5 text-emerald-500 font-medium text-[10px]">
                            <TrendingUp className="size-3" /> +15.4% from last month
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Pending Payouts</p>
                        <h3 className="text-2xl font-medium text-slate-500 dark:text-slate-300">TZS 450k</h3>
                        <button className="mt-4 text-primary text-[10px] font-medium uppercase tracking-widest hover:underline transition-colors">Request Payout</button>
                    </div>
                    <div className="bg-primary/90 p-8 rounded-3xl shadow-xl shadow-primary/10 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ArrowUpRight className="size-16" />
                        </div>
                        <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest mb-2">Target Monthly Progress</p>
                        <h3 className="text-2xl font-medium">72%</h3>
                        <div className="w-full bg-white/20 h-1 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white h-full transition-all duration-1000" style={{ width: '72%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-medium uppercase tracking-tight text-slate-700">Recent Commissions</h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/20 text-[10px] font-medium uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-4">Ref ID</th>
                                    <th className="px-6 py-4">Property Source</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {commissions.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-5 text-[10px] font-mono font-medium text-slate-400 uppercase">#TRX-{c.id.split('-')[1]}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-700 dark:text-slate-300">{c.propertyTitle}</td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-800 dark:text-white">TZS {c.amount.toLocaleString()}</td>
                                        <td className="px-6 py-5 text-xs font-medium text-slate-400">{c.date}</td>
                                        <td className="px-6 py-5">
                                            <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100 shadow-sm">
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-slate-300 hover:text-primary transition-colors">
                                                <Download className="size-4" />
                                            </button>
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
