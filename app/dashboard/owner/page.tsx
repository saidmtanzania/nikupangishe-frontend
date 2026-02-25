"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { cn } from "@/lib/utils"
import {
  Plus,
  Clock,
  Eye,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Download
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockProperties, mockUsers, mockTenancies, mockExchangeRequests } from "@/lib/mock-data"


export default function OwnerDashboard() {
  const owner = mockUsers.find((u) => u.id === "user-3")!
  const userName = owner.name
  const ownerProperties = mockProperties.filter(p => p.ownerId === owner.id)

  return (
    <div className="min-h-screen w-full bg-[#f8f6f6] dark:bg-slate-950 flex justify-center">
      <div className="relative flex w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <DashboardSidebar role="owner" userName={userName} />

        <main className="flex-1 pl-[260px] py-12">
          {/* Dashboard Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Karibu Tena, {userName.split(' ')[0]}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your Tanzanian property portfolio.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-50">
                <Download className="h-4 w-4" /> Export Data
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:bg-primary/90 active:scale-95">
                <Plus className="h-4 w-4" /> List New Property
              </button>
            </div>
          </header>

          <div className="space-y-8 px-4 pb-20">
            {/* Top Grid: Verification & Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Verification Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm lg:col-span-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Profile Verification</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">75% Complete</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-4">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
                <ul className="space-y-3">
                  <VerificationStep icon={CheckCircle2} label="Phone & Email Verified" completed />
                  <VerificationStep icon={CheckCircle2} label="Bank Account Linked" completed />
                  <VerificationStep icon={Clock} label="Complete Identity Check (KYC)" />
                </ul>
                <button className="w-full mt-6 py-2.5 border border-primary text-primary text-xs font-bold rounded-lg hover:bg-primary/5 transition-all">
                  Finish Verification
                </button>
              </div>

              {/* Revenue Tracker Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tight font-bold">Total Portfolio Value</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">TZS {(ownerProperties.reduce((acc, p) => acc + p.price, 0)).toLocaleString()} <span className="text-xs font-bold text-emerald-500 ml-2">+12% vs last month</span></h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-90">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="size-8 flex items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 gap-3 mt-4">
                  <RevenueBar label="JAN" height="40%" />
                  <RevenueBar label="FEB" height="60%" />
                  <RevenueBar label="MAR" height="55%" />
                  <RevenueBar label="APR" height="85%" />
                  <RevenueBar label="MAY" height="70%" />
                  <RevenueBar label="JUN" height="100%" active />
                </div>
              </div>
            </div>

            {/* Property Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">My Properties</h3>
                <Link className="text-primary text-xs font-bold hover:underline" href="/dashboard/owner/houses">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ownerProperties.map((property) => (
                  <PropertyCardV3
                    key={property.id}
                    image={property.images[0]}
                    name={property.title}
                    location={`${property.location.neighborhood}, ${property.location.city}`}
                    price={`TZS ${property.price.toLocaleString()}`}
                    period="/mo"
                    status={property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    statusColor={property.status === "available" ? "bg-primary" : "bg-emerald-500"}
                    editable={property.status === "available"}
                  />
                ))}
              </div>
            </section>

            {/* Bottom Grid: Agent & Tenant Queue */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Assign Agent Feature */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Assign Verified Agents</h3>
                  <div className="relative">
                    <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] font-bold focus:ring-primary py-1.5 px-3 shadow-sm transition-all outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      <option>Select Property...</option>
                      {ownerProperties.map(p => (
                        <option key={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {mockUsers.filter(u => u.role === "agent").map(agent => (
                    <AgentItem
                      key={agent.id}
                      name={agent.name}
                      stats="⭐ 4.9 (Local Expert)"
                      initials={agent.name.split(' ').map(n => n[0]).join('')}
                    />
                  ))}
                </div>
              </section>

              {/* Tenant Approval Queue */}
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Tenant Approval Queue</h3>
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {mockExchangeRequests.map(req => (
                    <TenantApplicant
                      key={req.id}
                      name={req.fromTenantName}
                      role="Verified Tenant"
                      property={req.toPropertyTitle}
                      time={req.createdAt}
                      initials={req.fromTenantName.split(' ').map(n => n[0]).join('')}
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
function VerificationStep({ icon: Icon, label, completed }: any) {
  return (
    <li className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
      <Icon className={cn("h-4 w-4", completed ? "text-emerald-500" : "text-primary")} />
      <span>{label}</span>
    </li>
  )
}

function RevenueBar({ label, height, active }: any) {
  return (
    <div className="flex flex-col items-center flex-1 gap-3 h-full justify-end group">
      <div
        className={cn(
          "w-full rounded-lg transition-all duration-700 cursor-pointer relative overflow-hidden",
          active
            ? "bg-primary shadow-[0_8px_16px_-4px_rgba(236,84,19,0.3)]"
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
        )}
        style={{ height }}
      >
        {active && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        )}
      </div>
      <div className={cn(
        "px-2.5 py-1 rounded-md text-[9px] font-bold transition-all shadow-sm border",
        active
          ? "bg-primary text-white border-primary shadow-primary/10"
          : "bg-white text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
      )}>
        {label}
      </div>
    </div>
  )
}

function PropertyCardV3({ image, name, location, price, period, status, statusColor, editable, subtitle }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="group h-32 relative overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className={cn("absolute top-2.5 right-2.5 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm", statusColor)}>
          {status}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm transition-colors">{name}</h4>
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3 text-slate-400" /> {location}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-slate-50/50 pt-2.5">
          <div className="flex flex-col">
            <span className="text-primary font-bold text-sm">{price}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight leading-none">{period}</span>
          </div>
          {editable ? (
            <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-50">Edit</button>
          ) : subtitle ? (
            <span className="text-[9px] font-bold italic text-amber-600 uppercase tracking-tight">{subtitle}</span>
          ) : (
            <div className="flex -space-x-1.5">
              <div className="size-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm">JD</div>
              <div className="size-7 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[9px] font-bold shadow-sm">+2</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentItem({ name, stats, initials }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-105">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</p>
          <p className="text-[10px] font-medium text-slate-400">{stats}</p>
        </div>
      </div>
      <button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-white transition-all">Assign</button>
    </div>
  )
}

function TenantApplicant({ name, role, property, time, initials }: any) {
  return (
    <div className="p-4 bg-slate-50/30 dark:bg-slate-800/50 rounded-xl border border-slate-100/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="size-11 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 shadow-sm flex items-center justify-center text-sm font-bold text-slate-900 overflow-hidden shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{name}</p>
            <p className="text-[11px] font-medium text-slate-500">{role}</p>
            <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-tight">Applied: {property}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{time}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-tight hover:opacity-90 active:scale-95 transition-all">Approve</button>
        <button className="flex-1 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-tight hover:bg-slate-50 active:scale-95 transition-all">Reject</button>
        <button className="size-9 flex items-center justify-center border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white transition-all text-slate-400 hover:text-slate-900 shadow-sm">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

