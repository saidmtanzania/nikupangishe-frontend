"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Search, Menu, X, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/exchange", label: "Exchange" },
  { href: "/dashboard/owner", label: "Owner" },
  { href: "/dashboard/agent", label: "Agent" },
  { href: "/dashboard/tenant", label: "Tenant" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDashboard = pathname.startsWith("/dashboard")
  const isChat = pathname.startsWith("/chat")

  if (isDashboard || isChat) return null

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            Nikupangishe
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
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

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/browse">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chat">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/auth/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/register">Get Started</Link>
          </Button>
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
