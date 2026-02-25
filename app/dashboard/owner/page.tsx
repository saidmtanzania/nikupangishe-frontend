"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Plus,
  Shield,
  Clock,
  Home,
  Eye,
  Key,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ArrowRight,
  Star,
  DollarSign,
  FileText,
  Wrench
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Header } from "@/components/layout/header"

export default function OwnerDashboard() {
  const userName = "James Mckinsey"

  return (
    <div className="min-h-screen w-full bg-[#f8fbff] flex justify-center">
      <div className="flex w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <DashboardSidebar role="owner" userName={userName} />

        <main className="flex-1 min-w-0">
          <Header minimal={true} title="Owner Dashboard" />

          <div className="max-w-6xl mx-auto space-y-8 px-8 pb-12 mt-8">
            {/* Verification Alert Banner */}
            <div className="group relative overflow-hidden rounded-[24px] border border-amber-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">Verification under review</h3>
                    <p className="text-xs font-medium text-muted-foreground">Our team is reviewing your documents. You will be notified when approved.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              <StatsCard
                icon={Home}
                label="Total Houses"
                value="3"
                color="blue"
                details={
                  <div className="flex gap-4 pt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-foreground">1</span>
                      <span className="text-[8px] font-bold uppercase text-emerald-500">Published</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-foreground">1</span>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground/60">Pending</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-foreground">1</span>
                      <span className="text-[8px] font-bold uppercase text-muted-foreground/60">Draft</span>
                    </div>
                  </div>
                }
              />
              <StatsCard
                icon={Eye}
                label="Upcoming Viewings"
                value="2"
                color="purple"
                tag="Active"
              />
              <StatsCard
                icon={Key}
                label="Active Tenancies"
                value="1"
                color="emerald"
                tag="Current"
              />
              <StatsCard
                icon={AlertCircle}
                label="Pending Actions"
                value="4"
                color="rose"
                tag="Urgent"
              />
            </div>

            {/* Main Content Grid: Houses & Viewings */}
            <div className="grid grid-cols-[1fr,320px] gap-8">
              {/* My Houses Table Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-lg font-bold tracking-tight text-foreground">My Houses</h2>
                  <Link href="#" className="text-xs font-bold text-primary hover:underline">View All</Link>
                </div>
                <div className="rounded-[28px] border border-border/40 bg-white p-2 shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
                        <th className="px-6 py-4 text-left">Property</th>
                        <th className="px-6 py-4 text-left">Location</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-4 py-4 text-left">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      <PropertyRow
                        image="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
                        name="Zanzibar Heights Villa"
                        type="Luxury Rental"
                        location="Westlands"
                        status="Published"
                        gps={true}
                        ownerVerified={true}
                      />
                      <PropertyRow
                        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                        name="Kilimani Oasis Condo"
                        type="2BR Apartment"
                        location="Kilimani"
                        status="Pending Verification"
                        gps={true}
                        ownerVerified={false}
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Viewings Section */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold tracking-tight text-foreground px-2">Upcoming Viewings</h2>
                <div className="space-y-4">
                  <ViewingCard
                    date="Oct 12"
                    name="Alice Thompson"
                    property="Zanzibar Heights • 10:30 AM"
                  />
                  <ViewingCard
                    date="Oct 14"
                    name="Mark Omondi"
                    property="Kilimani Oasis • 02:15 PM"
                    bg="white"
                  />
                  <ViewingCard
                    date="Oct 15"
                    name="Sarah Jenkins"
                    property="Zanzibar Heights • 09:00 AM"
                    bg="white"
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

function StatsCard({ icon: Icon, label, value, color, tag, details }: any) {
  const colors = {
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    rose: "bg-rose-50 text-rose-500",
    emerald: "bg-emerald-50 text-emerald-500",
    amber: "bg-amber-50 text-amber-500",
  }

  return (
    <Card className="overflow-hidden rounded-[26px] border border-border/40 bg-white shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors[color as keyof typeof colors])}>
            <Icon className="h-5 w-5" />
          </div>
          {tag && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{tag}</span>
          )}
        </div>
        <p className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground/60">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black tracking-tight text-foreground">{value}</h3>
        </div>
        {details}
      </CardContent>
    </Card>
  )
}

function PropertyRow({ image, name, type, location, status, gps, ownerVerified }: any) {
  return (
    <tr className="group transition-colors hover:bg-muted/30">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-sm">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-foreground leading-tight">{name}</span>
            <span className="text-[10px] font-medium text-muted-foreground">{type}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-[12px] font-medium text-muted-foreground">{location}</span>
      </td>
      <td className="px-6 py-5">
        <Badge className={cn(
          "rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
          status === "Published" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50" : "bg-amber-50 text-amber-600 hover:bg-amber-50"
        )}>
          {status}
        </Badge>
      </td>
      <td className="px-4 py-5">
        <div className="flex flex-col gap-1.5">
          {gps && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-2.5 w-2.5 text-emerald-500 fill-emerald-500/20" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">GPS Confirmed</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={cn("h-2.5 w-2.5", ownerVerified ? "text-emerald-500 fill-emerald-500/20" : "text-amber-500")} />
            <span className={cn("text-[8px] font-black uppercase tracking-widest leading-none", ownerVerified ? "text-emerald-600" : "text-amber-600")}>
              {ownerVerified ? "Owner Verified" : "Owner Pending"}
            </span>
          </div>
        </div>
      </td>
    </tr>
  )
}

function ViewingCard({ date, name, property, bg = "white" }: any) {
  return (
    <Link href="#" className={cn(
      "flex items-center justify-between rounded-[24px] border border-border/30 p-4 transition-all hover:border-primary/20 hover:shadow-md",
      bg === "white" ? "bg-white" : "bg-slate-50/50"
    )}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#f8fbff] border border-border/20 px-3 py-2 text-center">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-tight">Oct</span>
          <span className="text-sm font-black text-foreground">{date.split(" ")[1]}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-foreground">{name}</span>
          <span className="text-[10px] font-bold text-muted-foreground/60 leading-tight">{property}</span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
    </Link>
  )
}

function ActivityItem({ icon: Icon, color, title, desc, time }: any) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  }

  return (
    <div className="relative flex items-start gap-5">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform hover:scale-110">
        <div className={cn("absolute inset-0 rounded-xl opacity-100", colors[color as keyof typeof colors])} />
        <Icon className="relative z-10 h-4.5 w-4.5" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-bold text-foreground">{title}</h4>
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground/40">{time}</span>
        </div>
        <p className="text-[12px] font-medium leading-relaxed text-muted-foreground/70">{desc}</p>
      </div>
    </div>
  )
}


