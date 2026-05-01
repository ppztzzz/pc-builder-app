"use client"

import type { ArticleResponse } from "@/shared/types/article"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"

type Props = {
  articles: ArticleResponse[]
}

export function ArticleGrid({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <p className="text-center text-muted py-8">ยังไม่มีบทความ</p>
    )
  }

  return (
    <section id="latest" className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">📰 บทความล่าสุด</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
