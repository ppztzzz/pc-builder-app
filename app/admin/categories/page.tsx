"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { categoryApi } from "@/frontend/api/categoryApi"
import { CategoryForm } from "@/frontend/components/admin/CategoryForm"
import { getIcon } from "@/shared/constants/icons"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { CategoryResponse } from "@/shared/types/category"

type FormMode =
  | { type: "none" }
  | { type: "new" }
  | { type: "edit"; category: CategoryResponse }

export default function AdminCategoriesPage() {
  useTitle("จัดการหมวดหมู่")
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormMode>({ type: "none" })

  const refresh = () => {
    setLoading(true)
    categoryApi.list().then((data) => {
      setCategories(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`ลบหมวด "${name}"? (บทความในหมวดนี้จะมีปัญหาถ้ายังไม่ย้าย)`))
      return
    try {
      await categoryApi.delete(id)
      refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
            Manage
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">หมวดหมู่</h1>
        </div>
        {form.type === "none" && (
          <button
            onClick={() => setForm({ type: "new" })}
            className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-primary transition"
          >
            <Plus className="w-4 h-4" />
            เพิ่มหมวด
          </button>
        )}
      </div>

      {form.type !== "none" && (
        <div className="mb-6">
          <CategoryForm
            initial={form.type === "edit" ? form.category : undefined}
            onDone={() => {
              setForm({ type: "none" })
              refresh()
            }}
            onCancel={() => setForm({ type: "none" })}
          />
        </div>
      )}

      {loading ? (
        <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
          Loading...
        </p>
      ) : (
        <div className="border-2 border-foreground overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs w-16">ID</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs w-20">Icon</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">ชื่อ</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">Icon Name</th>
                <th className="text-right px-4 py-3 uppercase tracking-widest text-xs w-40">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const Icon = getIcon(c.icon)
                return (
                  <tr key={c.id} className="border-t border-border hover:bg-card">
                    <td className="px-4 py-3 text-muted">{c.id}</td>
                    <td className="px-4 py-3">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted text-xs uppercase tracking-widest">
                      {c.icon}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setForm({ type: "edit", category: c })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-widest font-bold transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          แก้
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-foreground hover:bg-primary hover:border-primary hover:text-primary-fg text-xs uppercase tracking-widest font-bold transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
