"use client"

import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { formatTZSShort } from "@/lib/utils"

export function PropertyListCard({
    property,
    priority = false,
}: {
    property: Property
    priority?: boolean
}) {
    return (
        <Link
            href={`/properties/${property.id.slice(0, 8)}`}
            className="group flex overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
        >
            {/* Compact square thumbnail */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden sm:h-32 sm:w-40 md:w-52">
                <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    {...(priority ? { priority: true } : { loading: "lazy" })}
                />
                {/* Verified badge */}
                {property.isVerified && (
                    <div className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2">
                        <span className="rounded-full bg-[#059669] px-1.5 py-0.5 text-[9px] font-medium text-white sm:px-2 sm:text-[10px]">
                            Verified
                        </span>
                    </div>
                )}
            </div>

            {/* Content – compact horizontal info */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-2.5 sm:p-3.5">
                {/* Row 1: title + price */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-1 text-[13px] font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary sm:text-sm md:text-base">
                            {property.title}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground sm:text-xs">
                            <MapPin className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
                        </p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-sm font-bold leading-none text-primary sm:text-base">
                            {formatTZSShort(property.price)}
                        </p>
                        <p className="text-[9px] text-muted-foreground sm:text-[10px]">/month</p>
                    </div>
                </div>

                {/* Row 2: stats + amenity chips (desktop) */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                    {/* Stats row */}
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground sm:gap-3 sm:text-xs">
                        {property.bedrooms > 0 && (
                            <span className="flex items-center gap-0.5 sm:gap-1">
                                <Bed className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                                {property.bedrooms}<span className="hidden sm:inline">&nbsp;Bed</span>
                            </span>
                        )}
                        <span className="flex items-center gap-0.5 sm:gap-1">
                            <Bath className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                            {property.bathrooms}<span className="hidden sm:inline">&nbsp;Bath</span>
                        </span>
                        <span className="flex items-center gap-0.5 whitespace-nowrap sm:gap-1">
                            <Maximize className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                            {property.area}&nbsp;m²
                        </span>
                        <span className="hidden rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium capitalize text-secondary-foreground md:inline-block">
                            {property.propertyType === "single-room" ? "Room" : property.propertyType}
                        </span>
                    </div>

                    {/* Favorite */}
                    <button
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary sm:h-7 sm:w-7"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        aria-label="Add to favorites"
                    >
                        <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                </div>
            </div>
        </Link>
    )
}
