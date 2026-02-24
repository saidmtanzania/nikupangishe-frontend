"use client"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockProperties, mockTenancies, mockExchangeRequests, mockUsers } from "@/lib/mock-data"
import { formatTZS, cn } from "@/lib/utils"
import {
  Home,
  Heart,
  ArrowLeftRight,
  MessageSquare,
  MapPin,
  Shield,
  BedDouble,
  Bath,
  Maximize2,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const tenant = mockUsers.find((u) => u.id === "user-1")!
const tenancy = mockTenancies.find((t) => t.tenantId === tenant.id)!
const currentProperty = mockProperties.find((p) => p.id === tenancy.propertyId)!
const tenantExchanges = mockExchangeRequests.filter((e) => e.fromTenantId === tenant.id)

const favoriteProperties = mockProperties.filter((p) => ["prop-1", "prop-6", "prop-8"].includes(p.id))

const stats = [
  { label: "Current Rent", value: formatTZS(tenancy.monthlyRent), change: "Next due Mar 1", changeType: "neutral" as const },
  { label: "Favorites", value: favoriteProperties.length, change: "+1 this week", changeType: "positive" as const },
  { label: "Exchange Requests", value: tenantExchanges.length, change: `${tenantExchanges.filter(e => e.status === "pending").length} pending`, changeType: "neutral" as const },
  { label: "Unread Messages", value: 3, change: "2 new today", changeType: "positive" as const },
]

const statIcons = [
  <Home key="home" className="h-5 w-5" />,
  <Heart key="heart" className="h-5 w-5" />,
  <ArrowLeftRight key="exchange" className="h-5 w-5" />,
  <MessageSquare key="msg" className="h-5 w-5" />,
]

export default function TenantDashboard() {
  return (
    <>
      <DashboardSidebar role="tenant" userName={tenant.name} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome, {tenant.name.split(" ")[0]}</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tenancy, explore listings, and request exchanges
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} icon={statIcons[i]} />
            ))}
          </div>

          {/* Current Home */}
          <div id="home" className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">My Current Home</h2>
            <Card className="overflow-hidden border-border">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-72 shrink-0">
                  <Image
                    src={currentProperty.images[0]}
                    alt={currentProperty.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-chart-2 text-primary-foreground border-0">Active Lease</Badge>
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{currentProperty.title}</h3>
                      {currentProperty.isVerified && <Shield className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {currentProperty.location.neighborhood}, {currentProperty.location.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {currentProperty.bedrooms} bed</div>
                    <div className="flex items-center gap-1"><Bath className="h-4 w-4" /> {currentProperty.bathrooms} bath</div>
                    <div className="flex items-center gap-1"><Maximize2 className="h-4 w-4" /> {currentProperty.area} sqm</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-primary">{formatTZS(tenancy.monthlyRent)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <p className="text-xs text-muted-foreground">Lease started {tenancy.startDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/exchange">Request Exchange</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/chat">Contact Owner</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Favorites */}
          <div id="favorites" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Saved Properties</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/browse">Browse More</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {favoriteProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden border-border group">
                  <div className="relative h-40">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <button className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-destructive">
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 mb-2">
                      <MapPin className="h-3 w-3" />
                      {property.location.neighborhood}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">{formatTZS(property.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                      <Link href={`/properties/${property.id}`} className="text-xs text-primary hover:underline">
                        View Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Exchange Requests */}
          <div id="exchanges">
            <h2 className="text-lg font-semibold text-foreground mb-4">Exchange Requests</h2>
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Track your house exchange requests</CardTitle>
              </CardHeader>
              <CardContent>
                {tenantExchanges.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {tenantExchanges.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                            <ArrowLeftRight className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {ex.fromPropertyTitle} → {ex.toPropertyTitle}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Requested {ex.createdAt}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            ex.status === "pending" && "border-chart-4 text-chart-4",
                            ex.status === "approved" && "border-chart-2 text-chart-2",
                            ex.status === "rejected" && "border-destructive text-destructive",
                          )}
                        >
                          {ex.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No exchange requests yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
