"use client"

import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { COMPONENT_TYPES, COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import { DraggableComponent } from "./DraggableComponent"

type Props = {
  components: ComponentResponse[]
  usedIds: number[]
}

export function ComponentSidebar({ components, usedIds }: Props) {
  const grouped = COMPONENT_TYPES.map((type) => ({
    type,
    items: components.filter((c) => c.type === type),
  })).filter((g) => g.items.length > 0)

  return (
    <aside className="space-y-6">
      <div className="border-b-2 border-foreground pb-3">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
          Parts
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">ชิ้นส่วน</h2>
      </div>

      {grouped.map((g) => (
        <div key={g.type}>
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-2">
            {COMPONENT_TYPE_LABEL[g.type]} · {g.items.length}
          </p>
          <div className="space-y-2">
            {g.items.map((c) => (
              <DraggableComponent
                key={c.id}
                component={c}
                disabled={usedIds.includes(c.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}
