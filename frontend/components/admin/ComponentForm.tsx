"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save, ArrowLeft } from "lucide-react"
import { componentApi } from "@/frontend/api/componentApi"
import { SpecFields } from "./SpecFields"
import {
  COMPONENT_TYPES,
  COMPONENT_TYPE_LABEL,
} from "@/shared/types/component"
import type {
  ComponentResponse,
  ComponentType,
} from "@/shared/types/component"
import type { CategoryResponse } from "@/shared/types/category"

type Props = {
  categories: CategoryResponse[]
  initial?: ComponentResponse
}

const inputClass =
  "w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none text-sm"
const labelClass = "block text-[10px] uppercase tracking-widest font-bold mb-1"

const SOCKET_TYPES: ComponentType[] = ["CPU", "MB"]

export function ComponentForm({ categories, initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial

  const [type, setType] = useState<ComponentType>(initial?.type ?? "CPU")
  const [name, setName] = useState(initial?.name ?? "")
  const [socket, setSocket] = useState(initial?.socket ?? "")
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [price, setPrice] = useState(initial?.price ?? 0)
  const [categoryId, setCategoryId] = useState<number | null>(
    initial?.categoryId ?? null
  )
  const [specs, setSpecs] = useState<Record<string, unknown>>(() => {
    try {
      return initial ? JSON.parse(initial.specs) : {}
    } catch {
      return {}
    }
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const dto = {
        type,
        name,
        socket: SOCKET_TYPES.includes(type) ? socket : undefined,
        specs: JSON.stringify(specs),
        imageUrl,
        description,
        price,
        categoryId: categoryId ?? undefined,
      }

      if (isEdit) {
        await componentApi.update(initial.id, dto)
      } else {
        await componentApi.create(dto)
      }
      router.push("/admin/components")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link
        href="/admin/components"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted hover:text-primary transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> กลับ
      </Link>

      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          {isEdit ? "Edit Component" : "New Component"}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight border-b-2 border-foreground pb-3">
          {isEdit ? "แก้ไขชิ้นส่วน" : "เพิ่มชิ้นส่วน"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ประเภท *</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ComponentType)
                  setSpecs({})
                }}
                required
                className={inputClass}
              >
                {COMPONENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t} — {COMPONENT_TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>

            {SOCKET_TYPES.includes(type) && (
              <div>
                <label className={labelClass}>Socket</label>
                <input
                  type="text"
                  value={socket}
                  onChange={(e) => setSocket(e.target.value)}
                  placeholder="LGA1700, AM5..."
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>ชื่อ *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>คำอธิบาย *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>ราคา (บาท) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>หมวดหมู่</label>
              <select
                value={categoryId ?? ""}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : null)
                }
                className={inputClass}
              >
                <option value="">— ไม่เลือก —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>URL รูปภาพ</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/components/cpu-intel-i5.png"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className={`${labelClass} mb-3`}>Specs ของ {COMPONENT_TYPE_LABEL[type]}</p>
          <div className="border-2 border-foreground p-4 bg-card">
            <SpecFields type={type} value={specs} onChange={setSpecs} />
            <pre className="text-xs text-muted mt-4 p-2 bg-background overflow-x-auto">
              {JSON.stringify(specs, null, 2)}
            </pre>
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
          href="/admin/components"
          className="inline-flex items-center gap-2 border-2 border-foreground px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
