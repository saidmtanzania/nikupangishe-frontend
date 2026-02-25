"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  ArrowLeftRight,
  Shield,
  MessageSquare,
  MapPin,
  Clock,
  Eye,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Plus,
  Compass
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockProperties, mockUsers, mockExchangeRequests, mockConversations, mockTenancies } from "@/lib/mock-data"

export default function TenantDashboard() {
  const tenant = mockUsers.find((u) => u.id === "user-2")!
  const myTenancy = mockTenancies.find((t) => t.tenantId === tenant.id)
  const myExchangeRequests = mockExchangeRequests.filter((e) => e.fromTenantId === tenant.id)
  const myMessages = mockConversations.filter((c) => c.participants.some(p => p.id === tenant.id))
  const userName = tenant.name

  return (
    <div className="py-12">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight uppercase">Mambo, {userName.split(' ')[0]}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your active tenancy and house exchange requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/browse" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-slate-50 shadow-sm active:scale-95 text-slate-600 dark:text-slate-300">
            <Compass className="h-4 w-4" /> Find Houses
          </Link>
          <Link href="/exchange" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <ArrowLeftRight className="h-4 w-4" /> Start Exchange
          </Link>
        </div>
      </header>

      <div className="space-y-8 px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tenancy Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold uppercase tracking-tight text-slate-800">Active Tenancy</h3>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Live Now</span>
            </div>
            {myTenancy ? (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative w-full md:w-64 h-40 rounded-2xl overflow-hidden shadow-sm">
                  <Image src={mockProperties.find(p => p.id === myTenancy.propertyId)?.images[0] || ""} alt="Home" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-xs font-semibold truncate">{myTenancy.propertyTitle}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Rent</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-white mt-0.5">TZS {myTenancy.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</p>
                      <p className="text-lg font-bold text-slate-700 dark:text-white mt-0.5">{myTenancy.startDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-3 bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white text-xs font-semibold rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Payment History</button>
                    <button className="flex-1 py-3 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold rounded-xl uppercase tracking-widest hover:bg-slate-50 transition-all">Support</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                <Home className="h-10 w-10 text-slate-200 mb-2" />
                <p className="text-xs font-medium text-slate-400">No active tenancy records found.</p>
                <Link href="/browse" className="text-primary text-[10px] font-bold uppercase mt-2 hover:underline tracking-widest">Find a home</Link>
              </div>
            )}
          </div>

          {/* Trust Score Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-primary/40 flex flex-col items-center text-center">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Nikupangishe Trust Score</h3>
            <div className="relative size-32 flex items-center justify-center mb-6">
              <svg className="size-full" viewBox="0 0 100 100">
                <circle className="text-slate-50 dark:text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                <circle className="text-primary/60" strokeWidth="6" strokeDasharray={42 * 2 * Math.PI} strokeDashoffset={42 * 2 * Math.PI * (1 - 0.85)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-700 dark:text-white">850</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Excellent</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[180px]">Your score is updated based on on-time payments and verified profile.</p>
            <button className="mt-8 text-slate-500 hover:text-primary text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2 transition-colors">
              <Shield className="h-4 w-4" /> Boost Score
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Exchange Requests */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold uppercase tracking-tight text-slate-800">Exchange Requests</h3>
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:underline">View History</button>
            </div>
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {myExchangeRequests.map(req => (
                <div key={req.id} className="p-5 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-slate-100 hover:bg-slate-50/50 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      "text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm border",
                      req.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : req.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {req.status}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300">{req.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                      <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-white truncate uppercase tracking-tight">{req.toPropertyTitle}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">Requested from {req.fromPropertyTitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Messages */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold uppercase tracking-tight text-slate-800">Recent Chats</h3>
              <Link href="/chat" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:underline">Messenger</Link>
            </div>
            <div className="space-y-4">
              {myMessages.slice(0, 3).map(conv => (
                <Link key={conv.id} href={`/chat/${conv.id}`} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 hover:border-slate-100 hover:bg-slate-50/50 transition-all group">
                  <div className="size-11 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 uppercase shadow-sm border border-white">
                    {conv.participants.find(p => p.id !== tenant.id)?.name.split(' ')[0][0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white truncate group-hover:text-primary transition-colors">{conv.participants.find(p => p.id !== tenant.id)?.name}</p>
                      <span className="text-[9px] font-medium text-slate-300">{new Date(conv.lastMessageTime).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-medium">{conv.lastMessage}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
