"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import type { ArticleResponse } from "@/shared/types/article"
import { CategoryTag } from "@/frontend/components/ui/CategoryTag"

type Props = {
  article: ArticleResponse
  size?: "lg" | "md" | "sm"
}

export function ArticleCard({ article, size = "md" }: Props) {
  const cover = article.images.find((i) => i.isCover) ?? article.images[0]

  const titleSize =
    size === "lg" ? "text-2xl sm:text-3xl"
      : size === "md" ? "text-lg sm:text-xl"
        : "text-base"

  const aspectClass = size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]"

  return (
    <Link href={`/article/${article.id}`} className="group block">
      <div className={`${aspectClass} relative overflow-hidden bg-card border border-border mb-4`}>
        {cover ? (
          <img
            src={`/uploads/${cover.image}`}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-card text-foreground/20 text-7xl font-bold">
            ?
          </div>
        )}
      </div>

      {article.category && (
        <div className="mb-3">
          <CategoryTag
            iconName={article.category.icon}
            name={article.category.name}
            variant="small"
          />
        </div>
      )}

      <h3 className={`${titleSize} font-extrabold tracking-tight leading-tight mb-2 group-hover:text-primary transition line-clamp-3`}>
        {article.title}
      </h3>

      {article.excerpt && size !== "sm" && (
        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
      )}

      <p className="mt-3 text-[10px] uppercase tracking-widest text-muted inline-flex items-center gap-1.5">
        <Calendar className="w-3 h-3" />
        {new Date(article.createdAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </Link>
  )
}
