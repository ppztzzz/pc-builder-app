import {
  Cpu,
  MemoryStick,
  CircuitBoard,
  MonitorCog,
  HardDrive,
  Plug,
  Fan,
  Box,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu,
  MemoryStick,
  CircuitBoard,
  MonitorCog,
  HardDrive,
  Plug,
  Fan,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Box
}

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_MAP)
