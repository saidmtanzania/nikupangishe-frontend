"use client"

import { CheckCircle2, Star, MapPin, Bed, Bath, Maximize, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { formatTZS } from "@/lib/utils"

export function PropertyListCard({
    property,
    priority = false,
}: {
    property: Property
    priority?: boolean
}) {
    return (
        <Link
            href={`/properties/${property.id}`}
            className="group flex overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
            {/* Thumbnail */}
            <div className="relative h-auto w-48 shrink-0 overflow-hidden sm:w-56">
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    {...(priority ? { priority: true } : { loading: "lazy" })}
                />
                {/* Badges */}
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                    {property.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-medium text-white">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Verified
                        </span>
                    )}
                    {property.isUnique && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                            <Star className="h-2.5 w-2.5" />
                            Unique
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
                {/* Top row */}
                <div>
                    <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
                            {property.title}
                        </h3>
                        {/* Favorite */}
                        <button
                            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            aria-label="Add to favorites"
                        >
                            <Heart className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {property.location.neighborhood}, {property.location.city}
                    </p>

                    {/* Amenity chips (first 4) */}
                    <div className="flex flex-wrap gap-1.5">
                        {property.amenities.slice(0, 4).map((a) => (
                            <span
                                key={a}
                                className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                            >
                                {a}
                            </span>
                        ))}
                        {property.amenities.length > 4 && (
                            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                                +{property.amenities.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom row */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <span className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            {property.area} m²
                        </span>
                        <span className="hidden rounded bg-secondary px-2 py-0.5 text-xs font-medium capitalize text-secondary-foreground sm:inline-block">
                            {property.propertyType === "single-room" ? "Room" : property.propertyType}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-right">
                        <p className="text-base font-bold text-primary leading-none">
                            {formatTZS(property.price)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">/month</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
