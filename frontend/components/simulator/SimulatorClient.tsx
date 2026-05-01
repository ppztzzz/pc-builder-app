"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { AlertCircle } from "lucide-react"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { checkCompat, type SlotState } from "@/frontend/lib/compatibility"
import { ComponentSidebar } from "./ComponentSidebar"
import { PCCase } from "./PCCase"
import { BuildSummary } from "./BuildSummary"

type Props = {
  components: ComponentResponse[]
}

export function SimulatorClient({ components }: Props) {
  const [slots, setSlots] = useState<SlotState>({})
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  // Auto-clear errors after 4 seconds
  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 4000)
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
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-sm border-2 border-primary bg-background text-primary p-4 shadow-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-1">
                ลงไม่ได้
              </p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6 items-start">
        <ComponentSidebar components={components} usedIds={usedIds} />
        <div className="lg:sticky lg:top-24">
          <PCCase slots={slots} onRemove={handleRemove} />
        </div>
        <div className="lg:sticky lg:top-24">
          <BuildSummary slots={slots} />
        </div>
      </div>
    </DndContext>
  )
}
