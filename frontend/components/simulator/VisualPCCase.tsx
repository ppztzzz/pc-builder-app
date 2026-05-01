"use client"

import { useDroppable } from "@dnd-kit/core"
import { CheckCircle, CircleDashed, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import { getIcon } from "@/shared/constants/icons"
import type { SlotState } from "@/frontend/lib/compatibility"

type VisualSlot = {
  type: ComponentType
  Icon: LucideIcon
  label: string
  hint: string
  className: string
}

const VISUAL_SLOTS: VisualSlot[] = [
  {
    type: "MB",
    Icon: getIcon("CircuitBoard"),
    label: "Mainboard",
    hint: "ฐานหลักของเครื่อง",
    className: "left-[18%] top-[15%] h-[62%] w-[54%]",
  },
  {
    type: "CPU",
    Icon: getIcon("Cpu"),
    label: "CPU",
    hint: "ต้องตรง socket กับบอร์ด",
    className: "left-[34%] top-[26%] h-[17%] w-[19%]",
  },
  {
    type: "COOLER",
    Icon: getIcon("Fan"),
    label: "Cooler",
    hint: "รองรับความร้อน CPU",
    className: "left-[33%] top-[45%] h-[16%] w-[21%]",
  },
  {
    type: "RAM",
    Icon: getIcon("MemoryStick"),
    label: "RAM",
    hint: "DDR ต้องตรงกับบอร์ด",
    className: "left-[56%] top-[24%] h-[38%] w-[10%]",
  },
  {
    type: "GPU",
    Icon: getIcon("MonitorCog"),
    label: "GPU",
    hint: "ตัวหลักของ FPS เกม",
    className: "left-[26%] top-[66%] h-[12%] w-[46%]",
  },
  {
    type: "STORAGE",
    Icon: getIcon("HardDrive"),
    label: "Storage",
    hint: "พื้นที่เก็บข้อมูล",
    className: "left-[75%] top-[20%] h-[24%] w-[17%]",
  },
  {
    type: "PSU",
    Icon: getIcon("Plug"),
    label: "PSU",
    hint: "ต้องมี watt เหลือพอ",
    className: "left-[7%] top-[80%] h-[14%] w-[30%]",
  },
]

type SlotProps = {
  slot: VisualSlot
  component: ComponentResponse | undefined
  onRemove: () => void
}

function VisualDropSlot({ slot, component, onRemove }: SlotProps) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${slot.type}` })
  const { Icon } = slot

  return (
    <div
      ref={setNodeRef}
      className={`absolute ${slot.className} border-2 p-2 transition-colors ${
        isOver
          ? "border-primary bg-primary/15"
          : component
            ? "border-foreground bg-background"
            : "border-dashed border-muted bg-card/95"
      }`}
    >
      <div className="flex h-full min-w-0 flex-col justify-between gap-2">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-extrabold uppercase tracking-widest">
                {slot.label}
              </p>
              <p className="hidden truncate text-[10px] text-muted sm:block">
                {slot.hint}
              </p>
            </div>
          </div>
          {component ? (
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 text-muted transition hover:text-primary"
              title="ถอดออก"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {component ? (
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-tight">
              {component.name}
            </p>
            <p className="text-[10px] font-bold text-primary">
              ฿{component.price.toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-muted">
            <CircleDashed className="h-3.5 w-3.5" />
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

type Props = {
  slots: SlotState
  onRemove: (type: ComponentType) => void
}

export function VisualPCCase({ slots, onRemove }: Props) {
  const filled = VISUAL_SLOTS.filter((slot) => slots[slot.type]).length

  return (
    <div className="border-2 border-foreground bg-background p-4">
      <div className="mb-4 flex items-start justify-between gap-4 border-b-2 border-foreground pb-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Visual Lab
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight">
            เคสประกอบแบบ 2D
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 text-xs font-extrabold">
          <CheckCircle className="h-4 w-4 text-primary" />
          {filled}/7
        </div>
      </div>

      <div className="relative aspect-4/5 min-h-130 overflow-hidden border-2 border-foreground bg-card sm:aspect-16/11 sm:min-h-140">
        <div className="absolute inset-[4%] border-2 border-foreground bg-background" />
        <div className="absolute left-[4%] top-[4%] h-[92%] w-[8%] border-r-2 border-foreground bg-card" />
        <div className="absolute right-[4%] top-[4%] h-[92%] w-[5%] border-l-2 border-foreground bg-card" />
        <div className="absolute bottom-[4%] left-[4%] h-[12%] w-[92%] border-t-2 border-foreground bg-card" />
        <div className="absolute left-[12%] top-[8%] text-[10px] font-bold uppercase tracking-widest text-muted">
          Airflow
        </div>
        <div className="absolute right-[8%] top-[48%] h-px w-[80%] bg-muted/40" />
        <div className="absolute right-[8%] top-[51%] h-px w-[80%] bg-muted/40" />

        {VISUAL_SLOTS.map((slot) => (
          <VisualDropSlot
            key={slot.type}
            slot={slot}
            component={slots[slot.type]}
            onRemove={() => onRemove(slot.type)}
          />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-muted sm:grid-cols-4">
        {VISUAL_SLOTS.map((slot) => (
          <div key={slot.type} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 ${
                slots[slot.type] ? "bg-primary" : "bg-muted"
              }`}
            />
            {COMPONENT_TYPE_LABEL[slot.type]}
          </div>
        ))}
      </div>
    </div>
  )
}
