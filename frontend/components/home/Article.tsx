"use client"

import Link from "next/link"
import { Star, Calendar, ArrowRight } from "lucide-react"
import type { ArticleResponse } from "@/shared/types/article"
import { CategoryTag } from "@/frontend/components/ui/CategoryTag"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"

type Props = {
  article: ArticleResponse | null
}

export function Article({ article }: Props) {
  if (!article) return null

  const cover = article.images.find((i) => i.isCover) ?? article.images[0]

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle label="Cover Story" title="บทความเด่น" />

      <Link href={`/article/${article.id}`} className="group block">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* Cover image — 3 cols */}
          <div className="lg:col-span-3 aspect-[16/10] relative overflow-hidden bg-card border-2 border-foreground">
            {cover ? (
              <img
                src={`/uploads/${cover.image}`}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-card text-foreground/20 text-9xl font-bold">
                ?
              </div>
            )}
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-primary text-primary-fg text-[10px] uppercase tracking-widest font-bold px-2 py-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          </div>

          {/* Text — 2 cols */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            {article.category && (
              <div className="mb-3">
                <CategoryTag
                  iconName={article.category.icon}
                  name={article.category.name}
                  variant="small"
                />
              </div>
            )}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] mb-4 group-hover:text-primary transition">
              {article.title}
            </h3>
            {article.excerpt && (
              <p className="text-base text-muted leading-relaxed mb-4 line-clamp-4">
                {article.excerpt}
              </p>
            )}
            <p className="text-xs uppercase tracking-widest text-muted inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {new Date(article.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="mt-4 text-sm font-bold text-primary uppercase tracking-widest inline-flex items-center gap-1.5">
              อ่านบทความ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </p>
          </div>
        </div>
      </Link>
    </section>
  )
}
