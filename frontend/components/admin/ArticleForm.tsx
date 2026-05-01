"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft, Star } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { ImageUploader } from "@/frontend/components/admin/ImageUploader"
import type { ArticleResponse } from "@/shared/types/article"
import type { CategoryResponse } from "@/shared/types/category"

type Props = {
  categories: CategoryResponse[]
  initial?: ArticleResponse
}

export function ArticleForm({ categories, initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial

  const [title, setTitle] = useState(initial?.title ?? "")
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "")
  const [content, setContent] = useState(initial?.content ?? "")
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? 1
  )
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false)
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      if (isEdit) {
        await articleApi.update(initial.id, {
          title,
          excerpt: excerpt || undefined,
          content,
          categoryId,
          isFeatured,
        })
        if (pendingImages.length > 0) {
          await articleApi.addImages(initial.id, pendingImages)
        }
        router.push("/admin/articles")
      } else {
        const created = await articleApi.create({
          title,
          excerpt: excerpt || undefined,
          content,
          categoryId,
          isFeatured,
          imageFilenames: pendingImages,
        })
        router.push(`/admin/articles/${created.id}/edit`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted hover:text-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> กลับ
      </Link>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          {isEdit ? "Edit Article" : "New Article"}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight border-b-2 border-foreground pb-3">
          {isEdit ? "แก้ไขบทความ" : "เขียนบทความใหม่"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              หัวข้อ *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              สรุปสั้น (Excerpt)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={200}
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none resize-none"
            />
            <p className="text-xs text-muted mt-1">
              {excerpt.length}/200 — ใช้แสดงในการ์ดบทความ
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              เนื้อหา *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none resize-y"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              หมวดหมู่ *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-3 border-2 border-foreground p-3 cursor-pointer hover:bg-card transition">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-1"
            />
            <div>
              <div className="text-xs uppercase tracking-widest font-bold inline-flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" /> Featured
              </div>
              <p className="text-xs text-muted mt-0.5">
                แสดงบทความนี้ที่หน้าแรกใหญ่
              </p>
            </div>
          </label>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              รูปภาพ
            </label>
            <ImageUploader
              onUploaded={(filenames) =>
                setPendingImages((prev) => [...prev, ...filenames])
              }
            />
            {pendingImages.length > 0 && (
              <p className="text-xs text-muted mt-2 uppercase tracking-widest">
                อัพโหลดแล้ว {pendingImages.length} รูป — กดบันทึกเพื่อแนบ
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-primary border-2 border-primary px-3 py-2 bg-primary/5">
          {error}
        </p>
      )}

      <div className="border-t-2 border-foreground pt-4 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-primary transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {submitting ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 border-2 border-foreground px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
