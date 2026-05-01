"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ArticleCard } from "@/frontend/components/article/ArticleCard"
import { getIcon } from "@/shared/constants/icons"
import type { ArticleResponse } from "@/shared/types/article"
import type { CategoryResponse } from "@/shared/types/category"

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialCategory = searchParams.get("category")
  const initialQuery = searchParams.get("q") ?? ""

  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(initialQuery)
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCategory ? Number(initialCategory) : null
  )

  useEffect(() => {
    Promise.all([articleApi.list(), categoryApi.list()])
      .then(([list, cats]) => {
        setArticles(list)
        setCategories(cats)
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  // Sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (categoryId) params.set("category", String(categoryId))
    const qs = params.toString()
    router.replace(qs ? `/articles?${qs}` : "/articles")
  }, [query, categoryId, router])

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (categoryId && a.categoryId !== categoryId) return false
      if (query) {
        const needle = query.toLowerCase()
        return (
          a.title.toLowerCase().includes(needle) ||
          a.content.toLowerCase().includes(needle) ||
          (a.excerpt ?? "").toLowerCase().includes(needle)
        )
      }
      return true
    })
  }, [articles, categoryId, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="border-b-2 border-foreground pb-4 mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          Library
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          บทความทั้งหมด
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาบทความ..."
          className="w-full border-2 border-foreground bg-background pl-10 pr-10 py-3 focus:border-primary focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-1 flex-wrap mb-8">
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest font-bold border-2 transition ${
            categoryId === null
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:border-foreground"
          }`}
        >
          ทั้งหมด
        </button>
        {categories.map((c) => {
          const Icon = getIcon(c.icon)
          const active = categoryId === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(active ? null : c.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest font-bold border-2 transition ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {c.name}
            </button>
          )
        })}
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center py-20 text-muted uppercase tracking-widest text-xs">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted uppercase tracking-widest text-xs">
          ไม่พบบทความ
        </p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest text-muted mb-4">
            พบ {filtered.length} บทความ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
