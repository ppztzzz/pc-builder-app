"use client"

import { useEffect, useState } from "react"
import { Hero } from "@/frontend/components/home/Hero"
import { CategoryRow } from "@/frontend/components/home/CategoryRow"
import { FeaturedArticle } from "@/frontend/components/home/FeaturedArticle"
import { ArticleGrid } from "@/frontend/components/home/ArticleGrid"
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
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">
        กำลังโหลด...
      </div>
    )
  }

  return (
    <>
      <Hero />
      <CategoryRow categories={categories} />
      <FeaturedArticle article={featured} />
      <ArticleGrid articles={articles} />
    </>
  )
}
