"use client"

import { Star, MapPin, Bed, Bath, Maximize, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { formatTZS } from "@/lib/utils"

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          {...(priority ? { priority: true } : { loading: "lazy" })}
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {property.isVerified && (
            <span className="inline-flex items-center rounded-full bg-[#059669] px-2.5 py-1 text-xs font-medium text-[#ffffff]">
              Verified
            </span>
          )}
          {property.isUnique && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
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
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-card-foreground">
          {property.title}
        </h3>
        <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {property.location.neighborhood}, {property.location.city}
        </p>
        <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Maximize className="h-4 w-4" />
            {property.area}&nbsp;m&sup2;
          </span>
          <span className="ml-auto rounded bg-secondary px-2 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
            {property.propertyType === "single-room" ? "Room" : property.propertyType}
          </span>
        </div>
      </div>
    </Link>
  )
}
