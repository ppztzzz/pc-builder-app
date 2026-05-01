"use client"

import Link from "next/link"
import type { CategoryResponse } from "@/shared/types/category"

type Props = {
  categories: CategoryResponse[]
}

export function CategoryRow({ categories }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">📂 หมวดหมู่</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary hover:shadow-md transition"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-sm font-medium text-center">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
