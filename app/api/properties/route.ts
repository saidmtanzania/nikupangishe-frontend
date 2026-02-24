import { NextResponse } from "next/server"
import { mockProperties } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const type = searchParams.get("type")
  const verified = searchParams.get("verified")

  let filtered = [...mockProperties]

  if (city) {
    filtered = filtered.filter((p) =>
      p.location.city.toLowerCase().includes(city.toLowerCase()) ||
      p.location.neighborhood.toLowerCase().includes(city.toLowerCase())
    )
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice))
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice))
  }

  if (type) {
    const types = type.split(",")
    filtered = filtered.filter((p) => types.includes(p.propertyType))
  }

  if (verified === "true") {
    filtered = filtered.filter((p) => p.isVerified)
  }

  return NextResponse.json(filtered)
}
