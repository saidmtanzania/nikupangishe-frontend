import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(`${API_BASE}/houses/${id}`, { cache: "no-store" })
    if (!res.ok) return NextResponse.json({ error: "Property not found" }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 502 })
  }
}
