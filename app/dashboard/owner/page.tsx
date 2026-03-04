"use client"

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
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { propertiesApi, toProperty } from "@/lib/api"

export default function OwnerDashboard() {
  const { user, token } = useAuth()
  const userName = user ? `${user.firstName} ${user.lastName}` : "Owner"
  const [ownerProperties, setOwnerProperties] = useState<ReturnType<typeof toProperty>[]>([])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    propertiesApi.myHouses(token)
      .then((res) => {
        if (!cancelled) setOwnerProperties(res.map(toProperty))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [token])

  return (
    <div className="py-12">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
        <div>
          <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">Karibu Tena, {userName.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your Tanzanian property portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-2 transition-all hover:bg-slate-50 shadow-sm active:scale-95">
            <Download className="h-4 w-4" /> Export Data
          </button>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> List New Property
          </button>
        </div>
      </header>

      <div className="space-y-8 px-4 pb-20">
        {/* Top Grid: Verification & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Verification Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-1 border-l-4 border-l-primary">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-slate-800 dark:text-white uppercase tracking-tight text-[10px]">Profile Verification</h3>
              <span className="bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-widest">75% Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-4">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
            </div>
            <ul className="space-y-3">
              <VerificationStep icon={CheckCircle2} label="Phone & Email Verified" completed />
              <VerificationStep icon={CheckCircle2} label="Bank Account Linked" completed />
              <VerificationStep icon={Clock} label="Complete Identity Check (KYC)" />
            </ul>
            <button className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 hover:text-primary text-xs font-medium rounded-xl transition-all border border-slate-100 dark:border-slate-700">
              Finish Verification
            </button>
          </div>

          {/* Revenue Tracker Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Total Portfolio Value</p>
                <h3 className="text-2xl font-medium text-slate-800 dark:text-white mt-1">TZS {(ownerProperties.reduce((acc, p) => acc + p.price, 0)).toLocaleString()} <span className="text-xs font-medium text-emerald-500 ml-2 mb-1 inline-block">+12% vs last month</span></h3>
              </div>
              <div className="flex gap-2">
                <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary hover:text-primary transition-all active:scale-90">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="size-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary hover:text-primary transition-all active:scale-90">
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
            <h3 className="text-lg font-medium tracking-tight text-slate-800 dark:text-white uppercase">My Properties</h3>
            <Link className="text-primary text-xs font-medium hover:underline uppercase tracking-wider" href="/dashboard/owner/houses">View All</Link>
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
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium uppercase tracking-tight text-slate-800">Assign Agents</h3>
              <div className="relative">
                <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-[10px] font-medium uppercase tracking-widest focus:ring-primary py-2 px-4 shadow-sm transition-all outline-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                  <option>Select Property...</option>
                  {ownerProperties.map(p => (
                    <option key={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-xs text-slate-400 text-center py-4">Agent assignment coming soon.</p>
            </div>
          </section>

          {/* Tenant Approval Queue */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-medium mb-6 uppercase tracking-tight text-slate-800">Tenant Queue</h3>
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="py-8 text-center">
                <p className="text-xs text-slate-400">No pending tenant applications.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function VerificationStep({ icon: Icon, label, completed }: any) {
  return (
    <li className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
      <Icon className={cn("h-4 w-4", completed ? "text-emerald-500" : "text-primary/60")} />
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
            ? "bg-primary shadow-lg shadow-primary/20"
            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        )}
        style={{ height }}
      >
        {active && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        )}
      </div>
      <div className={cn(
        "px-2.5 py-1 rounded-md text-[9px] font-medium transition-all shadow-sm border uppercase tracking-widest",
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="h-36 relative overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 hover:scale-110" />
        <div className={cn("absolute top-3 right-3 text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-sm", statusColor)}>
          {status}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-slate-800 dark:text-white truncate text-sm">{name}</h4>
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-1.5 uppercase tracking-tighter">
          <MapPin className="h-3 w-3 text-primary/40" /> {location}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3">
          <div className="flex flex-col">
            <span className="text-primary font-medium text-base leading-none">{price}</span>
            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">{period}</span>
          </div>
          {editable ? (
            <button className="text-[10px] font-medium text-slate-400 hover:text-white hover:bg-primary transition-all py-2 px-4 rounded-xl border border-slate-100 dark:border-slate-800 uppercase tracking-widest">Edit</button>
          ) : subtitle ? (
            <span className="text-[10px] font-medium italic text-amber-600 uppercase tracking-widest">{subtitle}</span>
          ) : (
            <div className="flex -space-x-2">
              <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-600 shadow-sm">JD</div>
              <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary/20 text-primary flex items-center justify-center text-[10px] font-medium shadow-sm">+2</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AgentItem({ name, stats, initials }: any) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center text-[10px] font-medium shadow-sm transition-all border border-slate-100 dark:border-slate-800">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-white group-hover:text-primary transition-colors">{name}</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{stats}</p>
        </div>
      </div>
      <button className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 px-4 rounded-xl text-[10px] font-medium uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">Assign</button>
    </div>
  )
}

function TenantApplicant({ name, role, property, time, initials }: any) {
  return (
    <div className="p-5 bg-slate-50/30 dark:bg-slate-800/50 rounded-2xl border border-slate-100/30">
      <div className="flex items-start justify-between mb-5">
        <div className="flex gap-4">
          <div className="size-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-xs font-medium text-slate-400 overflow-hidden shrink-0 uppercase">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-white">{name}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">{role}</p>
            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-primary/70 mt-1.5 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
              <Plus className="h-2.5 w-2.5" /> {property}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{time}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2.5 bg-emerald-600 text-white text-[10px] font-medium rounded-xl uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/10">Approve</button>
        <button className="flex-1 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 text-[10px] font-medium rounded-xl uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all">Reject</button>
        <button className="size-10 flex items-center justify-center border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-white transition-all text-slate-400 hover:text-primary shadow-sm active:scale-95">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
