"use client"

import type { ComponentType } from "@/shared/types/component"
import type { SlotState } from "@/frontend/lib/compatibility"
import { DropSlot } from "./DropSlot"

const SLOT_LAYOUT: { type: ComponentType; iconName: string }[] = [
  { type: "CPU", iconName: "Cpu" },
  { type: "COOLER", iconName: "Fan" },
  { type: "MB", iconName: "CircuitBoard" },
  { type: "RAM", iconName: "MemoryStick" },
  { type: "GPU", iconName: "MonitorCog" },
  { type: "STORAGE", iconName: "HardDrive" },
  { type: "PSU", iconName: "Plug" },
]

type Props = {
  slots: SlotState
  onRemove: (type: ComponentType) => void
}

export function PCCase({ slots, onRemove }: Props) {
  return (
    <div className="border-2 border-foreground bg-background p-4">
      <div className="border-b-2 border-foreground pb-3 mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          Build
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">เคสคอมพิวเตอร์</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SLOT_LAYOUT.map((s) => (
          <DropSlot
            key={s.type}
            type={s.type}
            component={slots[s.type]}
            onRemove={() => onRemove(s.type)}
            iconName={s.iconName}
          />
        ))}
      </div>
    </div>
  )
}
