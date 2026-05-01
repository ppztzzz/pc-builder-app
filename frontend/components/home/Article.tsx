"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ArticleResponse } from "@/shared/types/article"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"
import { MosaicCard } from "@/frontend/components/article/MosaicCard"

type Props = {
  articles: ArticleResponse[]
}

export function Article({ articles }: Props) {
  if (articles.length === 0) return null

  const items = articles.slice(0, 6)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle label="Cover Story" title="บทความ" />

      {/*
        Mosaic layout (md+):
          col 1-4 row 1-2  → item 1 (large 4x2)
          col 5-6 row 1    → item 2 (2x1)
          col 5-6 row 2    → item 3 (2x1)
          col 1-2 row 3    → item 4 (2x1)
          col 3-4 row 3    → item 5 (2x1)
          col 5-6 row 3    → item 6 (2x1)

        Auto-flow places items in order so explicit positioning isn't needed
        as long as item 1 is the first child with col/row span 4/2.
      */}
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-3 md:h-[540px] auto-rows-[200px] md:auto-rows-auto">
        {items.map((article, i) => (
          <MosaicCard
            key={article.id}
            article={article}
            sizeClass={
              i === 0
                ? "md:col-span-4 md:row-span-2"
                : "md:col-span-2 md:row-span-1"
            }
            isLarge={i === 0}
          />
        ))}
      </div>

      {articles.length > 6 && (
        <div className="text-center mt-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
          >
            ดูบทความทั้งหมด ({articles.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      {articles.length <= 6 && (
        <div className="text-center mt-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  )
}
