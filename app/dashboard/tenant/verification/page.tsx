"use client"

import { Shield, ShieldCheck, CheckCircle2, Star, UserCheck, Smartphone, Mail, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TenantVerificationPage() {
    return (
        <div className="py-12">
            <header className="mb-10 px-4">
                <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Trust Center</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Build your tenant profile and increase your chances of approval.</p>
            </header>

            <div className="px-4 max-w-4xl space-y-8 pb-20">
                {/* Trust Score Header */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Shield className="size-64 text-primary" />
                    </div>
                    <div className="relative text-center md:text-left">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-3">Your Trust Score</p>
                        <h3 className="text-6xl font-medium text-slate-800 dark:text-white mb-2">850</h3>
                        <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest">Tier 1: Gold Tenant</span>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h4 className="font-medium uppercase tracking-widest text-[10px] mb-4 text-slate-400">Benchmark Analysis</h4>
                        <div className="space-y-4">
                            <BenchmarkItem label="Payment History" progress={100} />
                            <BenchmarkItem label="Identity Verified" progress={100} />
                            <BenchmarkItem label="Owner Reviews" progress={65} />
                        </div>
                    </div>
                </div>

                {/* Verification Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChecklistItem
                        icon={Smartphone}
                        title="Phone Verified"
                        desc="Connected to +255 713 **** 789"
                        completed
                    />
                    <ChecklistItem
                        icon={Mail}
                        title="Email Verified"
                        desc="Linked to baraka@example.com"
                        completed
                    />
                    <ChecklistItem
                        icon={UserCheck}
                        title="Identity Verified"
                        desc="NIDA verification complete"
                        completed
                    />
                    <ChecklistItem
                        icon={Star}
                        title="Employment Proof"
                        desc="Last 3 month bank statements"
                        completed={false}
                    />
                </div>

                {/* Perks Box */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900/50">
                            <Star className="size-5" />
                        </div>
                        <h3 className="text-lg font-medium uppercase tracking-tight text-slate-800 dark:text-white">Unlocked Perks</h3>
                    </div>
                    <ul className="space-y-4">
                        <PerkItem text="Priority status on all viewing requests" />
                        <PerkItem text="Access to 'Exchange' marketplace" />
                        <PerkItem text="Reduced security deposit requirement (up to 20% off)" />
                        <PerkItem disabled text="Instant Rent Loans (Requires 900+ score)" />
                    </ul>
                </div>
            </div>
        </div>
    )
}

function BenchmarkItem({ label, progress }: any) {
    return (
        <div>
            <div className="flex justify-between text-[9px] font-medium uppercase tracking-widest mb-1.5 text-slate-500">
                <span>{label}</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-white dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                <div className="bg-primary/60 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}

function ChecklistItem({ icon: Icon, title, desc, completed }: any) {
    return (
        <div className={cn(
            "p-6 rounded-2xl border flex items-start gap-4 transition-all duration-500 group",
            completed ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm" : "bg-slate-50/50 dark:bg-slate-800/30 border-dashed border-slate-200 dark:border-slate-700 opacity-60"
        )}>
            <div className={cn(
                "size-12 rounded-xl flex items-center justify-center transition-all",
                completed ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100" : "bg-slate-100 dark:bg-slate-800 text-slate-300"
            )}>
                <Icon className="size-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    {title}
                    {completed && <CheckCircle2 className="size-3.5 text-emerald-500" />}
                </h4>
                <p className="text-[11px] font-normal text-slate-400 mt-0.5">{desc}</p>
                {!completed && <button className="mt-3 text-[9px] font-medium uppercase text-primary/60 tracking-widest border-b border-primary/20 hover:text-primary hover:border-primary transition-all">Complete Now</button>}
            </div>
        </div>
    )
}

function PerkItem({ text, disabled }: any) {
    return (
        <li className={cn("flex items-center gap-3 text-xs font-medium", disabled ? "text-slate-300 dark:text-slate-600 line-through" : "text-slate-500 dark:text-slate-400")}>
            <CheckCircle2 className={cn("size-4 shrink-0", disabled ? "text-slate-200 dark:text-slate-700" : "text-emerald-400")} />
            {text}
        </li>
    )
}
