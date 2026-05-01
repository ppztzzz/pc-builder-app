"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { componentApi } from "@/frontend/api/componentApi"
import { useTitle } from "@/frontend/hooks/useTitle"
import {
  COMPONENT_TYPES,
  COMPONENT_TYPE_LABEL,
} from "@/shared/types/component"
import type {
  ComponentResponse,
  ComponentType,
} from "@/shared/types/component"

export default function AdminComponentsPage() {
  useTitle("จัดการชิ้นส่วน")
  const [components, setComponents] = useState<ComponentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<ComponentType | "ALL">("ALL")

  const refresh = () => {
    setLoading(true)
    componentApi.list().then((data) => {
      setComponents(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`ลบชิ้นส่วน "${name}"?`)) return
    try {
      await componentApi.delete(id)
      refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed")
    }
  }

  const filtered =
    filterType === "ALL"
      ? components
      : components.filter((c) => c.type === filterType)

  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-foreground pb-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
            Manage
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">ชิ้นส่วน</h1>
        </div>
        <Link
          href="/admin/components/new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-primary transition"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม
        </Link>
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {(["ALL", ...COMPONENT_TYPES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest font-bold transition border-2 ${
              filterType === t
                ? "bg-foreground text-background border-foreground"
                : "border-border hover:border-foreground"
            }`}
          >
            {t === "ALL" ? "ทั้งหมด" : COMPONENT_TYPE_LABEL[t]}
            <span className="ml-1.5 text-muted">
              {t === "ALL"
                ? components.length
                : components.filter((c) => c.type === t).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12 text-muted uppercase tracking-widest text-xs">
          ไม่มีชิ้นส่วนในประเภทนี้
        </p>
      ) : (
        <div className="border-2 border-foreground overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">ID</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">ประเภท</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">ชื่อ</th>
                <th className="text-left px-4 py-3 uppercase tracking-widest text-xs">Socket</th>
                <th className="text-right px-4 py-3 uppercase tracking-widest text-xs">ราคา</th>
                <th className="text-right px-4 py-3 uppercase tracking-widest text-xs w-40">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-card">
                  <td className="px-4 py-3 text-muted">{c.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold border border-foreground px-2 py-0.5">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.socket ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    ฿{c.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/components/${c.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-foreground hover:bg-foreground hover:text-background text-xs uppercase tracking-widest font-bold transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        แก้
                      </Link>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
