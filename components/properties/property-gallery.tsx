"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[16/9] lg:aspect-[2/1]">
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1210]/20 to-transparent" />
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full shadow-md"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full shadow-md"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-primary-foreground" : "bg-primary-foreground/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image count */}
      <div className="absolute right-3 top-3 rounded-md bg-[#1a1210]/70 px-2.5 py-1 text-xs font-medium text-[#f5f0eb] backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
