import { NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization")
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const res = await fetch(`${API_BASE}/exchanges`, {
      headers: { Authorization: auth },
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch exchanges" }, { status: 502 })
  }
}
