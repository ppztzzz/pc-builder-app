"use client"

import { useEffect, useState } from "react"
import { Gamepad2 } from "lucide-react"
import { componentApi } from "@/frontend/api/componentApi"
import { SimulatorClient } from "@/frontend/components/simulator/SimulatorClient"
import { useTitle } from "@/frontend/hooks/useTitle"
import type { ComponentResponse } from "@/shared/types/component"

export default function SimulatorPage() {
  useTitle("ประกอบคอมเอง")
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
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2 inline-flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Hands-on Lab
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight border-b-2 border-foreground pb-4">
          ประกอบคอมเอง
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          ลากชิ้นส่วนทางซ้ายมาวางในเคส ระบบจะตรวจ compatibility ให้อัตโนมัติ —
          socket / RAM type / กำลังไฟ
        </p>
      </div>

      <SimulatorClient components={components} />
    </div>
  )
}
