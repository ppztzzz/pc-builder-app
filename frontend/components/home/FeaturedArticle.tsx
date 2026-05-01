"use client"

import Link from "next/link"
import type { ArticleResponse } from "@/shared/types/article"
import { Badge } from "@/frontend/components/ui/Badge"

type Props = {
  article: ArticleResponse | null
}

export function FeaturedArticle({ article }: Props) {
  if (!article) return null

  const cover = article.images.find((i) => i.isCover) ?? article.images[0]

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">⭐ บทความเด่น</h2>
      <Link
        href={`/article/${article.id}`}
        className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-video md:aspect-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 relative overflow-hidden">
            {cover ? (
              <img
                src={`/uploads/${cover.image}`}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {article.category?.icon ?? "📰"}
              </div>
            )}
          </div>
          <div className="p-6 flex flex-col justify-center">
            {article.category && (
              <Badge className="mb-3 w-fit">
                {article.category.icon} {article.category.name}
              </Badge>
            )}
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-muted line-clamp-3">{article.excerpt}</p>
            )}
            <p className="mt-4 text-sm text-primary font-medium">
              อ่านบทความ →
            </p>
          </div>
        </div>
      </Link>
    </section>
  )
}
