import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Support both full UUIDs and 8-char short IDs
  const endpoint = id.length <= 8 ? `${API_BASE}/houses/s/${id}` : `${API_BASE}/houses/${id}`
  try {
    const res = await fetch(endpoint, { cache: "no-store" })
    if (!res.ok) return NextResponse.json({ error: "Property not found" }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 502 })
  }
}
