import type { Metadata } from "next"
import { mockExchangeRequests, mockProperties } from "@/lib/mock-data"
import { ExchangeCard } from "@/components/exchange/exchange-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTZS } from "@/lib/utils"
import {
  ArrowLeftRight,
  Shield,
  Search,
  FileCheck,
  Home,
  MapPin,
  BedDouble,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "House Exchange - Nikupangishe",
  description: "Swap your current rental with another verified tenant on Nikupangishe. Simple, safe, and transparent.",
}

const exchangeableProperties = mockProperties.filter((p) =>
  ["prop-1", "prop-5", "prop-8", "prop-2"].includes(p.id)
)

const steps = [
  { icon: <Search className="h-5 w-5" />, title: "Browse Listings", description: "Find a property you'd like to move to from verified listings" },
  { icon: <FileCheck className="h-5 w-5" />, title: "Submit Request", description: "Send an exchange request explaining why you want to swap" },
  { icon: <Shield className="h-5 w-5" />, title: "Verification", description: "Both property owners review and approve the exchange" },
  { icon: <Home className="h-5 w-5" />, title: "Move In", description: "Once approved, coordinate the move with the platform's support" },
]

export default function ExchangePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-16">
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary">
              <ArrowLeftRight className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
              House Exchange
            </h1>
            <p className="text-muted-foreground leading-relaxed text-balance">
              Want to move but love the Nikupangishe ecosystem? Swap your current verified
              rental with another tenant. No brokers, no hidden fees -- just a simple,
              transparent exchange between verified tenants.
            </p>
            <div className="flex gap-3 mt-2">
              <Button size="lg" asChild>
                <Link href="#available">Browse Available Swaps</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Start an Exchange</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <h2 className="text-xl font-bold text-foreground text-center mb-8">How Exchange Works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary relative">
                  {step.icon}
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Properties for Exchange */}
      <section id="available" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Available for Exchange</h2>
              <p className="text-sm text-muted-foreground mt-1">Properties whose tenants are open to swapping</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/browse">View All Listings</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {exchangeableProperties.map((property, idx) => (
              <Card key={property.id} className="overflow-hidden border-border group">
                <div className="relative h-40">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    {...(idx === 0 ? { priority: true } : { loading: "lazy" as const })}
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground border-0 text-xs">Open to Swap</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {property.location.neighborhood}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> {property.bedrooms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-primary">{formatTZS(property.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    <Link href={`/properties/${property.id}`} className="text-xs text-primary hover:underline">Details</Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Exchange Requests */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Recent Exchange Requests</h2>
          <p className="text-sm text-muted-foreground mb-6">See what tenants are swapping across the platform</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {mockExchangeRequests.map((exchange) => (
              <ExchangeCard key={exchange.id} exchange={exchange} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Verified Tenants Only
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                Verified Listings
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                Zero Exchange Fees
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
