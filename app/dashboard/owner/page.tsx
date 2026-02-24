"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProperties, mockTenancies, mockUsers } from "@/lib/mock-data"
import { formatTZS } from "@/lib/utils"
import {
  Home,
  Users,
  FileText,
  DollarSign,
  Plus,
  MapPin,
  Shield,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const owner = mockUsers.find((u) => u.id === "user-3")!
const ownerProperties = mockProperties.filter((p) => p.ownerId === owner.id)
const ownerTenancies = mockTenancies.filter((t) => t.ownerId === owner.id)

const stats = [
  { label: "Total Properties", value: ownerProperties.length, change: "+1 this month", changeType: "positive" as const },
  { label: "Active Tenants", value: ownerTenancies.length, change: "Stable", changeType: "neutral" as const },
  { label: "Pending Requests", value: 3, change: "+2 new", changeType: "positive" as const },
  { label: "Monthly Income", value: formatTZS(ownerTenancies.reduce((s, t) => s + t.monthlyRent, 0)), change: "+8%", changeType: "positive" as const },
]

const statIcons = [
  <Home key="home" className="h-5 w-5" />,
  <Users key="users" className="h-5 w-5" />,
  <FileText key="files" className="h-5 w-5" />,
  <DollarSign key="dollar" className="h-5 w-5" />,
]

export default function OwnerDashboard() {
  return (
    <>
      <DashboardSidebar role="owner" userName={owner.name} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your properties, tenants, and income
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} icon={statIcons[i]} />
            ))}
          </div>

          {/* Properties Section */}
          <div id="properties" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">My Properties</h2>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Property
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {ownerProperties.map((property, idx) => (
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
                          {property.location.neighborhood}, {property.location.city}
                        </div>
                        <p className="text-sm font-bold text-primary">{formatTZS(property.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={property.status === "available" ? "default" : "secondary"} className="text-xs">
                          {property.status}
                        </Badge>
                        <Link href={`/properties/${property.id}`} className="text-xs text-primary hover:underline ml-auto flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tenants Section */}
          <div id="tenants" className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Tenants</h2>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {ownerTenancies.map((tenancy) => (
                    <div key={tenancy.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {tenancy.tenantName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{tenancy.tenantName}</p>
                          <p className="text-xs text-muted-foreground">{tenancy.propertyTitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatTZS(tenancy.monthlyRent)}</p>
                        <p className="text-xs text-muted-foreground">Since {tenancy.startDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests Section */}
          <div id="requests">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Requests</h2>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Viewing & exchange requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Amina Juma", type: "Viewing Request", property: "Modern 2BR in Masaki", time: "2 hours ago" },
                    { name: "Baraka Mwangi", type: "Exchange Request", property: "Cozy 1BR in Kijitonyama", time: "1 day ago" },
                    { name: "John Doe", type: "Viewing Request", property: "Commercial Space in Kariakoo", time: "3 days ago" },
                  ].map((req) => (
                    <div key={req.name + req.type} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{req.name} - {req.type}</p>
                        <p className="text-xs text-muted-foreground">{req.property}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{req.time}</span>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Review
                        </Button>
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
