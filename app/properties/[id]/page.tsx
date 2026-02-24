import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Shield,
  Star,
  Heart,
  Share2,
  Phone,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PropertyGallery } from "@/components/properties/property-gallery"
import { PropertyCard } from "@/components/properties/property-card"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { formatTZS } from "@/lib/utils"
import { PropertyDetailsMap } from "@/components/properties/property-details-map"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = mockProperties.find((p) => p.id === id)

  if (!property) {
    notFound()
  }

  const owner = mockUsers.find((u) => u.id === property.ownerId)
  const agent = property.agentId ? mockUsers.find((u) => u.id === property.agentId) : null
  const similar = mockProperties
    .filter((p) => p.id !== property.id && p.propertyType === property.propertyType)
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Back button */}
      <Link
        href="/browse"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main content */}
        <div className="flex flex-col gap-6">
          {/* Gallery */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Title & Price */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {property.isVerified && (
                <Badge variant="outline" className="gap-1 border-[#059669]/30 bg-[#059669]/10 text-[#059669]">
                  Verified
                </Badge>
              )}
              {property.isUnique && (
                <Badge variant="outline" className="gap-1 border-primary/30 bg-accent text-accent-foreground">
                  <Star className="h-3 w-3" />
                  Unique
                </Badge>
              )}
              <Badge variant="secondary" className="capitalize">
                {property.propertyType === "single-room" ? "Single Room" : property.propertyType}
              </Badge>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {property.location.neighborhood}, {property.location.city}
              </p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <Heart className="h-4 w-4" />
                  Save
                </button>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Price Banner */}
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent p-4 lg:p-5">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p className="text-2xl font-bold text-primary lg:text-3xl">
                {formatTZS(property.price)}
              </p>
            </div>
            <Button size="lg" className="gap-2">
              <Calendar className="h-4 w-4" />
              Request Viewing
            </Button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Bed, label: "Bedrooms", value: property.bedrooms },
              { icon: Bath, label: "Bathrooms", value: property.bathrooms },
              { icon: Maximize, label: "Area", value: `${property.area} m\u00B2` },
              { icon: Shield, label: "Status", value: property.status === "available" ? "Available" : property.status },
            ].map((feat) => (
              <div
                key={feat.label}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center"
              >
                <feat.icon className="mb-2 h-5 w-5 text-primary" />
                <p className="text-xs text-muted-foreground">{feat.label}</p>
                <p className="text-lg font-semibold text-foreground">{feat.value}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">About This Property</h2>
            <p className="leading-relaxed text-muted-foreground">{property.description}</p>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-sm">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Location</h2>
            <PropertyDetailsMap property={property} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {property.location.neighborhood}, {property.location.city}
              </p>
              <p className="text-xs text-muted-foreground">
                GPS: {property.location.lat.toFixed(4)}, {property.location.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Agent Card */}
          {agent && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Listed by Agent</h3>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-primary">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{agent.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    Verified Agent
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat with Agent
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  {agent.phone}
                </Button>
              </div>
            </div>
          )}

          {/* Owner Card */}
          {owner && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Property Owner</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {owner.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{owner.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    Verified Owner
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Notice */}
          <div className="rounded-xl border border-[#059669]/20 bg-[#059669]/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
              <div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">Safety Notice</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This property has been verified by Nikupangishe. Always visit the property
                  in person before making any payments.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="lg:hidden">
            <Button size="lg" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Request Viewing
            </Button>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Similar Properties</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
