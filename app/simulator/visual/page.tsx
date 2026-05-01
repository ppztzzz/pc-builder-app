"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeft, MonitorCog } from "lucide-react"
import { componentApi } from "@/frontend/api/componentApi"
import { VisualSimulatorClient } from "@/frontend/components/simulator/VisualSimulatorClient"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { ComponentResponse } from "@/shared/types/component"

export default function VisualSimulatorPage() {
  useTitle("Visual PC Lab")
  const [components, setComponents] = useState<ComponentResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    componentApi.list().then((data) => {
      setComponents(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-xs uppercase tracking-widest text-muted">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            <MonitorCog className="h-4 w-4" />
            Visual Assembly
          </p>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 text-xs font-bold uppercase tracking-widest transition hover:bg-foreground hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Builder เดิม
          </Link>
        </div>
        <h1 className="border-b-2 border-foreground pb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          ประกอบคอมแบบ Visual
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          หน้าใหม่สำหรับทดลอง simulator แบบเคส 2D วางชิ้นส่วนตามตำแหน่งจริง
          โดยยังใช้ระบบตรวจ compatibility เดิม
        </p>
      </div>

      <VisualSimulatorClient components={components} />
    </div>
  )
}
