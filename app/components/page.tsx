"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { componentApi } from "@/frontend/api/componentApi"
import { ComponentCard } from "@/frontend/components/component/ComponentCard"
import {
  COMPONENT_TYPES,
  COMPONENT_TYPE_LABEL,
} from "@/shared/types/component"
import type {
  ComponentResponse,
  ComponentType,
} from "@/shared/types/component"

type Sort = "price-asc" | "price-desc" | "name"

function ComponentsPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const typeParam = searchParams.get("type") as ComponentType | null
  const initialQuery = searchParams.get("q") ?? ""

  const [components, setComponents] = useState<ComponentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState<ComponentType | null>(
    typeParam && COMPONENT_TYPES.includes(typeParam) ? typeParam : null
  )
  const [sort, setSort] = useState<Sort>("price-asc")

  useEffect(() => {
    componentApi
      .list()
      .then(setComponents)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  // Sync URL when filter changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (query) params.set("q", query)
    const qs = params.toString()
    router.replace(qs ? `/components?${qs}` : "/components")
  }, [type, query, router])

  const filtered = useMemo(() => {
    const list = components.filter((c) => {
      if (type && c.type !== type) return false
      if (query) {
        const needle = query.toLowerCase()
        return (
          c.name.toLowerCase().includes(needle) ||
          c.description.toLowerCase().includes(needle)
        )
      }
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [components, type, query, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="border-b-2 border-foreground pb-4 mb-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          Catalog
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          ชิ้นส่วนทั้งหมด
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชิ้นส่วน..."
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

      {/* Type chips */}
      <div className="flex gap-1 flex-wrap mb-4">
        <button
          type="button"
          onClick={() => setType(null)}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest font-bold border-2 transition ${
            type === null
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:border-foreground"
          }`}
        >
          ทั้งหมด
        </button>
        {COMPONENT_TYPES.map((t) => {
          const active = type === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(active ? null : t)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest font-bold border-2 transition ${
                active
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {t} · {COMPONENT_TYPE_LABEL[t]}
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted">
          เรียงตาม
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="border-2 border-foreground bg-background px-3 py-1.5 text-xs uppercase tracking-widest font-bold focus:border-primary focus:outline-none"
        >
          <option value="price-asc">ราคา ต่ำ→สูง</option>
          <option value="price-desc">ราคา สูง→ต่ำ</option>
          <option value="name">ชื่อ A→Z</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center py-20 text-muted uppercase tracking-widest text-xs">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted uppercase tracking-widest text-xs">
          ไม่พบชิ้นส่วน
        </p>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest text-muted mb-4">
            พบ {filtered.length} ชิ้น
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((c) => (
              <Link key={c.id} href={`/simulator`}>
                <ComponentCard component={c} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ComponentsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
          Loading...
        </div>
      }
    >
      <ComponentsPageInner />
    </Suspense>
  )
}
