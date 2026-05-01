"use client"

import { useDroppable } from "@dnd-kit/core"
import { X } from "lucide-react"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import { getIcon } from "@/shared/constants/icons"

type Props = {
  type: ComponentType
  component: ComponentResponse | undefined
  onRemove: () => void
  iconName?: string
}

export function DropSlot({ type, component, onRemove, iconName }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: `slot-${type}` })
  const Icon = iconName ? getIcon(iconName) : null

  return (
    <div
      ref={setNodeRef}
      className={`border-2 p-4 transition-colors min-h-24 ${
        isOver
          ? "border-primary bg-primary/10"
          : component
            ? "border-foreground bg-card"
            : "border-dashed border-muted bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted">
              {COMPONENT_TYPE_LABEL[type]}
            </p>
            {component ? (
              <>
                <p className="font-bold text-sm leading-tight truncate">
                  {component.name}
                </p>
                <p className="text-xs text-muted">
                  ฿{component.price.toLocaleString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">— ลากชิ้นส่วนมาวาง —</p>
            )}
          </div>
        </div>

        {component && (
          <button
            type="button"
            onClick={onRemove}
            className="text-muted hover:text-primary transition flex-shrink-0"
            title="ถอดออก"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
