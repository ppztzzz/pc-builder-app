export type ComponentType =
  | "CPU"
  | "RAM"
  | "MB"
  | "GPU"
  | "PSU"
  | "STORAGE"
  | "COOLER"

export const COMPONENT_TYPES: ComponentType[] = [
  "CPU",
  "RAM",
  "MB",
  "GPU",
  "PSU",
  "STORAGE",
  "COOLER",
]

export const COMPONENT_TYPE_LABEL: Record<ComponentType, string> = {
  CPU: "ซีพียู",
  RAM: "แรม",
  MB: "เมนบอร์ด",
  GPU: "การ์ดจอ",
  PSU: "พาวเวอร์",
  STORAGE: "พื้นที่เก็บข้อมูล",
  COOLER: "ระบายความร้อน",
}

// JSON-encoded specs by type
export type CpuSpecs = { cores: number; threads: number; tdp: number; ramType: "DDR4" | "DDR5" }
export type MbSpecs = { ramType: "DDR4" | "DDR5"; maxRam: number }
export type RamSpecs = { size: number; type: "DDR4" | "DDR5"; speed: number }
export type GpuSpecs = { vram: number; tdp: number }
export type PsuSpecs = { watt: number; efficiency?: string }
export type StorageSpecs = { size: number; type: "NVMe" | "SATA" }
export type CoolerSpecs = { tdpSupport: number; height?: number }

export type ComponentResponse = {
  id: number
  name: string
  type: ComponentType
  socket: string | null
  specs: string // JSON encoded
  imageUrl: string
  description: string
  price: number
  categoryId: number | null
  articleId: number | null
}

export type CreateComponentRequest = {
  name: string
  type: ComponentType
  socket?: string
  specs: string
  imageUrl: string
  description: string
  price: number
  categoryId?: number
  articleId?: number
}

export type UpdateComponentRequest = Partial<CreateComponentRequest>
