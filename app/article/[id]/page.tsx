"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { CategoryTag } from "@/frontend/components/ui/CategoryTag"
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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted mb-4">ไม่พบบทความ</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-primary uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted hover:text-primary transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> กลับ
      </Link>

      {article.category && (
        <div className="mb-4">
          <CategoryTag
            iconName={article.category.icon}
            name={article.category.name}
          />
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4">
        {article.title}
      </h1>

      <p className="text-xs uppercase tracking-widest text-muted mb-8 inline-flex items-center gap-1.5">
        <Calendar className="w-3 h-3" />
        {new Date(article.createdAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {article.images.length > 0 && (
        <div className="mb-10">
          <ImageCarousel images={article.images} />
        </div>
      )}

      <div className="text-lg leading-relaxed">
        {article.content.split("\n").map((para, i) =>
          para.trim() ? (
            <p key={i} className="mb-5">
              {para}
            </p>
          ) : null
        )}
      </div>
    </article>
  )
}
