"use client"

import { cn } from "@/lib/utils"
import {
  Briefcase,
  Eye,
  DollarSign,
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Download
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { propertiesApi, viewingsApi, toProperty, type ApiViewingRequest } from "@/lib/api"

export default function AgentDashboard() {
  const { user, token } = useAuth()
  const userName = user ? `${user.firstName} ${user.lastName}` : "Agent"
  const [assignedProperties, setAssignedProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [agentViewings, setAgentViewings] = useState<ApiViewingRequest[]>([])

  useEffect(() => {
    if (!token || !user) return
    let cancelled = false
    // Fetch properties assigned to this agent
    propertiesApi.list({ limit: 50 })
      .then((res) => {
        if (!cancelled) {
          const items = Array.isArray(res) ? res : (res.data ?? [])
          const mapped = items.map(toProperty).filter(p => p.agentId === user.id)
          setAssignedProperties(mapped)
        }
      })
      .catch(() => {})
    // Fetch viewings
    viewingsApi.myViewings(token)
      .then((res) => { if (!cancelled) setAgentViewings(res) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token, user])

  const agentCommissions: { id: string; propertyTitle: string; amount: number; date: string }[] = []

  return (
    <div className="py-12">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
        <div>
          <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight uppercase">Karibu Agent, {userName.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage viewings, track commissions, and grow your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-slate-50 shadow-sm active:scale-95 text-slate-600 dark:text-slate-300">
            <Download className="h-4 w-4" /> Export Report
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-medium uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> New Listing
          </button>
        </div>
      </header>

      <div className="space-y-8 px-4 pb-20">
        {/* Agent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Briefcase} label="Active Listings" value={assignedProperties.length.toString()} color="text-slate-600" bg="bg-slate-50" />
          <StatCard icon={Calendar} label="Booked Viewings" value={agentViewings.length.toString()} color="text-blue-500" bg="bg-blue-50/50" />
          <StatCard icon={DollarSign} label="Total Earned" value={`TZS ${(agentCommissions.reduce((acc, c) => acc + c.amount, 0) / 1000000).toFixed(1)}M`} color="text-emerald-500" bg="bg-emerald-50/50" />
          <StatCard icon={Star} label="Avg Rating" value="4.9 / 5" color="text-amber-500" bg="bg-amber-50/50" />
        </div>

        {/* Real-time Schedule & Money */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Viewings */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium uppercase tracking-tight text-slate-800">Upcoming Viewings</h3>
              <button className="text-xs font-medium text-primary hover:underline uppercase tracking-widest">View Calendar</button>
            </div>
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {agentViewings.length > 0 ? agentViewings.map((viewing) => (
                <ViewingItem key={viewing.id} viewing={viewing} />
              )) : (
                <p className="text-xs text-slate-400 text-center py-8">No upcoming viewings.</p>
              )}
            </div>
          </div>

          {/* Money tracker / Commissions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-400">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium uppercase tracking-tight text-emerald-600">Earnings</h3>
              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-widest border border-emerald-100">Last 30 Days</span>
            </div>
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              {agentCommissions.length > 0 ? agentCommissions.map((comm) => (
                <div key={comm.id} className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate uppercase tracking-tight">{comm.propertyTitle}</p>
                    <span className="text-[10px] font-medium text-emerald-600 tracking-tight">TZS {comm.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">{comm.date}</span>
                    <span className="text-emerald-500 font-medium uppercase text-[8px] tracking-widest">Paid</span>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 text-center py-8">No commission records yet.</p>
              )}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-medium rounded-xl uppercase tracking-widest shadow-lg hover:bg-primary hover:text-white transition-all">
              Cash Out
            </button>
          </div>
        </div>

        {/* Managed Houses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium tracking-tight text-slate-800 dark:text-white uppercase">Managed Houses</h3>
            <button className="text-primary text-xs font-medium uppercase tracking-widest hover:underline">Manage All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assignedProperties.map((property) => (
              <AgentPropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5 group">
      <div className={cn("size-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-medium text-slate-700 dark:text-white mt-1">{value}</p>
    </div>
  )
}

function ViewingItem({ viewing }: { viewing: ApiViewingRequest }) {
  const label = viewing.house?.title ?? viewing.houseId ?? "Property"
  const time = new Date(viewing.preferredDate).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
  const initials = viewing.tenantId?.slice(0, 2).toUpperCase() ?? "??"
  return (
    <div className="p-4 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-medium text-[10px] uppercase shadow-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{label}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-300 uppercase tracking-tighter">
                <Clock className="h-3 w-3" /> {time}
              </span>
            </div>
          </div>
        </div>
        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${viewing.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
          {viewing.status}
        </span>
      </div>
    </div>
  )
}

function AgentPropertyCard({ property }: { property: ReturnType<typeof toProperty> }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="h-32 relative overflow-hidden">
        <Image src={property.images[0]} alt={property.title} fill className="object-cover transition-transform duration-500 hover:scale-110" />
        <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
          Verified House
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-700 dark:text-white truncate text-sm uppercase tracking-tight">{property.title}</h4>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-primary font-medium text-sm">TZS {(property.price / 1e6).toFixed(1)}M</span>
            <span className="text-[9px] font-medium text-slate-300 uppercase tracking-widest mt-0.5">/ Month</span>
          </div>
          <button className="text-[10px] font-medium text-slate-400 hover:text-primary border-b border-transparent hover:border-primary uppercase tracking-widest transition-all">Listing</button>
        </div>
      </div>
    </div>
  )
}
