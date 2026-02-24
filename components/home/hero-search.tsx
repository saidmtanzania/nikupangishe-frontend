"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    router.push(`/browse${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-xl flex-col gap-3 rounded-xl border border-[#3a2d22] bg-[#241c17]/80 p-3 backdrop-blur-sm sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-[#1a1210] px-4 py-3">
        <MapPin className="h-4 w-4 shrink-0 text-[#ec5413]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by neighborhood, city..."
          className="w-full bg-transparent text-sm text-[#f5f0eb] placeholder-[#7a6b5d] outline-none"
          autoComplete="off"
        />
      </div>
      <Button type="submit" size="lg" className="gap-2 whitespace-nowrap">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
