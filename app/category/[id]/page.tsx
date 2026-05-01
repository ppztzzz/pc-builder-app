"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"
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
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">
        กำลังโหลด...
      </div>
    )
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-muted mb-4">ไม่พบหมวดหมู่</p>
        <Link href="/" className="text-primary hover:underline">
          ← กลับหน้าแรก
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4"
      >
        ← กลับ
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        {category.icon} {category.name}
      </h1>
      <p className="text-muted mb-8">
        บทความทั้งหมด {articles.length} เรื่อง
      </p>

      {articles.length === 0 ? (
        <p className="text-center text-muted py-12">
          ยังไม่มีบทความในหมวดนี้
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}
