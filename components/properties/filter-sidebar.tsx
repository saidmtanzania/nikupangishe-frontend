"use client"

import { useState } from "react"
import { Check, ChevronDown, Search, SlidersHorizontal, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { formatTZSShort } from "@/lib/utils"

export interface FilterState {
  priceRange: [number, number]
  propertyTypes: string[]
  furnishingStatus: string[]
  city: string
  minBedrooms: number
  minBathrooms: number
  verifiedOnly: boolean
  amenities: string[]
  features: string[]
  swapOnly: boolean
}

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [100000, 6000000],
  propertyTypes: [],
  furnishingStatus: [],
  city: "",
  minBedrooms: 0,
  minBathrooms: 0,
  verifiedOnly: false,
  amenities: [],
  features: [],
  swapOnly: false,
}

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio", label: "Studio" },
  { value: "room", label: "Room" },
  { value: "single-room", label: "Single Room" },
  { value: "standalone", label: "Standalone" },
  { value: "commercial", label: "Commercial" },
]

const furnishingOptions = [
  { value: "furnished", label: "Furnished" },
  { value: "semi_furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
]

const tanzaniaCities = [
  "Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Mbeya",
  "Zanzibar", "Tanga", "Morogoro", "Iringa", "Kilimanjaro",
]

const amenityOptions = [
  "Parking", "Security", "Water Supply", "Swimming Pool",
  "Gym", "Generator", "Wi-Fi", "Garden",
  "Balcony", "Elevator", "Laundry", "Rooftop",
]

const featureOptions = [
  { value: "hasWater", label: "Water Supply" },
  { value: "hasElectricity", label: "Electricity" },
  { value: "hasInternet", label: "Internet" },
  { value: "hasSecurityGuard", label: "Security Guard" },
  { value: "hasCCTV", label: "CCTV" },
  { value: "hasGarden", label: "Garden" },
  { value: "petFriendly", label: "Pet Friendly" },
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
    furnishing: false,
    location: false,
    bedrooms: true,
    bathrooms: false,
    features: false,
    amenities: false,
  })

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }))

  const toggleMulti = (field: "propertyTypes" | "furnishingStatus" | "features" | "amenities", val: string) => {
    const arr = filters[field] as string[]
    onFilterChange({
      ...filters,
      [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
    })
  }

  const bedroomOptions = [
    { label: "Any", value: 0 },
    { label: "1+", value: 1 },
    { label: "2+", value: 2 },
    { label: "3+", value: 3 },
    { label: "4+", value: 4 },
  ]

  const Section = ({ label, expandKey, children }: { label: string; expandKey: keyof typeof expanded; children: React.ReactNode }) => (
    <div>
      <button
        onClick={() => toggle(expandKey)}
        className="mb-3 flex w-full items-center justify-between text-sm font-medium text-foreground"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded[expandKey] ? "rotate-180" : ""}`} />
      </button>
      {expanded[expandKey] && children}
    </div>
  )

  return (
    <aside className="flex flex-col gap-5">
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
          placeholder="Search neighborhoods, titles…"
          className="w-full bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
          autoComplete="off"
        />
      </div>

      {/* Price Range */}
      <Section label="Price Range" expandKey="price">
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
      </Section>

      <Separator />

      {/* City */}
      <Section label="City" expandKey="location">
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onFilterChange({ ...filters, city: "" })}
            className={`rounded-md border px-3 py-1.5 text-left text-xs font-medium transition-all ${
              !filters.city
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            Any city
          </button>
          {tanzaniaCities.map((c) => (
            <button
              key={c}
              onClick={() => onFilterChange({ ...filters, city: filters.city === c ? "" : c })}
              className={`rounded-md border px-3 py-1.5 text-left text-xs font-medium transition-all ${
                filters.city === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Property Type */}
      <Section label="Property Type" expandKey="type">
        <div className="flex flex-col gap-2.5">
          {propertyTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={filters.propertyTypes.includes(type.value)}
                onCheckedChange={() => toggleMulti("propertyTypes", type.value)}
              />
              <Label htmlFor={`type-${type.value}`} className="text-sm font-normal text-foreground cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Furnishing */}
      <Section label="Furnishing" expandKey="furnishing">
        <div className="flex flex-col gap-2.5">
          {furnishingOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={`furnish-${opt.value}`}
                checked={filters.furnishingStatus.includes(opt.value)}
                onCheckedChange={() => toggleMulti("furnishingStatus", opt.value)}
              />
              <Label htmlFor={`furnish-${opt.value}`} className="text-sm font-normal text-foreground cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Bedrooms */}
      <Section label="Bedrooms" expandKey="bedrooms">
        <div className="flex gap-1.5">
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filters, minBedrooms: opt.value })}
              className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                filters.minBedrooms === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Bathrooms */}
      <Section label="Bathrooms" expandKey="bathrooms">
        <div className="flex gap-1.5">
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange({ ...filters, minBathrooms: opt.value })}
              className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-all ${
                filters.minBathrooms === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Verified / Swap toggles */}
      <div className="flex flex-col gap-3">
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
        <div className="flex items-center gap-2">
          <Checkbox
            id="swap-only"
            checked={filters.swapOnly}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, swapOnly: Boolean(checked) })
            }
          />
          <Label htmlFor="swap-only" className="flex items-center gap-1.5 text-sm font-normal text-foreground cursor-pointer">
            <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
            Available for Swap
          </Label>
        </div>
      </div>

      <Separator />

      {/* Utility Features */}
      <Section label="Features" expandKey="features">
        <div className="flex flex-col gap-2.5">
          {featureOptions.map((feat) => (
            <div key={feat.value} className="flex items-center gap-2">
              <Checkbox
                id={`feat-${feat.value}`}
                checked={filters.features.includes(feat.value)}
                onCheckedChange={() => toggleMulti("features", feat.value)}
              />
              <Label htmlFor={`feat-${feat.value}`} className="text-sm font-normal text-foreground cursor-pointer">
                {feat.label}
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Amenities */}
      <Section label="Amenities" expandKey="amenities">
        <div className="flex flex-col gap-2.5">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleMulti("amenities", amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal text-foreground cursor-pointer">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Reset */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onFilterChange(DEFAULT_FILTERS)
          onSearchChange("")
        }}
      >
        Reset Filters
      </Button>
    </aside>
  )
}

