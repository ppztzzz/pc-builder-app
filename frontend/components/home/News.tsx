"use client"

import type { ArticleResponse } from "@/shared/types/article"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"

type Props = {
  articles: ArticleResponse[]
}

export function News({ articles }: Props) {
  if (articles.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t border-border">
      <SectionTitle label="Latest News" title="ข่าวสารล่าสุด" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} size="md" />
        ))}
      </div>
    </section>
  )
}
