import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  ArrowLeftRight,
  Home,
  Users,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  MapPin,
  Bed,
  Bath,
  Star,
  Quote,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { propertiesApi, toProperty } from "@/lib/api"
import { formatTZS } from "@/lib/utils"
import { HeroSearch } from "@/components/home/hero-search"
import { PropertyCard } from "@/components/properties/property-card"
import { Reveal } from "@/components/home/reveal"
import { ScrollProgress } from "@/components/home/scroll-progress"

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string
  title: string
  description?: string
  dark?: boolean
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </span>
      <h2 className={`mb-4 text-balance text-3xl font-bold tracking-tight lg:text-4xl ${dark ? "text-[#f5f0eb]" : "text-foreground"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-pretty leading-relaxed ${dark ? "text-[#a89585]" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}

export default async function LandingPage() {
  let featured: ReturnType<typeof toProperty>[] = []
  try {
    const res = await propertiesApi.list({ limit: 12 })
    const items = (Array.isArray(res) ? res : (res.data ?? [])).map(toProperty)
    // Unique listings first, then verified, so the showcase stays strong
    featured = [...items]
      .sort((a, b) => Number(b.isUnique) - Number(a.isUnique) || Number(b.isVerified) - Number(a.isVerified))
      .slice(0, 3)
  } catch {
    featured = []
  }
  const spotlight = featured[0]

  return (
    <div className="flex flex-col">
      <ScrollProgress />

      {/* Hero Section */}
      <section className="relative flex min-h-150 items-center overflow-hidden lg:min-h-170">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-dar.jpg"
            alt="Dar es Salaam cityscape"
            fill
            sizes="100vw"
            className="object-cover"
            preload
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#1a1210]/95 via-[#1a1210]/75 to-[#1a1210]/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#1a1210]/60 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-[1fr_380px] lg:px-6">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ec5413]/30 bg-[#ec5413]/10 px-4 py-1.5 text-sm font-medium text-[#fef1eb]">
              <Shield className="h-4 w-4" />
              <span>100% Verified Listings</span>
            </div>
            <h1 className="mb-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[#f5f0eb] md:text-5xl lg:text-6xl">
              Find Your Perfect Home in <span className="text-primary">Tanzania</span>
            </h1>
            <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-[#a89585]">
              Owner-led, agent-powered, tenant-first. Browse verified long-term
              rentals across Tanzania and beyond.
            </p>

            {/* Search Bar */}
            <HeroSearch />

            {/* Quick Stats */}
            <div className="mt-10 flex max-w-xl divide-x divide-[#3a2d22]">
              {[
                { value: "1,200+", label: "Verified Listings" },
                { value: "5,000+", label: "Happy Tenants" },
                { value: "300+", label: "Trusted Agents" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-1 flex-col px-4 first:pl-0 sm:px-6">
                  <span className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</span>
                  <span className="text-xs text-[#a89585] sm:text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {spotlight && (
            <Link
              href={`/properties/${spotlight.id.slice(0, 8)}`}
              className="group hidden overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-md transition-transform animate-in fade-in slide-in-from-right-8 delay-200 fill-mode-both duration-700 hover:-translate-y-1 lg:block"
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={spotlight.images[0]}
                  alt={spotlight.title}
                  fill
                  sizes="380px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {spotlight.isVerified && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="px-1 pb-1 pt-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-[#d8c8bb]">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {spotlight.location.neighborhood}, {spotlight.location.city}
                </p>
                <h3 className="mb-3 line-clamp-1 font-semibold text-white">{spotlight.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    {formatTZS(spotlight.price)}
                    <span className="text-xs font-normal text-[#d8c8bb]">/mo</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#d8c8bb]">
                    <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{spotlight.bedrooms}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{spotlight.bathrooms}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        <a
          href="#tailored"
          aria-label="Scroll to content"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[#a89585] transition-colors hover:text-primary md:flex"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      {/* Tailored For You */}
      <section id="tailored" className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHeading
            eyebrow="Built for everyone"
            title="Tailored For You"
            description="Whether you are looking for a home, managing properties, or connecting tenants with owners, Nikupangishe has you covered."
          />
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
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 120} className="h-full">
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary">
                  <card.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{card.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                  {card.cta}
                  <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featured.length > 0 && (
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
              <div>
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Featured
                </span>
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                  Handpicked Homes
                </h2>
                <p className="text-muted-foreground">Verified properties our team loves right now.</p>
              </div>
              <Button variant="outline" asChild className="group w-fit gap-1.5">
                <Link href="/browse">
                  View All Listings
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, i) => (
                <Reveal key={property.id} delay={i * 120} className="h-full [&>a]:h-full">
                  <PropertyCard property={property} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* House Exchange CTA */}
      <section className={`bg-background pb-16 lg:pb-24 ${featured.length > 0 ? "" : "pt-16 lg:pt-24"}`}>
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-[#b83d0d] px-6 py-12 shadow-xl shadow-primary/20 sm:px-10 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <ArrowLeftRight className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-balance text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl">
                  House Exchange
                </h2>
                <p className="mx-auto max-w-xl text-pretty leading-relaxed text-primary-foreground/85 lg:mx-0">
                  Want to move but your lease is not up? Swap homes with another verified tenant.
                  Nikupangishe makes it seamless and safe.
                </p>
              </div>
              <Button size="lg" variant="secondary" asChild className="group gap-1.5 whitespace-nowrap">
                <Link href="/exchange">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHeading
            eyebrow="Simple process"
            title="How It Works"
            description="From search to move-in, we have simplified the rental process."
          />
          <div className="relative grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-linear-to-r from-transparent via-primary/30 to-transparent md:block" />
            {[
              { step: "01", title: "Search", desc: "Browse verified listings by location, price, and type." },
              { step: "02", title: "Connect", desc: "Chat directly with owners or their assigned agents." },
              { step: "03", title: "Verify", desc: "Every property is GPS-verified and agent-inspected." },
              { step: "04", title: "Move In", desc: "Secure your new home with transparent terms." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 120} className="relative flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-card bg-accent text-lg font-bold text-primary shadow-sm ring-1 ring-primary/20">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="max-w-60 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="bg-[#1a1210] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHeading
            dark
            eyebrow="Peace of mind"
            title="Trust & Safety"
            description="Your safety is our top priority. Every listing goes through our rigorous verification process."
          />
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
            ].map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 120}
                className="rounded-2xl border border-[#3a2d22] bg-[#241c17] p-7 transition-colors hover:border-primary/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ec5413]/10">
                  <item.icon className="h-6 w-6 text-[#ec5413]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#f5f0eb]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#a89585]">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <SectionHeading
            eyebrow="Testimonials"
            title="What People Say"
            description="Tenants, owners, and agents across Tanzania trust Nikupangishe."
          />
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
            ].map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 120}
                className="relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground/80">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal className="rounded-3xl border border-primary/15 bg-accent/60 px-6 py-14 text-center sm:px-10 lg:py-20">
            <h2 className="mx-auto mb-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Ready to Find Your Home?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Join thousands of Tanzanians who trust Nikupangishe for verified, safe, and transparent rentals.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild className="group w-full gap-1.5 sm:w-auto">
                <Link href="/browse">
                  Browse Listings
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full bg-background sm:w-auto">
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
