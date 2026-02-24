"use client"

import { useState } from "react"
import { Check, ChevronDown, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { formatTZSShort } from "@/lib/utils"

export interface FilterState {
  priceRange: [number, number]
  propertyTypes: string[]
  verifiedOnly: boolean
  amenities: string[]
}

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "standalone", label: "Standalone House" },
  { value: "single-room", label: "Single Room" },
  { value: "commercial", label: "Commercial" },
]

const amenityOptions = [
  "Parking",
  "Security",
  "Swimming Pool",
  "Gym",
  "Generator",
  "WiFi",
  "Garden",
  "Servant Quarters",
  "Balcony",
  "Elevator",
]

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  search: string
  onSearchChange: (value: string) => void
}

export function FilterSidebar({ filters, onFilterChange, search, onSearchChange }: FilterSidebarProps) {
  const [expanded, setExpanded] = useState({
    price: true,
    type: true,
    amenities: false,
  })

  const toggleType = (type: string) => {
    const types = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type]
    onFilterChange({ ...filters, propertyTypes: types })
  }

  const toggleAmenity = (amenity: string) => {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    onFilterChange({ ...filters, amenities })
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
      </div>

      <Separator />

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search neighborhoods, cities…"
          className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          autoComplete="off"
        />
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => setExpanded((p) => ({ ...p, price: !p.price }))}
          className="mb-3 flex w-full items-center justify-between text-sm font-medium text-foreground"
        >
          Price Range
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.price ? "rotate-180" : ""}`} />
        </button>
        {expanded.price && (
          <div className="flex flex-col gap-3">
            <Slider
              min={100000}
              max={6000000}
              step={50000}
              value={filters.priceRange}
              onValueChange={(value) =>
                onFilterChange({ ...filters, priceRange: value as [number, number] })
              }
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTZSShort(filters.priceRange[0])}</span>
              <span>{formatTZSShort(filters.priceRange[1])}</span>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Property Type */}
      <div>
        <button
          onClick={() => setExpanded((p) => ({ ...p, type: !p.type }))}
          className="mb-3 flex w-full items-center justify-between text-sm font-medium text-foreground"
        >
          Property Type
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.type ? "rotate-180" : ""}`} />
        </button>
        {expanded.type && (
          <div className="flex flex-col gap-2.5">
            {propertyTypes.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.propertyTypes.includes(type.value)}
                  onCheckedChange={() => toggleType(type.value)}
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm font-normal text-foreground cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified-only"
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) =>
            onFilterChange({ ...filters, verifiedOnly: Boolean(checked) })
          }
        />
        <Label htmlFor="verified-only" className="flex items-center gap-1.5 text-sm font-normal text-foreground cursor-pointer">
          <Check className="h-3.5 w-3.5 text-[#059669]" />
          Verified only
        </Label>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <button
          onClick={() => setExpanded((p) => ({ ...p, amenities: !p.amenities }))}
          className="mb-3 flex w-full items-center justify-between text-sm font-medium text-foreground"
        >
          Amenities
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded.amenities ? "rotate-180" : ""}`} />
        </button>
        {expanded.amenities && (
          <div className="flex flex-col gap-2.5">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal text-foreground cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onFilterChange({
            priceRange: [100000, 6000000],
            propertyTypes: [],
            verifiedOnly: false,
            amenities: [],
          })
          onSearchChange("")
        }}
      >
        Reset Filters
      </Button>
    </aside>
  )
}
