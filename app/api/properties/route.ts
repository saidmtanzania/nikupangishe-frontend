import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const qs = searchParams.toString()
  try {
    const res = await fetch(`${API_BASE}/houses${qs ? `?${qs}` : ""}`, { cache: "no-store" })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 502 })
  }
}
