"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ArrowLeftRight, MessageSquare, Shield } from "lucide-react"

const footerLinks = {
  platform: [
    { href: "/browse", label: "Browse Listings" },
    { href: "/exchange", label: "House Exchange" },
    { href: "/auth/register", label: "List Your Property" },
  ],
  roles: [
    { href: "/dashboard/tenant", label: "For Tenants" },
    { href: "/dashboard/owner", label: "For Owners" },
    { href: "/dashboard/agent", label: "For Agents" },
  ],
  support: [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Safety Guide" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
  ],
}

export function Footer() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const isChat = pathname.startsWith("/chat")
  const isOnboarding = pathname.startsWith("/onboarding")

  if (isDashboard || isChat || isOnboarding) return null

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                Nikupangishe
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tanzania&apos;s trusted platform for verified long-term rentals.
              Owner-led, agent-powered, tenant-first.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Verified Listings</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Platform</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For You */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">For You</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.roles.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Support</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 Nikupangishe. All rights reserved. Made in Tanzania.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/browse" className="text-muted-foreground transition-colors hover:text-foreground">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Link>
            <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
            <Link href="/exchange" className="text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeftRight className="h-4 w-4" />
              <span className="sr-only">Exchange</span>
            </Link>
            <Link href="/chat" className="text-muted-foreground transition-colors hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
