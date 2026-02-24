"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { formatTZS } from "@/lib/utils"
import {
  Briefcase,
  Eye,
  DollarSign,
  Star,
  MapPin,
  Shield,
  Calendar,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const agent = mockUsers.find((u) => u.id === "user-5")!
const assignedProperties = mockProperties.filter((p) => p.agentId === agent.id)

const stats = [
  { label: "Assigned Houses", value: assignedProperties.length, change: "+2 this month", changeType: "positive" as const },
  { label: "Completed Viewings", value: 18, change: "+5 this week", changeType: "positive" as const },
  { label: "Commission Earned", value: formatTZS(2400000), change: "+12%", changeType: "positive" as const },
  { label: "Avg. Rating", value: "4.8", change: "from 23 reviews", changeType: "neutral" as const },
]

const statIcons = [
  <Briefcase key="brief" className="h-5 w-5" />,
  <Eye key="eye" className="h-5 w-5" />,
  <DollarSign key="dollar" className="h-5 w-5" />,
  <Star key="star" className="h-5 w-5" />,
]

const upcomingViewings = [
  { id: 1, tenant: "Sarah Mbeki", property: "Modern 2BR in Masaki", date: "2026-02-25", time: "10:00 AM" },
  { id: 2, tenant: "John Kamau", property: "3BR Villa in Mbezi Beach", date: "2026-02-25", time: "2:00 PM" },
  { id: 3, tenant: "Fatima Hassan", property: "2BR Apartment in Upanga", date: "2026-02-26", time: "11:00 AM" },
  { id: 4, tenant: "Peter Mushi", property: "3BR House in Mikocheni", date: "2026-02-27", time: "3:30 PM" },
]

export default function AgentDashboard() {
  return (
    <>
      <DashboardSidebar role="agent" userName={agent.name} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage viewings, track commissions, and grow your portfolio
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} icon={statIcons[i]} />
            ))}
          </div>

          {/* Assigned Properties */}
          <div id="properties" className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Assigned Properties</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {assignedProperties.map((property, idx) => (
                <Card key={property.id} className="overflow-hidden border-border">
                  <div className="flex">
                    <div className="relative h-32 w-32 shrink-0">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        {...(idx === 0 ? { priority: true } : { loading: "lazy" as const })}
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground line-clamp-1">{property.title}</h3>
                          {property.isVerified && <Shield className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          {property.location.neighborhood}
                        </div>
                        <p className="text-sm font-bold text-primary">{formatTZS(property.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default" className="text-xs">{property.status}</Badge>
                        <Link href={`/properties/${property.id}`} className="text-xs text-primary hover:underline ml-auto flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Details
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Viewings */}
          <div id="viewings" className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Viewings</h2>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcomingViewings.map((viewing) => (
                    <div key={viewing.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{viewing.tenant}</p>
                          <p className="text-xs text-muted-foreground">{viewing.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-foreground">{viewing.date}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                            <Clock className="h-3 w-3" />
                            {viewing.time}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          Confirm
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commission History */}
          <div id="commissions">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Commissions</h2>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Earned from successful tenancy placements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { property: "Modern 2BR in Masaki", tenant: "Sarah Mbeki", amount: 900000, date: "2026-02-15" },
                    { property: "3BR Villa in Mbezi Beach", tenant: "John Kamau", amount: 1000000, date: "2026-02-01" },
                    { property: "2BR in Upanga", tenant: "Fatima Hassan", amount: 500000, date: "2026-01-20" },
                  ].map((c) => (
                    <div key={c.property + c.date} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.property}</p>
                        <p className="text-xs text-muted-foreground">Placed: {c.tenant}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-chart-2">{formatTZS(c.amount)}</p>
                        <p className="text-xs text-muted-foreground">{c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
