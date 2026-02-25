"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Shield, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/exchange", label: "Exchange" },
  { href: "/dashboard/owner", label: "Owner" },
  { href: "/dashboard/agent", label: "Agent" },
  { href: "/dashboard/tenant", label: "Tenant" },
]

interface HeaderProps {
  minimal?: boolean
  title?: string
}

export function Header({ minimal = false, title }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDashboard = pathname.startsWith("/dashboard")
  const isChat = pathname.startsWith("/chat")
  const isOnboarding = pathname.startsWith("/onboarding")

  if (!minimal && (isDashboard || isChat || isOnboarding)) return null

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className={cn(
        "flex items-center justify-between",
        minimal ? "h-20 w-full px-8" : "mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8"
      )}>
        {/* Logo or Title */}
        {!minimal ? (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground italic">N</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              Nikupangishe
            </span>
          </Link>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-foreground uppercase tracking-tight">{title || "Nikupangishe Portal"}</h1>
          </div>
        )}

        {/* Desktop Nav */}
        {!minimal && (
          <nav className="hidden ml-auto items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 ml-4 lg:flex">
          {!minimal ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-9 gap-2 rounded-lg border-border/40 bg-white px-4 text-[12px] font-bold shadow-sm hover:bg-muted/50">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span>Trust Center</span>
              </Button>
              <Button size="sm" className="h-9 gap-2 rounded-lg bg-primary px-4 text-[12px] font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add House</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-md p-2 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
