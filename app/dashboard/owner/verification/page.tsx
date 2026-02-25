"use client"

import { Shield, CheckCircle2, Clock, ShieldCheck, MapPin, IdCard, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function OwnerVerificationPage() {
    return (
        <div className="py-12">
            <header className="mb-10 px-4">
                <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Verification Center</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your identity and property verification status.</p>
            </header>

            <div className="px-4 max-w-4xl space-y-8 pb-20">
                {/* Overall Status */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldCheck className="size-48" />
                    </div>
                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="size-32 rounded-full border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center relative">
                            <span className="text-3xl font-medium text-slate-700 dark:text-white">75%</span>
                            <svg className="absolute inset-0 size-full -rotate-90">
                                <circle className="text-primary/40" strokeWidth="4" strokeDasharray={42 * 2 * Math.PI} strokeDashoffset={42 * 2 * Math.PI * (1 - 0.75)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                            </svg>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-medium text-slate-700 dark:text-white">Almost Verified!</h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-md font-normal">Complete your identity verification to unlock full premium features and build trust with tenants.</p>
                            <button className="mt-6 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-medium rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg">Complete Identity Check</button>
                        </div>
                    </div>
                </div>

                {/* Verification Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VerificationCard
                        icon={CheckCircle2}
                        title="Basic Profile"
                        desc="Email and phone number verification"
                        status="Completed"
                        statusColor="text-emerald-500 bg-emerald-50 border-emerald-100"
                    />
                    <VerificationCard
                        icon={IdCard}
                        title="Identity (KYC)"
                        desc="NIDA ID or Passport verification"
                        status="In Progress"
                        statusColor="text-amber-600 bg-amber-50 border-amber-100"
                    />
                    <VerificationCard
                        icon={MapPin}
                        title="Physical Address"
                        desc="Office or residence verification"
                        status="Not Started"
                        statusColor="text-slate-400 bg-slate-100 border-slate-200"
                    />
                    <VerificationCard
                        icon={ShieldCheck}
                        title="Property Titles"
                        desc="Ownership proof for listed houses"
                        status="Partially Done"
                        statusColor="text-blue-500 bg-blue-50 border-blue-100"
                    />
                </div>

                {/* Info Banner */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl flex gap-4">
                    <AlertCircle className="size-6 text-primary/40 shrink-0" />
                    <div>
                        <h4 className="font-medium text-slate-700 dark:text-white text-sm">Why verify?</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed font-normal">Verified owners receive 5x more viewing requests and appear higher in search results. It builds trust with premium tenants and agents across Dar es Salaam.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function VerificationCard({ icon: Icon, title, desc, status, statusColor }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-slate-200 transition-all group">
            <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                <Icon className="size-6" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-slate-700 dark:text-white text-sm">{title}</h4>
                <p className="text-[11px] font-normal text-slate-400 mt-0.5">{desc}</p>
                <div className={cn("inline-block mt-3 px-2 py-0.5 rounded-md text-[9px] font-medium uppercase tracking-widest border", statusColor)}>
                    {status}
                </div>
            </div>
        </div>
    )
}
