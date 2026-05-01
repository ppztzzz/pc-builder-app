"use client"

import Link from "next/link"
import type { ArticleResponse } from "@/shared/types/article"
import { CategoryTag } from "@/frontend/components/ui/CategoryTag"

type Props = {
  article: ArticleResponse
  sizeClass: string
  isLarge?: boolean
}

export function MosaicCard({ article, sizeClass, isLarge }: Props) {
  const cover = article.images.find((i) => i.isCover) ?? article.images[0]

  return (
    <Link
      href={`/article/${article.id}`}
      className={`relative overflow-hidden border-2 border-foreground bg-card group block ${sizeClass}`}
    >
      {cover ? (
        <img
          src={`/uploads/${cover.image}`}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-card text-foreground/20 text-7xl font-bold">
          ?
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent opacity-90" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
        {article.category && (
          <div className="mb-2">
            <CategoryTag
              iconName={article.category.icon}
              name={article.category.name}
              variant="small"
            />
          </div>
        )}
        <h3
          className={`font-extrabold tracking-tight leading-tight line-clamp-2 ${
            isLarge ? "text-2xl sm:text-3xl" : "text-base"
          }`}
        >
          {article.title}
        </h3>
      </div>
    </Link>
  )
}
