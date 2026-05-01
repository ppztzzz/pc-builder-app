"use client"

import { useEffect, useState } from "react"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ComponentForm } from "@/frontend/components/admin/ComponentForm"
import type { CategoryResponse } from "@/shared/types/category"

export default function NewComponentPage() {
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

  return <ComponentForm categories={categories} />
}
