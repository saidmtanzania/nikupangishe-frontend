"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from 'embla-carousel-react'

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentIndex, setCurrentIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const goNext = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const goPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const goTo = useCallback((index: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo(index)
  }, [emblaApi])

  return (
    <div className="group relative overflow-hidden rounded-xl bg-muted">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-[16/9] min-w-0 flex-[0_0_100%] lg:aspect-[2/1]">
              <Image
                src={img}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover select-none"
                priority={index === 0}
              />
              {/* Refined bottom gradient for dots visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border-none bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image count */}
      <div className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-md border border-white/10 uppercase">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

