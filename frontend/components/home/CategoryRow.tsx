"use client"

import Link from "next/link"
import type { CategoryResponse } from "@/shared/types/category"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"
import { getIcon } from "@/shared/constants/icons"

type Props = {
  categories: CategoryResponse[]
}

export function CategoryRow({ categories }: Props) {
  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-12 border-t border-border">
      <SectionTitle label="Browse by part" title="หมวดหมู่" />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {categories.map((cat, i) => {
          const Icon = getIcon(cat.icon)
          return (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.id}`}
              className="group relative flex flex-col items-center justify-center gap-3 aspect-square border-2 border-foreground bg-card hover:bg-primary hover:text-primary-fg hover:border-primary transition p-3"
            >
              <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon className="w-8 h-8" strokeWidth={1.5} />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
