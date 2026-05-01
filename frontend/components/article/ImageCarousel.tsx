"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ArticleImageResponse } from "@/shared/types/article"

type Props = {
  images: ArticleImageResponse[]
}

export function ImageCarousel({ images }: Props) {
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="relative overflow-hidden bg-card border-2 border-foreground">
      <div className="aspect-video relative">
        <img
          src={`/uploads/${images[index].image}`}
          alt=""
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-foreground hover:bg-primary text-background w-10 h-10 flex items-center justify-center transition"
              aria-label="ก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground hover:bg-primary text-background w-10 h-10 flex items-center justify-center transition"
              aria-label="ถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 transition ${
                    i === index ? "w-8 bg-foreground" : "w-4 bg-foreground/30"
                  }`}
                  aria-label={`รูปที่ ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
