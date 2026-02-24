import { MapPin } from "lucide-react"
import type { Property } from "@/lib/types"

export function MapPlaceholder({ properties }: { properties: Property[] }) {
  return (
    <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-xl border border-border bg-secondary/50">
      {/* Fake map grid background */}
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Pin markers */}
        <div className="relative h-full w-full">
          {properties.slice(0, 6).map((property, index) => {
            const positions = [
              { top: "20%", left: "30%" },
              { top: "35%", left: "60%" },
              { top: "55%", left: "25%" },
              { top: "40%", left: "45%" },
              { top: "65%", left: "70%" },
              { top: "25%", left: "75%" },
            ]
            const pos = positions[index]
            return (
              <div
                key={property.id}
                className="absolute flex flex-col items-center"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/20">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="mt-1 whitespace-nowrap rounded bg-card px-2 py-0.5 text-xs font-medium text-card-foreground shadow-sm">
                  {property.location.neighborhood}
                </div>
              </div>
            )
          })}
        </div>

        {/* Center label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-card/90 px-4 py-2 text-center shadow-md backdrop-blur-sm">
          <p className="text-xs font-medium text-muted-foreground">Dar es Salaam Map View</p>
          <p className="text-xs text-muted-foreground">{properties.length} properties shown</p>
        </div>
      </div>
    </div>
  )
}
