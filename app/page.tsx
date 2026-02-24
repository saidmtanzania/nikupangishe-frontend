import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  ArrowLeftRight,
  Home,
  Users,
  Briefcase,
  CheckCircle2,
  MapPin,
  Star,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockProperties } from "@/lib/mock-data"
import { formatTZS } from "@/lib/utils"
import { HeroSearch } from "@/components/home/hero-search"

export default function LandingPage() {
  const featured = mockProperties.filter((p) => p.isUnique).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-dar.jpg"
            alt="Dar es Salaam cityscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1210]/90 via-[#1a1210]/70 to-[#1a1210]/40" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 lg:px-6">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ec5413]/30 bg-[#ec5413]/10 px-4 py-1.5 text-sm font-medium text-[#fef1eb]">
              <Shield className="h-4 w-4" />
              <span>100% Verified Listings</span>
            </div>
            <h1 className="mb-4 text-balance text-4xl font-bold leading-tight tracking-tight text-[#f5f0eb] md:text-5xl lg:text-6xl">
              Find Your Perfect Home in Tanzania
            </h1>
            <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-[#a89585]">
              Owner-led, agent-powered, tenant-first. Browse verified long-term
              rentals across Dar es Salaam and beyond.
            </p>

            {/* Search Bar */}
            <HeroSearch />

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { value: "1,200+", label: "Verified Listings" },
                { value: "5,000+", label: "Happy Tenants" },
                { value: "300+", label: "Trusted Agents" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-[#ec5413]">{stat.value}</span>
                  <span className="text-sm text-[#a89585]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tailored For You */}
      <section className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-balance text-3xl font-bold text-foreground lg:text-4xl">
              Tailored For You
            </h2>
            <p className="mx-auto max-w-lg text-pretty text-muted-foreground">
              Whether you are looking for a home, managing properties, or connecting tenants with owners,
              Nikupangishe has you covered.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Home,
                title: "For Tenants",
                desc: "Find verified rentals, chat with owners, and even exchange your current home for a new one.",
                href: "/browse",
                cta: "Browse Homes",
              },
              {
                icon: Users,
                title: "For Owners",
                desc: "List your property, manage tenants, and get agent support - all from one dashboard.",
                href: "/dashboard/owner",
                cta: "List Property",
              },
              {
                icon: Briefcase,
                title: "For Agents",
                desc: "Get assigned to houses, schedule viewings, earn commissions, and grow your portfolio.",
                href: "/dashboard/agent",
                cta: "Join as Agent",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                  {card.cta}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
                Featured Listings
              </h2>
              <p className="text-muted-foreground">Handpicked verified properties</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/browse">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    {property.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-2.5 py-1 text-xs font-medium text-[#ffffff]">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                    {property.isUnique && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                        <Star className="h-3 w-3" />
                        Unique
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-md bg-[#1a1210]/80 px-3 py-1.5 text-sm font-semibold text-[#f5f0eb] backdrop-blur-sm">
                    {formatTZS(property.price)}/mo
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-base font-semibold text-card-foreground">
                    {property.title}
                  </h3>
                  <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.location.neighborhood}, {property.location.city}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms} Bed{property.bedrooms !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms} Bath{property.bathrooms !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      {property.area} m&sup2;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/browse">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* House Exchange CTA */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <ArrowLeftRight className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-balance text-3xl font-bold text-primary-foreground lg:text-4xl">
                House Exchange
              </h2>
              <p className="max-w-xl text-pretty text-primary-foreground/80">
                Want to move but your lease is not up? Swap homes with another verified tenant.
                Nikupangishe makes it seamless and safe.
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="whitespace-nowrap"
            >
              <Link href="/exchange">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              From search to move-in, we have simplified the rental process.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Search", desc: "Browse verified listings by location, price, and type." },
              { step: "02", title: "Connect", desc: "Chat directly with owners or their assigned agents." },
              { step: "03", title: "Verify", desc: "Every property is GPS-verified and agent-inspected." },
              { step: "04", title: "Move In", desc: "Secure your new home with transparent terms." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-[#1a1210] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#f5f0eb] lg:text-4xl">
              Trust & Safety
            </h2>
            <p className="mx-auto max-w-lg text-[#a89585]">
              Your safety is our top priority. Every listing goes through our rigorous verification process.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                desc: "Every property is physically inspected and GPS-verified by our agent network.",
              },
              {
                icon: CheckCircle2,
                title: "Trusted Owners",
                desc: "Property owners go through identity verification before listing.",
              },
              {
                icon: Users,
                title: "Licensed Agents",
                desc: "All agents are vetted and accountable through our commission tracking system.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#3a2d22] bg-[#241c17] p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ec5413]/10">
                  <item.icon className="h-6 w-6 text-[#ec5413]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#f5f0eb]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#a89585]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground lg:text-4xl">
              What People Say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Amina J.",
                role: "Tenant",
                quote: "I found my apartment in Masaki within 2 days. The verification gave me confidence that the listing was real.",
              },
              {
                name: "David K.",
                role: "Property Owner",
                quote: "Managing my 5 properties is so much easier now. The agent assignment feature saved me countless hours.",
              },
              {
                name: "Emmanuel N.",
                role: "Agent",
                quote: "The commission tracking is transparent and the viewing scheduler keeps me organized. Best platform for agents.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <p className="mb-4 flex-1 text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground lg:text-4xl">
            Ready to Find Your Home?
          </h2>
          <p className="mb-8 text-pretty text-muted-foreground">
            Join thousands of Tanzanians who trust Nikupangishe for verified, safe, and transparent rentals.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/browse">Browse Listings</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom spacing for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
