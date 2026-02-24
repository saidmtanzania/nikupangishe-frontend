import { NextResponse } from "next/server"
import { mockProperties } from "@/lib/mock-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const property = mockProperties.find((p) => p.id === id)

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json(property)
}
