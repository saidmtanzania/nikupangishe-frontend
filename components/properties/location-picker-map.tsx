"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Search, Navigation, Loader2, X, MapPin } from "lucide-react"

// ── Leaflet icon fix ───────────────────────────────────────────────────────
function fixLeafletIcons() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
}

/** Custom orange/red pin marker */
function createPin() {
    return L.divIcon({
        className: "",
        html: `
      <div style="
        width:36px;height:36px;
        background:#ec5413;
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 12px rgba(236,84,19,0.35);
      "></div>
    `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    })
}

// ── Types ──────────────────────────────────────────────────────────────────
interface NominatimResult {
    place_id: number
    display_name: string
    lat: string
    lon: string
    address?: {
        road?: string
        suburb?: string
        city?: string
        town?: string
        state?: string
        country?: string
    }
}

interface LocationPickerMapProps {
    lat: number | null
    lng: number | null
    /** When set, the map flies to this city-level center (independent of pin) */
    cityCenter?: { lat: number; lng: number } | null
    onSelect: (lat: number, lng: number) => void
    /** Called when search or geolocation provides richer address data */
    onLocationFound?: (data: {
        lat: number
        lng: number
        address?: string
        city?: string
        area?: string
    }) => void
}

// ── Map sub-components ─────────────────────────────────────────────────────

/** Handles click events on the map */
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

/** Flies/pans the map to a new center when lat/lng change from external inputs */
function MapSync({ lat, lng }: { lat: number | null; lng: number | null }) {
    const map = useMap()

    useEffect(() => {
        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
            const current = map.getCenter()
            const dist = current.distanceTo([lat, lng])
            if (dist > 200) {
                map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.8 })
            }
        }
    }, [map, lat, lng])

    return null
}

/** Flies the map to a city center (zoom out to city level) */
function CitySync({
    cityCenter,
}: {
    cityCenter: { lat: number; lng: number } | null | undefined
}) {
    const map = useMap()

    useEffect(() => {
        if (!cityCenter) return
        map.flyTo([cityCenter.lat, cityCenter.lng], 13, { duration: 1 })
    }, [map, cityCenter])

    return null
}

// ── Helper ─────────────────────────────────────────────────────────────────
function round6(n: number) {
    return Math.round(n * 1_000_000) / 1_000_000
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function LocationPickerMap({
    lat,
    lng,
    cityCenter,
    onSelect,
    onLocationFound,
}: LocationPickerMapProps) {
    // Leaflet icon fix
    useEffect(() => {
        fixLeafletIcons()
    }, [])

    // ── Search state ───────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [isLocating, setIsLocating] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const searchRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // ── Map click handler ──────────────────────────────────────────────────
    const handleSelect = useCallback(
        (newLat: number, newLng: number) => {
            onSelect(round6(newLat), round6(newLng))
        },
        [onSelect],
    )

    // ── Nominatim search (debounced) ───────────────────────────────────────
    const handleSearchInput = useCallback((query: string) => {
        setSearchQuery(query)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

        if (query.length < 3) {
            setSearchResults([])
            setShowResults(false)
            return
        }

        setIsSearching(true)
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                        new URLSearchParams({
                            q: query,
                            format: "json",
                            limit: "5",
                            countrycodes: "tz",
                            addressdetails: "1",
                        }),
                    { headers: { "Accept-Language": "en" } },
                )
                const data: NominatimResult[] = await res.json()
                setSearchResults(data)
                setShowResults(data.length > 0)
            } catch {
                setSearchResults([])
            } finally {
                setIsSearching(false)
            }
        }, 400)
    }, [])

    // ── Pick a search result ───────────────────────────────────────────────
    const handleResultClick = useCallback(
        (result: NominatimResult) => {
            const rLat = round6(parseFloat(result.lat))
            const rLng = round6(parseFloat(result.lon))

            onSelect(rLat, rLng)

            if (onLocationFound) {
                const addr = result.address
                onLocationFound({
                    lat: rLat,
                    lng: rLng,
                    address: addr?.road || result.display_name.split(",")[0],
                    city: addr?.city || addr?.town || addr?.state,
                    area: addr?.suburb,
                })
            }

            setSearchQuery(result.display_name.split(",").slice(0, 2).join(", "))
            setShowResults(false)
        },
        [onSelect, onLocationFound],
    )

    // ── Use current location (browser geolocation) ─────────────────────────
    const handleLocateMe = useCallback(() => {
        if (!navigator.geolocation) return
        setIsLocating(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const rLat = round6(latitude)
                const rLng = round6(longitude)

                onSelect(rLat, rLng)

                // Reverse-geocode to fill address fields
                if (onLocationFound) {
                    try {
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?` +
                                new URLSearchParams({
                                    lat: String(latitude),
                                    lon: String(longitude),
                                    format: "json",
                                    addressdetails: "1",
                                }),
                            { headers: { "Accept-Language": "en" } },
                        )
                        const data = await res.json()
                        const addr = data.address
                        onLocationFound({
                            lat: rLat,
                            lng: rLng,
                            address: addr?.road,
                            city: addr?.city || addr?.town || addr?.state,
                            area: addr?.suburb,
                        })
                    } catch {
                        onLocationFound({ lat: rLat, lng: rLng })
                    }
                }

                setIsLocating(false)
            },
            () => setIsLocating(false),
            { enableHighAccuracy: true, timeout: 10_000 },
        )
    }, [onSelect, onLocationFound])

    // ── Map defaults ───────────────────────────────────────────────────────
    const center: [number, number] =
        lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)
            ? [lat, lng]
            : [-6.792, 39.208]

    const defaultZoom = lat !== null && lng !== null ? 15 : 12

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="relative h-full w-full">
            {/* ── Search & locate overlay ──────────────────────────────── */}
            <div ref={searchRef} className="absolute top-3 left-3 right-3 z-[1000]">
                <div className="flex gap-2">
                    {/* Search input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            placeholder="Search address or place…"
                            className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:bg-slate-900/95 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-orange-500 animate-spin" />
                        )}
                        {!isSearching && searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("")
                                    setSearchResults([])
                                    setShowResults(false)
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <X className="size-3 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Use my location button */}
                    <button
                        type="button"
                        onClick={handleLocateMe}
                        disabled={isLocating}
                        className="h-9 px-3 rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm shadow-md hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-medium text-slate-600 disabled:opacity-50 dark:bg-slate-900/95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        title="Use current location"
                    >
                        {isLocating ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Navigation className="size-3.5" />
                        )}
                        <span className="hidden sm:inline">My Location</span>
                    </button>
                </div>

                {/* Search results dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="mt-1 bg-white/95 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg overflow-hidden max-h-48 overflow-y-auto dark:bg-slate-900/95 dark:border-slate-700">
                        {searchResults.map((r) => (
                            <button
                                key={r.place_id}
                                type="button"
                                onClick={() => handleResultClick(r)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors border-b border-slate-100 last:border-0 flex items-start gap-2 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
                            >
                                <MapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
                                <span className="line-clamp-2">{r.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Map ──────────────────────────────────────────────────── */}
            <MapContainer
                center={center}
                zoom={defaultZoom}
                className="h-full w-full rounded-lg"
                scrollWheelZoom
                style={{ height: "100%", width: "100%", cursor: "crosshair" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    maxZoom={19}
                />

                <ClickHandler onSelect={handleSelect} />
                <MapSync lat={lat} lng={lng} />
                <CitySync cityCenter={cityCenter} />

                {lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && (
                    <Marker position={[lat, lng]} icon={createPin()} />
                )}
            </MapContainer>
        </div>
    )
}
