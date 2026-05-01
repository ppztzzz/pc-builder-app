"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Star } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { ArticleResponse } from "@/shared/types/article"

export default function AdminArticlesPage() {
  useTitle("จัดการบทความ")
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    setLoading(true)
    articleApi.list().then((data) => {
      setArticles(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`ลบบทความ "${title}"?`)) return
    await articleApi.delete(id)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
            Manage
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">บทความ</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-primary transition"
        >
          <Plus className="w-4 h-4" />
          เขียนใหม่
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
          Loading...
        </p>
      ) : articles.length === 0 ? (
        <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
          ยังไม่มีบทความ
        </p>
      ) : (
        <div className="border-2 border-foreground overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">ID</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">หัวข้อ</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">หมวด</th>
                <th className="text-center px-4 py-3 uppercase tracking-widest text-xs w-20">รูป</th>
                <th className="text-center px-4 py-3 uppercase tracking-widest text-xs w-24">Featured</th>
                <th className="text-right px-4 py-3 uppercase tracking-widest text-xs w-40">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-card">
                  <td className="px-4 py-3 text-muted">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {a.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-muted">
                    {a.images.length}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.isFeatured && (
                      <Star className="w-4 h-4 inline-block fill-primary text-primary" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-widest font-bold transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        แก้
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-foreground hover:bg-primary hover:border-primary hover:text-primary-fg text-xs uppercase tracking-widest font-bold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
