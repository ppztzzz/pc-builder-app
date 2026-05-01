"use client"

import { useEffect, useState } from "react"
import { HeroBanner } from "@/frontend/components/home/HeroBanner"
import { Article } from "@/frontend/components/home/Article"
import { News } from "@/frontend/components/home/News"
import { CategoryRow } from "@/frontend/components/home/CategoryRow"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import type { ArticleResponse } from "@/shared/types/article"
import type { CategoryResponse } from "@/shared/types/category"

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [featured, setFeatured] = useState<ArticleResponse | null>(null)
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      categoryApi.list(),
      articleApi.featured(),
      articleApi.list(),
    ]).then(([cats, feat, list]) => {
      setCategories(cats)
      setFeatured(feat)
      setArticles(list)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  // Exclude featured from news so it doesn't appear twice
  const newsArticles = articles.filter((a) => a.id !== featured?.id)

  return (
    <>
      <HeroBanner />
      <Article article={featured} />
      <News articles={newsArticles} />
      <CategoryRow categories={categories} />
    </>
  )
}
