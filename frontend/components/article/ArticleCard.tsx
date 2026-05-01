"use client"

import Link from "next/link"
import type { ArticleResponse } from "@/shared/types/article"
import { Badge } from "@/frontend/components/ui/Badge"

type Props = {
  article: ArticleResponse
}

export function ArticleCard({ article }: Props) {
  const cover = article.images.find((i) => i.isCover) ?? article.images[0]

  return (
    <Link
      href={`/article/${article.id}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-500/10 overflow-hidden">
        {cover ? (
          <img
            src={`/uploads/${cover.image}`}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {article.category?.icon ?? "📰"}
          </div>
        )}
      </div>
      <div className="p-4">
        {article.category && (
          <Badge className="mb-2">
            {article.category.icon} {article.category.name}
          </Badge>
        )}
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition mb-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
