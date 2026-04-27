"use client"

import { Star, MapPin, Bed, Bath, Maximize, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { formatTZS } from "@/lib/utils"

export function PropertyCard({
  property,
  priority = false,
  badge
}: {
  property: Property;
  priority?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <Link
      href={`/properties/${property.id.slice(0, 8)}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          {...(priority ? { priority: true } : { loading: "lazy" })}
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badge}
          {property.isOpenToExchange && (
            <span className="inline-flex items-center rounded-md bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              Swap
            </span>
          )}
          {property.isVerified && (
            <span className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              Verified
            </span>
          )}
          {property.isUnique && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
              <Star className="h-3 w-3" />
              Unique
            </span>
          )}
        </div>
        {/* Favorite */}
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-primary"
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
        {/* Price */}
        <div className="absolute bottom-3 left-3 rounded-md bg-[#1a1210]/80 px-3 py-1.5 text-sm font-semibold text-[#f5f0eb] backdrop-blur-sm">
          {formatTZS(property.price)}/mo
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-0.5 line-clamp-1 text-sm font-bold text-card-foreground lg:text-base">
          {property.title}
        </h3>
        <p className="mb-2 flex items-center gap-1 text-[11px] text-muted-foreground lg:text-xs">
          <MapPin className="h-3 w-3 shrink-0" />
          {property.location.neighborhood}, {property.location.city}
        </p>
        <div className="mt-auto flex items-center gap-3 text-[11px] text-muted-foreground lg:text-xs">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {property.bedrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Maximize className="h-3.5 w-3.5" />
            {property.area}&nbsp;m&sup2;
          </span>
          <span className="ml-auto rounded bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-secondary-foreground">
            {property.propertyType === "single-room" ? "Room" : property.propertyType}
          </span>
        </div>
      </div>
    </Link>
  )
}
