"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"
import { getIcon } from "@/shared/constants/icons"
import type { ArticleResponse } from "@/shared/types/article"
import type { CategoryResponse } from "@/shared/types/category"

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const [category, setCategory] = useState<CategoryResponse | null>(null)
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    const id = Number(params.id)
    Promise.all([categoryApi.detail(id), articleApi.byCategory(id)])
      .then(([cat, list]) => {
        setCategory(cat)
        setArticles(list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params?.id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-muted mb-4">ไม่พบหมวดหมู่</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
        </Link>
      </div>
    )
  }

  const Icon = getIcon(category.icon)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted hover:text-primary transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> กลับ
      </Link>

      <div className="border-b-2 border-foreground pb-6 mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2 inline-flex items-center gap-2">
          <Icon className="w-4 h-4" /> Category
        </p>
        <div className="flex items-baseline justify-between">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-muted uppercase tracking-widest">
            {articles.length} บทความ
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-muted py-12 uppercase tracking-widest text-xs">
          ยังไม่มีบทความในหมวดนี้
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}
