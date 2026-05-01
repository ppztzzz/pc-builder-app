"use client"

import { Fragment, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { CategoryTag } from "@/frontend/components/ui/CategoryTag"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { ArticleResponse } from "@/shared/types/article"

export default function ArticlePage() {
  const params = useParams<{ id: string }>()
  const [article, setArticle] = useState<ArticleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useTitle(article?.title ?? "")

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

  const cover = article.images.find((i) => i.isCover) ?? article.images[0]
  const otherImages = article.images.filter((i) => i.id !== cover?.id)
  const paragraphs = article.content.split("\n").filter((p) => p.trim())

  // Spread non-cover images evenly through the article body.
  // For N images and P paragraphs, put images after positions
  // floor(P / (N + 1)) * (i + 1) so they end up between paragraphs.
  const insertAfter = new Map<number, (typeof otherImages)[number]>()
  if (otherImages.length > 0) {
    const step = paragraphs.length / (otherImages.length + 1)
    otherImages.forEach((img, i) => {
      const pos = Math.max(0, Math.min(paragraphs.length - 1, Math.floor(step * (i + 1)) - 1))
      insertAfter.set(pos, img)
    })
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

      {cover && (
        <figure className="mb-8 -mx-4 sm:mx-0">
          <img
            src={`/uploads/${cover.image}`}
            alt={article.title}
            className="w-full aspect-[16/10] object-cover border-y-2 sm:border-2 border-foreground"
          />
        </figure>
      )}

      <div className="text-lg leading-relaxed">
        {paragraphs.map((para, i) => (
          <Fragment key={i}>
            <p className="mb-5 whitespace-pre-line">{para}</p>
            {insertAfter.has(i) && (
              <figure className="my-8 -mx-4 sm:mx-0">
                <img
                  src={`/uploads/${insertAfter.get(i)!.image}`}
                  alt=""
                  className="w-full aspect-video object-cover border-y-2 sm:border-2 border-foreground"
                />
              </figure>
            )}
          </Fragment>
        ))}
      </div>
    </article>
  )
}
