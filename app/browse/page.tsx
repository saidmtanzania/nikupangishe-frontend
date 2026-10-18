"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Grid3X3, Map, LayoutGrid, AlignJustify, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/properties/property-card"
import { PropertyListCard } from "@/components/properties/property-list-card"
import { FilterSidebar, DEFAULT_FILTERS, type FilterState } from "@/components/properties/filter-sidebar"
import { MapPlaceholder } from "@/components/properties/map-placeholder"
import { propertiesApi, toProperty } from "@/lib/api"
import type { MapPoint } from "@/components/properties/property-map"

type ViewMode = "grid" | "list"

const NEARBY_RADIUS_KM = 5

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

function BrowseContent() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "")
  const [allProperties, setAllProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [isLoadingProps, setIsLoadingProps] = useState(true)

  // Fetch all properties from backend once on mount
  useEffect(() => {
    let cancelled = false
    setIsLoadingProps(true)
    propertiesApi.list({ limit: 100 })
      .then((res) => {
        if (!cancelled) {
          const items = Array.isArray(res) ? res : (res.data ?? [])
          setAllProperties(items.map(toProperty))
        }
      })
      .catch(() => setAllProperties([]))
      .finally(() => { if (!cancelled) setIsLoadingProps(false) })
    return () => { cancelled = true }
  }, [])

  // Sync if the URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "")
  }, [searchParams])

  const [sortBy, setSortBy] = useState("newest")
  const [showMap, setShowMap] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [nearPoint, setNearPoint] = useState<MapPoint | null>(null)

  const filteredProperties = useMemo(() => {
    let results = [...allProperties]

    // Search
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.neighborhood.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q)
      )
    }

    // Price range
    results = results.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Property type
    if (filters.propertyTypes.length > 0) {
      results = results.filter((p) => filters.propertyTypes.includes(p.propertyType))
    }

    // Verified
    if (filters.verifiedOnly) {
      results = results.filter((p) => p.isVerified)
    }

    // Amenities
    if (filters.amenities.length > 0) {
      results = results.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a))
      )
    }

    // Bedrooms
    if (filters.minBedrooms > 0) {
      results = results.filter((p) => p.bedrooms >= filters.minBedrooms)
    }

    // Bathrooms
    if (filters.minBathrooms > 0) {
      results = results.filter((p) => p.bathrooms >= filters.minBathrooms)
    }

    // City
    if (filters.city) {
      const city = filters.city.toLowerCase()
      results = results.filter((p) => p.location.city.toLowerCase() === city)
    }

    // Furnishing
    if (filters.furnishingStatus.length > 0) {
      results = results.filter((p) =>
        p.furnishingStatus ? filters.furnishingStatus.includes(p.furnishingStatus) : false
      )
    }

    // Features (hasWater, hasElectricity, etc.)
    if (filters.features.length > 0) {
      results = results.filter((p) =>
        filters.features.every((feat) => (p as Record<string, unknown>)[feat] === true)
      )
    }

    // Swap only
    if (filters.swapOnly) {
      results = results.filter((p) => p.isOpenToExchange)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        results.sort((a, b) => b.price - a.price)
        break
      case "newest":
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return results
  }, [search, filters, sortBy, allProperties])

  // Selected map point narrows the list to nearby homes, closest first
  const listedProperties = useMemo(() => {
    if (!nearPoint) return filteredProperties
    return filteredProperties
      .map((p) => ({ p, d: distanceKm(nearPoint, p.location) }))
      .filter(({ d }) => d <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.d - b.d)
      .map(({ p }) => p)
  }, [filteredProperties, nearPoint])

  const handleLocationSelect = (point: MapPoint) => {
    setNearPoint(point)
    setShowMap(false)
  }

  return (
    <div className="flex flex-col">
      {/* ── Main content: filter | listings | map ────────────── */}
      <div className="flex w-full" style={{ height: "calc(100vh - 64px)" }}>

        {/* Filter Sidebar – always visible on desktop */}
        <div className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-card p-5 lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Listings column - slightly wider for better card visibility */}
        <div className="flex w-full min-w-0 flex-col overflow-hidden border-r border-border lg:flex-1 xl:w-160 xl:flex-none 2xl:w-180">

          {/* ── Inline controls header (inside listings area) ── */}
          <div className="shrink-0 border-b border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm lg:px-5">
            <div className="flex items-center justify-between gap-2">

              {/* Left: result count */}
              <div className="flex items-center gap-2">
                {isLoadingProps ? (
                  <p className="text-sm text-muted-foreground animate-pulse">Loading properties…</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{listedProperties.length}</span>{" "}
                    <span className="hidden sm:inline">properties</span> found
                  </p>
                )}
              </div>

              {/* Right: controls */}
              <div className="flex items-center gap-2">

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 w-36 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low → High</SelectItem>
                    <SelectItem value="price-high">Price: High → Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* Divider */}
                <div className="hidden h-5 w-px bg-border lg:block" />

                {/* Grid / List toggle */}
                <div className="flex items-center gap-0.5 rounded-lg border border-border bg-secondary p-0.5">
                  <button
                    id="view-grid"
                    aria-label="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${viewMode === "grid"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id="view-list"
                    aria-label="List view"
                    onClick={() => setViewMode("list")}
                    className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${viewMode === "list"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <AlignJustify className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {/* ── Scrollable listings area ── */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-4">

            {/* Mobile Filters Panel */}
            {nearPoint && (
              <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <p className="flex min-w-0 items-center gap-1.5 text-xs text-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">
                    Homes within {NEARBY_RADIUS_KM} km of{" "}
                    <strong>{nearPoint.label ?? "selected location"}</strong>
                  </span>
                </p>
                <button
                  onClick={() => setNearPoint(null)}
                  className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>
            )}
            {showFilters && (
              <div className="mb-4 rounded-xl border border-border bg-card p-4 lg:hidden">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  search={search}
                  onSearchChange={setSearch}
                />
              </div>
            )}

            {/* Property Cards */}
            {isLoadingProps ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-4/3 bg-muted" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listedProperties.length > 0 ? (
              viewMode === "grid" ? (
                /* ── Grid view ── */
                <div className="grid gap-3 sm:grid-cols-2">
                  {listedProperties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} priority={index < 4} />
                  ))}
                </div>
              ) : (
                /* ── List view ── */
                <div className="flex flex-col gap-3">
                  {listedProperties.map((property, index) => (
                    <PropertyListCard key={property.id} property={property} priority={index < 4} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Grid3X3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No properties found</h3>
                <p className="text-sm text-muted-foreground">
                  {nearPoint
                    ? "No homes near this location. Try another spot on the map or clear the location."
                    : "Try adjusting your filters or search query."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map Panel - Fills the rest of the screen to the right */}
        <div className="relative z-0 hidden min-w-0 flex-1 xl:flex xl:flex-col">
          <MapPlaceholder
            properties={filteredProperties}
            selectedPoint={nearPoint}
            radiusKm={NEARBY_RADIUS_KM}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </div>

      {/* Mobile Map FAB */}
      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <Button
          size="sm"
          className="gap-2 rounded-full shadow-lg"
          onClick={() => setShowMap(!showMap)}
        >
          <Map className="h-4 w-4" />
          Map View
        </Button>
      </div>

      {/* Mobile Map Overlay */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden xl:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-lg font-semibold text-foreground">Map View</h2>
              <Button variant="outline" size="sm" onClick={() => setShowMap(false)}>
                Close
              </Button>
            </div>
            <div className="flex-1">
              <MapPlaceholder
                properties={filteredProperties}
                selectedPoint={nearPoint}
                radiusKm={NEARBY_RADIUS_KM}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseContent />
    </Suspense>
  )
}
