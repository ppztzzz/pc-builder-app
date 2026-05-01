"use client"

import { useState } from "react"
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
    <div className="relative rounded-xl overflow-hidden bg-card border border-border">
      <div className="aspect-video relative">
        <img
          src={`/uploads/${images[index].image}`}
          alt=""
          className="w-full h-full object-contain bg-black/5"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center transition"
              aria-label="ก่อนหน้า"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center transition"
              aria-label="ถัดไป"
            >
              ›
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50"
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
