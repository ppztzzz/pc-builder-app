"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ArticleResponse } from "@/shared/types/article"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"

type Props = {
  articles: ArticleResponse[]
}

export function News({ articles }: Props) {
  if (articles.length === 0) return null

  const items = articles.slice(0, 6)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t border-border">
      <SectionTitle label="Latest" title="ข่าวสารล่าสุด" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
