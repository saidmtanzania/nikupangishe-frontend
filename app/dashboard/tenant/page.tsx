"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { cn } from "@/lib/utils"
import {
  Home,
  Heart,
  ArrowLeftRight,
  MessageSquare,
  MapPin,
  Shield,
  Clock,
  Download,
  Plus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockProperties, mockTenancies, mockExchangeRequests, mockUsers } from "@/lib/mock-data"

export default function TenantDashboard() {
  const tenant = mockUsers.find((u) => u.id === "user-1")!
  const tenancy = mockTenancies.find((t) => t.tenantId === tenant.id)!
  const currentProperty = mockProperties.find((p) => p.id === tenancy.propertyId)!
  const tenantExchanges = mockExchangeRequests.filter((e) => e.fromTenantId === tenant.id)
  const favorites = mockProperties.filter((p) => ["prop-1", "prop-6", "prop-8"].includes(p.id))
  const userName = tenant.name

  return (
    <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-slate-950 flex justify-center">
      <div className="relative flex w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <DashboardSidebar role="tenant" userName={userName} />

        <main className="flex-1 pl-[260px] py-12">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Karibu Tena, {userName.split(' ')[0]}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your tenancy, explore listings, and request exchanges.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-50">
                <MessageSquare className="h-4 w-4" /> Messages
              </button>
              <Link href="/browse" className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:bg-primary/90 active:scale-95">
                <Plus className="h-4 w-4" /> Find New Home
              </Link>
            </div>
          </header>

          <div className="space-y-8 px-4 pb-20">
            {/* Top Grid: Tenant Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TenantStatCard icon={Home} label="Current Rent" value={`TZS ${(tenancy.monthlyRent / 1000).toLocaleString()}k`} subValue="Due 1st Mar" />
              <TenantStatCard icon={Heart} label="Saved Homes" value={favorites.length} subValue="2 active listings" />
              <TenantStatCard icon={ArrowLeftRight} label="Exchanges" value={tenantExchanges.length} subValue={`${tenantExchanges.filter(e => e.status === "pending").length} pending`} />
              <TenantStatCard icon={Shield} label="Trust Score" value="780" subValue="Verified Profile" />
            </div>

            {/* Current Home Section */}
            <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">My Current Home</h3>
                <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Active Lease</span>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative h-48 w-full md:w-80 rounded-xl overflow-hidden shadow-sm">
                  <Image src={currentProperty.images[0]} alt={currentProperty.title} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{currentProperty.title}</h4>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                      <MapPin className="h-4 w-4 text-slate-400" /> {currentProperty.location.neighborhood}, {currentProperty.location.city}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg flex-1 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Monthly Rent</p>
                      <p className="text-base font-bold text-primary">TZS {tenancy.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg flex-1 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Lease Started</p>
                      <p className="text-base font-bold text-slate-700">{tenancy.startDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/exchange" className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg text-center hover:bg-slate-800 transition-all">Request Exchange</Link>
                    <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all">Contact Agent</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Favorites & Requests Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Saved Properties */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Saved Properties</h3>
                  <Link href="/browse" className="text-primary text-[10px] font-bold uppercase hover:underline">Browse More</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.slice(0, 2).map(p => (
                    <div key={p.id} className="group cursor-pointer">
                      <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover transition-all group-hover:scale-110" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                      <p className="text-[10px] font-bold text-primary mt-0.5">TZS {p.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Exchange Requests */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Exchange Requests</h3>
                <div className="space-y-3">
                  {tenantExchanges.map(ex => (
                    <div key={ex.id} className="p-4 bg-slate-50/30 rounded-xl border border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-white flex items-center justify-center border border-border shadow-sm text-primary">
                          <ArrowLeftRight className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-none mb-1">{ex.toPropertyTitle}</p>
                          <p className="text-[10px] font-medium text-slate-400">Requested on {ex.createdAt}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                        ex.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                      )}>
                        {ex.status}
                      </span>
                    </div>
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

function TenantStatCard({ icon: Icon, label, value, subValue }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/5 shadow-sm transition-all hover:border-primary/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-tight font-bold">{label}</p>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <p className="text-xs font-bold text-slate-500 mt-1">{subValue}</p>
    </div>
  )
}
