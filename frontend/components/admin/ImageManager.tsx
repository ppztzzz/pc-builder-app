"use client"

import { useState } from "react"
import { Trash2, Star, Check } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import type { ArticleImageResponse } from "@/shared/types/article"

type Props = {
  articleId: number
  images: ArticleImageResponse[]
  onChange: (images: ArticleImageResponse[]) => void
}

export function ImageManager({ articleId, images, onChange }: Props) {
  const [busy, setBusy] = useState<number | null>(null)

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted uppercase tracking-widest text-xs">
        ยังไม่มีรูป — อัพโหลดด้านบน
      </p>
    )
  }

  const handleSetCover = async (imageId: number) => {
    setBusy(imageId)
    try {
      await articleApi.setCover(articleId, imageId)
      onChange(images.map((i) => ({ ...i, isCover: i.id === imageId })))
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async (imageId: number) => {
    if (!confirm("ลบรูปนี้?")) return
    setBusy(imageId)
    try {
      await articleApi.deleteImage(articleId, imageId)
      onChange(images.filter((i) => i.id !== imageId))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          className={`relative border-2 ${
            img.isCover ? "border-primary" : "border-foreground"
          } overflow-hidden group`}
        >
          <div className="aspect-square">
            <img
              src={`/uploads/${img.image}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {img.isCover && (
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-primary text-primary-fg text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
              <Star className="w-3 h-3" /> Cover
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-foreground/90 text-background flex justify-around opacity-0 group-hover:opacity-100 transition">
            {!img.isCover && (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => handleSetCover(img.id)}
                className="flex-1 py-2 hover:bg-primary text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-1 disabled:opacity-50"
                title="ตั้งเป็นรูปหลัก"
              >
                <Check className="w-3.5 h-3.5" />
                Set
              </button>
            )}
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => handleDelete(img.id)}
              className="flex-1 py-2 hover:bg-primary text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-1 disabled:opacity-50"
              title="ลบรูป"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Del
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
