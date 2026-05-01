"use client"

import { useState } from "react"
import { Save, X } from "lucide-react"
import { categoryApi } from "@/frontend/api/categoryApi"
import { AVAILABLE_ICON_NAMES, getIcon } from "@/shared/constants/icons"
import type { CategoryResponse } from "@/shared/types/category"

type Props = {
  initial?: CategoryResponse
  onDone: () => void
  onCancel: () => void
}

export function CategoryForm({ initial, onDone, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "")
  const [icon, setIcon] = useState(initial?.icon ?? AVAILABLE_ICON_NAMES[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      if (initial) {
        await categoryApi.update(initial.id, { name, icon })
      } else {
        await categoryApi.create({ name, icon })
      }
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      setSubmitting(false)
    }
  }

  const PreviewIcon = getIcon(icon)

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-foreground bg-card p-4 space-y-3"
    >
      <p className="text-xs uppercase tracking-widest font-bold">
        {initial ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
            ชื่อ
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
            Icon
          </label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none text-sm min-w-32"
          >
            {AVAILABLE_ICON_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold mb-1">
            Preview
          </label>
          <div className="border-2 border-foreground p-2 inline-flex">
            <PreviewIcon className="w-6 h-6" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm font-medium text-primary">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-primary transition disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition"
        >
          <X className="w-3.5 h-3.5" />
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
