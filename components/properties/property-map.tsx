"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import type { Property } from "@/lib/types"
import "leaflet/dist/leaflet.css"

// Fix Leaflet's broken default icon paths when bundled with webpack/Next.js
function fixLeafletIcons() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
}

/** Creates a custom coloured circle-pin marker */
function createPin(color = "#ec5413") {
    return L.divIcon({
        className: "",
        html: `
      <div style="
        width:36px;height:36px;
        background:${color};
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(236,84,19,0.35);
      "></div>
    `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -38],
    })
}

/** Keeps the map centred on the visible set of properties */
function BoundsFitter({ properties, paused = false }: { properties: Property[]; paused?: boolean }) {
    const map = useMap()

    useEffect(() => {
        if (paused || properties.length === 0) return
        const size = map.getSize()
        if (size.x === 0 || size.y === 0) return
        const bounds = L.latLngBounds(
            properties.map((p) => [p.location.lat, p.location.lng])
        )
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 })
    }, [map, properties, paused])

    return null
}

export interface MapPoint {
    lat: number
    lng: number
    label?: string
}

function MapClickHandler({ onSelect }: { onSelect: (point: MapPoint) => void }) {
    useMapEvents({
        click: (e) => onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }),
    })
    return null
}

function FlyToPoint({ point }: { point: MapPoint | null | undefined }) {
    const map = useMap()

    useEffect(() => {
        if (!point) return
        const lat = Number(point.lat)
        const lng = Number(point.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
        const zoom = Math.max(map.getZoom(), 12)
        // flyTo yields NaN on a zero-size (CSS-hidden) map, e.g. the desktop map on mobile
        const size = map.getSize()
        if (size.x === 0 || size.y === 0) {
            map.setView([lat, lng], zoom, { animate: false })
            return
        }
        map.flyTo([lat, lng], zoom, { duration: 0.6 })
    }, [map, point])

    return null
}

const TZS = new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
})

interface PropertyMapProps {
    properties: Property[]
    showPopups?: boolean
    selectedPoint?: MapPoint | null
    radiusKm?: number
    onLocationSelect?: (point: MapPoint) => void
}

export default function PropertyMap({
    properties,
    showPopups = true,
    selectedPoint,
    radiusKm = 5,
    onLocationSelect,
}: PropertyMapProps) {
    useEffect(() => {
        fixLeafletIcons()
    }, [])

    // Centre of Dar es Salaam
    const center: [number, number] = [-6.792, 39.208]

    return (
        <MapContainer
            center={center}
            zoom={12}
            className="h-full w-full"
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
        >
            {/* OpenStreetMap tile layer – free & open */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
                maxZoom={19}
            />

            <BoundsFitter properties={properties} paused={!!selectedPoint} />

            {onLocationSelect && <MapClickHandler onSelect={onLocationSelect} />}
            <FlyToPoint point={selectedPoint} />

            {selectedPoint && (
                <Circle
                    center={[selectedPoint.lat, selectedPoint.lng]}
                    radius={radiusKm * 1000}
                    pathOptions={{ color: "#ec5413", fillColor: "#ec5413", fillOpacity: 0.08, weight: 2, dashArray: "6 6" }}
                />
            )}

            {properties.map((property) => (
                <Marker
                    key={property.id}
                    position={[property.location.lat, property.location.lng]}
                    icon={createPin(property.isVerified ? "#ec5413" : "#a89585")}
                    eventHandlers={onLocationSelect ? {
                        click: () => onLocationSelect({
                            lat: property.location.lat,
                            lng: property.location.lng,
                            label: property.location.neighborhood,
                        }),
                    } : undefined}
                >
                    {showPopups && (
                        <Popup maxWidth={280} className="property-popup">
                            <div className="flex flex-col font-sans overflow-hidden rounded-lg">
                                {/* Mobile-focused Image at the top */}
                                <div className="relative h-24 w-full overflow-hidden">
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="h-full w-full object-cover"
                                    />
                                    {property.isVerified && (
                                        <div className="absolute top-1.5 left-1.5 rounded bg-[#059669] px-1.2 py-0.4 text-[8px] font-bold text-white shadow-sm">
                                            Verified
                                        </div>
                                    )}
                                </div>

                                <div className="p-2">
                                    <p style={{ color: "#b83d0d" }} className="mb-0 text-[9px] font-semibold uppercase tracking-wide">
                                        {property.location.neighborhood}
                                    </p>
                                    <p className="mb-0.5 line-clamp-1 text-xs font-bold leading-tight text-gray-900">
                                        {property.title}
                                    </p>
                                    <p style={{ color: "#ec5413" }} className="mb-1.5 text-sm font-extrabold flex items-center justify-between">
                                        <span>
                                            {TZS.format(property.price)}
                                            <span className="ml-0.5 text-[10px] font-medium text-gray-500">/mo</span>
                                        </span>
                                    </p>

                                    <div className="mb-2 flex items-center gap-2 text-[10px] text-gray-600">
                                        <span className="flex items-center gap-1">🛏 {property.bedrooms}</span>
                                        <span className="flex items-center gap-1">🚿 {property.bathrooms}</span>
                                        <span className="flex items-center gap-1 whitespace-nowrap">📐 {property.area} m²</span>
                                    </div>

                                    <a
                                        href={`/properties/${property.id.slice(0, 8)}`}
                                        className="flex w-full items-center justify-center rounded-md bg-[#ec5413]/10 py-1.5 text-center text-xs font-bold text-[#ec5413] transition-all hover:bg-[#ec5413]/20 active:scale-95"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    )}
                </Marker>
            ))}
        </MapContainer>
    )
}
