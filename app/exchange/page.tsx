import type { Metadata } from "next"
import { propertiesApi, toProperty } from "@/lib/api"
import { PropertyCard } from "@/components/properties/property-card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftRight,
  Shield,
  Search,
  FileCheck,
  Home,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "House Exchange - Nikupangishe",
  description: "Swap your current rental with another verified tenant on Nikupangishe. Simple, safe, and transparent.",
}

const steps = [
  { icon: <Search className="h-5 w-5" />, title: "Browse Listings", description: "Find a property you'd like to move to from verified listings" },
  { icon: <FileCheck className="h-5 w-5" />, title: "Submit Request", description: "Send an exchange request explaining why you want to swap" },
  { icon: <Shield className="h-5 w-5" />, title: "Verification", description: "Both property owners review and approve the exchange" },
  { icon: <Home className="h-5 w-5" />, title: "Move In", description: "Once approved, coordinate the move with the platform's support" },
]

export default async function ExchangePage() {
  let exchangeableProperties: ReturnType<typeof toProperty>[] = []
  try {
    const res = await propertiesApi.list({ isOpenToExchange: true, limit: 8 })
    const items = Array.isArray(res) ? res : (res.data ?? [])
    exchangeableProperties = items.map(toProperty)
  } catch {
    exchangeableProperties = []
  }
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
            {exchangeableProperties.length > 0 ? exchangeableProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                badge={
                  <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Open to Swap
                  </span>
                }
              />
            )) : (
              <p className="col-span-4 py-12 text-center text-sm text-muted-foreground">No properties currently available for exchange. Check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Exchange Requests - requires login */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Want to Start an Exchange?</h2>
          <p className="text-sm text-muted-foreground mb-6">Log in to submit an exchange request and see pending swaps in your area.</p>
          <Button asChild>
            <Link href="/auth/login">Log In to Start</Link>
          </Button>
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
