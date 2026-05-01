"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ArticleForm } from "@/frontend/components/admin/ArticleForm"
import { ImageManager } from "@/frontend/components/admin/ImageManager"
import type { ArticleResponse } from "@/shared/types/article"
import type { CategoryResponse } from "@/shared/types/category"

export default function EditArticlePage() {
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)

  const [article, setArticle] = useState<ArticleResponse | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([articleApi.detail(id), categoryApi.list()])
      .then(([a, cats]) => {
        setArticle(a)
        setCategories(cats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
        Loading...
      </p>
    )
  }

  if (!article) {
    return (
      <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
        ไม่พบบทความ
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <ArticleForm categories={categories} initial={article} />

      <div className="border-t-2 border-foreground pt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          Images
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight mb-4">
          จัดการรูปภาพ ({article.images.length})
        </h2>
        <ImageManager
          articleId={article.id}
          images={article.images}
          onChange={(images) => setArticle({ ...article, images })}
        />
      </div>
    </div>
  )
}
