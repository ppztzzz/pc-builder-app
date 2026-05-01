"use client"

import { useEffect, useState } from "react"
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { AlertCircle, CheckCircle, CircleDashed, Lightbulb } from "lucide-react"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import {
  checkCompat,
  computeTotalTdp,
  isBuildComplete,
  type SlotState,
} from "@/frontend/lib/compatibility"
import { ComponentSidebar } from "./ComponentSidebar"
import { VisualPCCase } from "./VisualPCCase"
import { BuildSummary } from "./BuildSummary"

type Props = {
  components: ComponentResponse[]
}

const REQUIRED_ORDER: ComponentType[] = [
  "MB",
  "CPU",
  "COOLER",
  "RAM",
  "GPU",
  "STORAGE",
  "PSU",
]

function getNextStep(slots: SlotState): string {
  const missing = REQUIRED_ORDER.find((type) => !slots[type])
  if (!missing) return "ครบแล้ว ลองดูงบประมาณ กำลังไฟ และ FPS ว่าสมดุลกับเป้าหมายไหม"
  if (missing === "MB") return "เริ่มจากเมนบอร์ดเพื่อกำหนด socket และชนิด RAM"
  if (missing === "CPU") return "เลือก CPU ที่ socket ตรงกับเมนบอร์ด"
  if (missing === "COOLER") return "เลือก cooler ที่รองรับ TDP ของ CPU"
  if (missing === "RAM") return "เลือก RAM DDR ให้ตรงกับเมนบอร์ด"
  if (missing === "GPU") return "เลือก GPU ตามเกมหรือ FPS ที่ต้องการ"
  if (missing === "STORAGE") return "เลือก storage สำหรับระบบและเกม/ไฟล์งาน"
  return "เลือก PSU ที่มีกำลังไฟเหลือพอหลังรวม CPU และ GPU"
}

function LearningPanel({ slots }: { slots: SlotState }) {
  const totalTdp = computeTotalTdp(slots)
  const complete = isBuildComplete(slots)
  const checks = REQUIRED_ORDER.map((type) => ({
    type,
    ok: Boolean(slots[type]),
  }))

  return (
    <div className="border-2 border-foreground bg-card p-4">
      <div className="mb-4 border-b-2 border-foreground pb-3">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
          Learning
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">
          ลำดับการประกอบ
        </h2>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.type}
            className="flex items-center justify-between gap-3 border-2 border-foreground bg-background p-2"
          >
            <span className="text-xs font-bold">
              {COMPONENT_TYPE_LABEL[check.type]}
            </span>
            {check.ok ? (
              <CheckCircle className="h-4 w-4 text-primary" />
            ) : (
              <CircleDashed className="h-4 w-4 text-muted" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-2 border-foreground bg-background p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
          <Lightbulb className="h-4 w-4" />
          Next
        </div>
        <p className="text-sm leading-relaxed text-muted">{getNextStep(slots)}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="border-2 border-foreground bg-background p-3">
          <p className="mb-1 font-bold uppercase tracking-widest text-muted">
            Power Load
          </p>
          <p className="text-xl font-extrabold">{totalTdp}W</p>
        </div>
        <div className="border-2 border-foreground bg-background p-3">
          <p className="mb-1 font-bold uppercase tracking-widest text-muted">
            Boot
          </p>
          <p className="text-xl font-extrabold">
            {complete ? "Ready" : "Pending"}
          </p>
        </div>
      </div>
    </div>
  )
}

export function VisualSimulatorClient({ components }: Props) {
  const [slots, setSlots] = useState<SlotState>({})
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 4500)
    return () => clearTimeout(t)
  }, [error])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const overId = String(over.id)
    if (!overId.startsWith("slot-")) return

    const targetSlot = overId.replace("slot-", "") as ComponentType
    const draggedComponent = active.data.current?.component as
      | ComponentResponse
      | undefined
    if (!draggedComponent) return

    const result = checkCompat(draggedComponent, targetSlot, slots)
    if (!result.ok) {
      setError(result.reason ?? "ไม่สามารถวางได้")
      return
    }

    setError(null)
    setSlots((prev) => ({ ...prev, [targetSlot]: draggedComponent }))
  }

  const handleRemove = (type: ComponentType) => {
    setSlots((prev) => {
      const next = { ...prev }
      delete next[type]
      return next
    })
  }

  const usedIds = Object.values(slots)
    .filter((c): c is ComponentResponse => !!c)
    .map((c) => c.id)

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {error ? (
        <div className="fixed right-4 top-4 z-50 max-w-sm border-2 border-primary bg-background p-4 text-primary shadow-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest">
                ลงไม่ได้
              </p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_1fr_320px]">
        <ComponentSidebar components={components} usedIds={usedIds} />
        <div className="min-w-0">
          <VisualPCCase slots={slots} onRemove={handleRemove} />
        </div>
        <div className="space-y-6 xl:sticky xl:top-24">
          <LearningPanel slots={slots} />
          <BuildSummary slots={slots} />
        </div>
      </div>
    </DndContext>
  )
}
