"use client"

import dynamic from "next/dynamic"
import type { Property } from "@/lib/types"

const PropertyMap = dynamic(() => import("@/components/properties/property-map"), {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-secondary/50" />
})

export function PropertyDetailsMap({ property }: { property: Property }) {
    return (
        <div className="relative z-0 h-64 overflow-hidden rounded-xl border border-border bg-secondary/50 lg:h-80">
            <PropertyMap properties={[property]} showPopups={false} />
        </div>
    )
}
