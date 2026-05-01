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
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [news, setNews] = useState<ArticleResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      categoryApi.list(),
      articleApi.list("ARTICLE"),
      articleApi.list("NEWS"),
    ])
      .then(([cats, arts, newsList]) => {
        setCategories(cats)
        setArticles(arts)
        setNews(newsList)
      })
      .catch((e) => {
        console.error("Home page load failed:", e)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  return (
    <>
      <HeroBanner />
      <Article articles={articles} />
      <News articles={news} />
      <CategoryRow categories={categories} />
    </>
  )
}
