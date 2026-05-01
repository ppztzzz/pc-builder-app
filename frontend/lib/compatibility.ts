import type {
  ComponentResponse,
  ComponentType,
  CpuSpecs,
  MbSpecs,
  RamSpecs,
  GpuSpecs,
  PsuSpecs,
  CoolerSpecs,
} from "@/shared/types/component"

export type SlotState = Partial<Record<ComponentType, ComponentResponse>>

export type CompatResult = {
  ok: boolean
  reason?: string
}

function parseSpecs<T>(c: ComponentResponse | undefined): T | null {
  if (!c) return null
  try {
    return JSON.parse(c.specs) as T
  } catch {
    return null
  }
}

/**
 * Check if a component can be placed in a target slot, given the current build state.
 * Returns ok:true if compatible, ok:false with a Thai reason if not.
 */
export function checkCompat(
  component: ComponentResponse,
  targetSlot: ComponentType,
  current: SlotState
): CompatResult {
  // Type must match the slot
  if (component.type !== targetSlot) {
    return { ok: false, reason: `ลงใน slot ${targetSlot} ไม่ได้ — ชิ้นนี้คือ ${component.type}` }
  }

  // CPU vs MB socket
  if (component.type === "CPU" && current.MB) {
    if (component.socket && current.MB.socket && component.socket !== current.MB.socket) {
      return {
        ok: false,
        reason: `Socket ไม่ตรง — CPU ใช้ ${component.socket}, เมนบอร์ดใช้ ${current.MB.socket}`,
      }
    }
  }
  if (component.type === "MB" && current.CPU) {
    if (component.socket && current.CPU.socket && component.socket !== current.CPU.socket) {
      return {
        ok: false,
        reason: `Socket ไม่ตรง — เมนบอร์ดใช้ ${component.socket}, CPU ใช้ ${current.CPU.socket}`,
      }
    }
  }

  // RAM type vs MB
  if (component.type === "RAM" && current.MB) {
    const ram = parseSpecs<RamSpecs>(component)
    const mb = parseSpecs<MbSpecs>(current.MB)
    if (ram && mb && ram.type !== mb.ramType) {
      return {
        ok: false,
        reason: `RAM ไม่ตรง — เมนบอร์ดรับ ${mb.ramType}, แต่ RAM นี้คือ ${ram.type}`,
      }
    }
  }
  if (component.type === "MB" && current.RAM) {
    const mb = parseSpecs<MbSpecs>(component)
    const ram = parseSpecs<RamSpecs>(current.RAM)
    if (ram && mb && ram.type !== mb.ramType) {
      return {
        ok: false,
        reason: `RAM ไม่ตรง — RAM ที่ลงไว้คือ ${ram.type}, แต่เมนบอร์ดนี้รับ ${mb.ramType}`,
      }
    }
  }

  // PSU watt vs total TDP
  if (component.type === "PSU") {
    const psu = parseSpecs<PsuSpecs>(component)
    const totalTdp = computeTotalTdp(current)
    if (psu && totalTdp > psu.watt) {
      return {
        ok: false,
        reason: `กำลังไฟไม่พอ — ระบบกิน ${totalTdp}W แต่ PSU จ่ายแค่ ${psu.watt}W`,
      }
    }
  }

  // Cooler vs CPU TDP
  if (component.type === "COOLER" && current.CPU) {
    const cooler = parseSpecs<CoolerSpecs>(component)
    const cpu = parseSpecs<CpuSpecs>(current.CPU)
    if (cooler && cpu && cpu.tdp > cooler.tdpSupport) {
      return {
        ok: false,
        reason: `ระบายความร้อนไม่พอ — CPU ปล่อย ${cpu.tdp}W แต่ cooler รับได้ ${cooler.tdpSupport}W`,
      }
    }
  }

  return { ok: true }
}

export function computeTotalTdp(state: SlotState): number {
  const cpu = parseSpecs<CpuSpecs>(state.CPU)
  const gpu = parseSpecs<GpuSpecs>(state.GPU)
  const cpuTdp = cpu?.tdp ?? 0
  const gpuTdp = gpu?.tdp ?? 0
  // 80W headroom for board, fans, drives
  return cpuTdp + gpuTdp + 80
}

export function computeTotalPrice(state: SlotState): number {
  return Object.values(state)
    .filter((c): c is ComponentResponse => !!c)
    .reduce((sum, c) => sum + (c.price ?? 0), 0)
}

export function isBuildComplete(state: SlotState): boolean {
  // Required slots for a working PC
  const required: ComponentType[] = ["CPU", "MB", "RAM", "PSU", "STORAGE", "COOLER"]
  return required.every((t) => state[t])
}
