"use client"

import { useEffect, useState } from "react"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ArticleForm } from "@/frontend/components/admin/ArticleForm"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { CategoryResponse } from "@/shared/types/category"

export default function NewArticlePage() {
  useTitle("เพิ่มบทความ")
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryApi.list().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
        Loading...
      </p>
    )
  }

  return <ArticleForm categories={categories} />
}
