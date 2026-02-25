"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
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
import { mockProperties, mockUsers, mockViewings, mockCommissions } from "@/lib/mock-data"

export default function AgentDashboard() {
  const agent = mockUsers.find((u) => u.id === "user-5")!
  const assignedProperties = mockProperties.filter((p) => p.agentId === agent.id)
  const agentViewings = mockViewings.filter((v) => v.agentId === agent.id)
  const agentCommissions = mockCommissions.filter((c) => c.agentId === agent.id)
  const userName = agent.name

  return (
    <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-slate-950 flex justify-center">
      <div className="relative flex w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <DashboardSidebar role="agent" userName={userName} />

        <main className="flex-1 pl-[260px] py-12">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Karibu Agent, {userName.split(' ')[0]}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage viewings, track commissions, and grow your portfolio.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-50">
                <Download className="h-4 w-4" /> Export Report
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:bg-primary/90 active:scale-95">
                <Plus className="h-4 w-4" /> New Listing
              </button>
            </div>
          </header>

          <div className="space-y-8 px-4 pb-20">
            {/* Top Grid: Agent Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AgentStatCard icon={Briefcase} label="Assigned Houses" value={assignedProperties.length} subValue="+2 this month" />
              <AgentStatCard icon={Calendar} label="Active Viewings" value="18" subValue="Next at 10:00 AM" />
              <AgentStatCard icon={DollarSign} label="Commission" value="TZS 2.4M" subValue="+12% vs last month" />
              <AgentStatCard icon={Star} label="Avg. Rating" value="4.8" subValue="From 23 reviews" />
            </div>

            {/* Assigned Properties Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Managed Properties</h3>
                <Link className="text-primary text-xs font-bold hover:underline" href="#">Manage All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {assignedProperties.map((property) => (
                  <PropertyCardCompact
                    key={property.id}
                    image={property.images[0]}
                    name={property.title}
                    location={property.location.neighborhood}
                    price={`TZS ${property.price.toLocaleString()}`}
                    status={property.status}
                  />
                ))}
              </div>
            </section>

            {/* Bottom Grid: Viewings & History */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Upcoming Viewings */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Upcoming Viewings</h3>
                <div className="space-y-4">
                  {agentViewings.map((viewing) => (
                    <ViewingItem
                      key={viewing.id}
                      tenant={viewing.tenantName}
                      property={viewing.propertyTitle}
                      time={viewing.time}
                      initials={viewing.tenantName.split(' ').map(n => n[0]).join('')}
                    />
                  ))}
                </div>
              </section>

              {/* Commission History */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Commission History</h3>
                  <button className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">View Ledger</button>
                </div>
                <div className="space-y-3">
                  {agentCommissions.map((commission) => (
                    <CommissionEntry
                      key={commission.id}
                      property={commission.propertyTitle}
                      amount={`TZS ${commission.amount.toLocaleString()}`}
                      date={commission.date}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function AgentStatCard({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/5 shadow-sm transition-all hover:border-primary/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-tight font-bold">{label}</p>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <p className="text-xs font-bold text-emerald-500 mt-1">{subValue}</p>
    </div>
  )
}

function PropertyCardCompact({ image, name, location, price, status }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="group h-32 relative overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-2.5 right-2.5 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm bg-primary">
          {status}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{name}</h4>
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-slate-400" /> {location}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-slate-50/50 pt-2.5">
          <span className="text-primary font-bold text-sm">{price}</span>
          <button className="text-[9px] font-bold text-slate-400 hover:text-primary transition-colors">Details</button>
        </div>
      </div>
    </div>
  )
}

function ViewingItem({ tenant, property, time, initials }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{tenant}</p>
          <p className="text-[10px] font-medium text-slate-400">{property}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{time}</p>
        <button className="text-[9px] font-bold text-primary hover:underline mt-1">Confirm</button>
      </div>
    </div>
  )
}

function CommissionEntry({ property, amount, date }: any) {
  return (
    <div className="p-4 bg-slate-50/30 dark:bg-slate-800/50 rounded-xl border border-slate-100/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-900">{property}</p>
        <p className="text-[10px] font-medium text-slate-400">{date}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-emerald-600">{amount}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Paid</p>
      </div>
    </div>
  )
}
