"use client"

import dynamic from "next/dynamic"
import { MapPin, CheckCircle2 } from "lucide-react"
import type { Property } from "@/lib/types"

// Dynamically import so Leaflet never runs on the server
const PropertyMap = dynamic(
  () => import("@/components/properties/property-map"),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex-1 overflow-hidden">
        {/* Pulsing tile skeleton */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f3ece7] via-[#f8f6f4] to-[#f3ece7]" />

        {/* Fake road lines */}
        <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="35%" x2="100%" y2="38%" stroke="#ec5413" strokeWidth="5" />
          <line x1="0" y1="55%" x2="100%" y2="52%" stroke="#ec5413" strokeWidth="3" />
          <line x1="25%" y1="0" x2="28%" y2="100%" stroke="#ec5413" strokeWidth="5" />
          <line x1="65%" y1="0" x2="62%" y2="100%" stroke="#ec5413" strokeWidth="3" />
          <line x1="0" y1="72%" x2="40%" y2="68%" stroke="#ec5413" strokeWidth="2" />
          <line x1="60%" y1="20%" x2="100%" y2="22%" stroke="#ec5413" strokeWidth="2" />
        </svg>

        {/* Loading indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 animate-bounce text-primary" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Loading OpenStreetMap…</p>
        </div>

        {/* OSM attribution */}
        <div className="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-0.5 text-[10px] text-gray-500 backdrop-blur-sm">
          © OpenStreetMap contributors
        </div>
      </div>
    ),
  }
)

export function MapPlaceholder({ properties }: { properties: Property[] }) {
  const verified = properties.filter((p) => p.isVerified).length
  const unverified = properties.length - verified

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Header bar ─────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-border bg-card px-4 py-3">
        {/* Title row */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Dar es Salaam
            </span>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {properties.length} {properties.length === 1 ? "property" : "properties"}
          </span>
        </div>

        {/* Legend row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {/* Verified pin swatch */}
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm"
              style={{ background: "#ec5413" }}
            />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Verified
              <strong className="text-foreground">{verified}</strong>
            </span>
          </div>
          {unverified > 0 && (
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm"
                style={{ background: "#a89585" }}
              />
              <span className="text-xs text-muted-foreground">
                Unverified
                <strong className="ml-1 text-foreground">{unverified}</strong>
              </span>
            </div>
          )}
          <p className="ml-auto text-[10px] text-muted-foreground/70">
            Click a pin for details
          </p>
        </div>
      </div>

      {/* ── Map fills the rest ──────────────────────────────────── */}
      <div className="relative min-h-0 flex-1">
        <PropertyMap properties={properties} />
      </div>

      {/* ── Footer attribution strip ────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-card/80 px-4 py-1.5 text-center backdrop-blur-sm">
        <p className="text-[10px] text-muted-foreground">
          Map data ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            OpenStreetMap
          </a>{" "}
          contributors — free & open
        </p>
      </div>
    </div>
  )
}
