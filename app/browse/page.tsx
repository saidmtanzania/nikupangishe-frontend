"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Grid3X3, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/properties/property-card"
import { FilterSidebar, type FilterState } from "@/components/properties/filter-sidebar"
import { MapPlaceholder } from "@/components/properties/map-placeholder"
import { mockProperties } from "@/lib/mock-data"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "")

  // Sync if the URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "")
  }, [searchParams])
  const [sortBy, setSortBy] = useState("newest")
  const [showMap, setShowMap] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [100000, 6000000],
    propertyTypes: [],
    verifiedOnly: false,
    amenities: [],
  })

  const filteredProperties = useMemo(() => {
    let results = [...mockProperties]

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
  }, [search, filters, sortBy])

  return (
    <div className="flex flex-col">
      {/* Controls bar – sort + view toggles only */}
      <div className="border-b border-border bg-card px-4 py-3 lg:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden lg:flex"
            aria-label="Toggle filters"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={showMap ? "default" : "outline"}
            size="icon"
            onClick={() => setShowMap(!showMap)}
            className="hidden lg:flex"
            aria-label="Toggle map"
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content: 3-column on desktop */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-0">
        {/* Filter Sidebar */}
        {showFilters && (
          <div className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-card p-5 lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              search={search}
              onSearchChange={setSearch}
            />
          </div>
        )}

        {/* Listing Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredProperties.length}</span>{" "}
              properties found
            </p>
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {/* Mobile Filters Panel */}
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

          {filteredProperties.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Grid3X3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No properties found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>

        {/* Map Panel */}
        {showMap && (
          <div className="hidden w-[400px] shrink-0 border-l border-border xl:block">
            <MapPlaceholder properties={filteredProperties} />
          </div>
        )}
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
              <MapPlaceholder properties={filteredProperties} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing for mobile nav */}
      <div className="h-16 lg:hidden" />
    </div>
  )
}
