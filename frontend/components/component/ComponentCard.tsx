"use client"

import { Box } from "lucide-react"
import { COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import type { ComponentResponse } from "@/shared/types/component"

type Props = {
  component: ComponentResponse
}

export function ComponentCard({ component }: Props) {
  return (
    <div className="h-full flex flex-col border-2 border-foreground bg-card hover:bg-foreground hover:text-background transition group">
      <div className="aspect-square bg-background border-b-2 border-foreground flex items-center justify-center overflow-hidden shrink-0">
        {component.imageUrl ? (
          <img
            src={component.imageUrl}
            alt={component.name}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = "none"
            }}
          />
        ) : (
          <Box className="w-12 h-12 text-muted" strokeWidth={1.5} />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
          {component.type} · {COMPONENT_TYPE_LABEL[component.type]}
        </p>
        <p className="font-bold leading-tight mb-2 line-clamp-2 min-h-[2.5em]">
          {component.name}
        </p>
        <p className="text-2xl font-extrabold mt-auto">
          ฿{component.price.toLocaleString()}
        </p>
      </div>
    </div>
  )
}
