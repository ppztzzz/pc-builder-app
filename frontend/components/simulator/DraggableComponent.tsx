"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { ComponentResponse } from "@/shared/types/component"

type Props = {
  component: ComponentResponse
  disabled?: boolean
}

export function DraggableComponent({ component, disabled }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `comp-${component.id}`,
      data: { component },
      disabled,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : disabled ? 0.3 : 1,
    cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-2 border-foreground bg-card p-3 hover:border-primary transition select-none"
    >
      <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
        {component.type}
        {component.socket ? ` · ${component.socket}` : ""}
      </p>
      <p className="font-bold text-sm leading-tight mb-1">{component.name}</p>
      <p className="text-xs text-muted">฿{component.price.toLocaleString()}</p>
    </div>
  )
}
