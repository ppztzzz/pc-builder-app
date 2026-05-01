"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { articleApi } from "@/frontend/api/articleApi"
import { Badge } from "@/frontend/components/ui/Badge"
import { ImageCarousel } from "@/frontend/components/article/ImageCarousel"
import type { ArticleResponse } from "@/shared/types/article"

export default function ArticlePage() {
  const params = useParams<{ id: string }>()
  const [article, setArticle] = useState<ArticleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    articleApi
      .detail(Number(params.id))
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [params?.id])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">
        กำลังโหลด...
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted mb-4">ไม่พบบทความ</p>
        <Link href="/" className="text-primary hover:underline">
          ← กลับหน้าแรก
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground mb-4"
      >
        ← กลับ
      </Link>

      {article.category && (
        <Badge className="mb-3">
          {article.category.icon} {article.category.name}
        </Badge>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
        {article.title}
      </h1>

      <p className="text-sm text-muted mb-6">
        📅 {new Date(article.createdAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {article.images.length > 0 && (
        <div className="mb-8">
          <ImageCarousel images={article.images} />
        </div>
      )}

      <div className="prose prose-slate dark:prose-invert max-w-none">
        {article.content.split("\n").map((para, i) =>
          para.trim() ? (
            <p key={i} className="mb-4 leading-relaxed">
              {para}
            </p>
          ) : null
        )}
      </div>
    </article>
  )
}
