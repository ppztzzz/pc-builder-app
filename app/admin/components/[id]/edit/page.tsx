"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { componentApi } from "@/frontend/api/componentApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { ComponentForm } from "@/frontend/components/admin/ComponentForm"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { ComponentResponse } from "@/shared/types/component"
import type { CategoryResponse } from "@/shared/types/category"

export default function EditComponentPage() {
  useTitle("แก้ไขชิ้นส่วน")
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)

  const [component, setComponent] = useState<ComponentResponse | null>(null)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([componentApi.detail(id), categoryApi.list()])
      .then(([c, cats]) => {
        setComponent(c)
        setCategories(cats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
        Loading...
      </p>
    )
  }

  if (!component) {
    return (
      <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
        ไม่พบชิ้นส่วน
      </p>
    )
  }

  return <ComponentForm categories={categories} initial={component} />
}
