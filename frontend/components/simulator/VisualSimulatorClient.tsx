"use client"

import { useEffect, useMemo, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CircleDashed,
  Lightbulb,
  MousePointer2,
} from "lucide-react"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"
import { COMPONENT_TYPE_LABEL } from "@/shared/types/component"
import {
  checkCompat,
  computeTotalPrice,
  computeTotalTdp,
  isBuildComplete,
  type SlotState,
} from "@/frontend/lib/compatibility"
import { predictFps } from "@/frontend/lib/fps"
import { VisualPCCase } from "./VisualPCCase"

type Props = {
  components: ComponentResponse[]
}

type AssemblyStep = {
  type: ComponentType
  title: string
  action: string
  lesson: string
}

const STEPS: AssemblyStep[] = [
  {
    type: "MB",
    title: "ติดตั้งเมนบอร์ด",
    action: "เลือกบอร์ดเป็นฐานของเครื่อง",
    lesson: "เมนบอร์ดกำหนด socket ของ CPU, ชนิด RAM และช่องเสียบหลักทั้งหมด",
  },
  {
    type: "CPU",
    title: "ใส่ซีพียู",
    action: "วาง CPU ลง socket",
    lesson: "CPU ต้องตรง socket กับเมนบอร์ด เพราะหน้าสัมผัสและตำแหน่งล็อกไม่เหมือนกัน",
  },
  {
    type: "COOLER",
    title: "ติดตั้งชุดระบายความร้อน",
    action: "ครอบ cooler บน CPU",
    lesson: "Cooler ต้องรองรับ TDP ของ CPU เพื่อให้เครื่องไม่ร้อนเกินเวลาใช้งานหนัก",
  },
  {
    type: "RAM",
    title: "เสียบแรม",
    action: "ใส่ RAM ในช่อง DIMM",
    lesson: "RAM DDR4 และ DDR5 ใช้แทนกันไม่ได้ ต้องเลือกให้ตรงกับเมนบอร์ด",
  },
  {
    type: "STORAGE",
    title: "ติดตั้งพื้นที่เก็บข้อมูล",
    action: "เพิ่ม SSD/HDD ให้ระบบ",
    lesson: "Storage คือที่เก็บระบบปฏิบัติการ เกม และไฟล์งาน เครื่องเปิดไม่ได้ถ้าไม่มีไดรฟ์ระบบ",
  },
  {
    type: "GPU",
    title: "ใส่การ์ดจอ",
    action: "เสียบ GPU ในช่อง PCIe",
    lesson: "GPU มีผลมากกับ FPS เกม และเพิ่มภาระไฟให้ PSU",
  },
  {
    type: "PSU",
    title: "ติดตั้งพาวเวอร์ซัพพลาย",
    action: "เลือก PSU ที่จ่ายไฟพอ",
    lesson: "PSU ควรมีกำลังไฟเหลือเผื่อ CPU, GPU, อุปกรณ์เสริม และโหลดกระชาก",
  },
]

function parseSpecs(component: ComponentResponse): Record<string, unknown> {
  try {
    return JSON.parse(component.specs) as Record<string, unknown>
  } catch {
    return {}
  }
}

function formatSpecs(component: ComponentResponse): string {
  const specs = parseSpecs(component)
  if (component.socket) return component.socket
  if (typeof specs.type === "string" && typeof specs.size === "number") {
    return `${specs.size}GB ${specs.type}`
  }
  if (typeof specs.watt === "number") return `${specs.watt}W`
  if (typeof specs.tdp === "number") return `${specs.tdp}W TDP`
  if (typeof specs.vram === "number") return `${specs.vram}GB VRAM`
  return component.type
}

function DraggablePart({
  component,
  disabled,
}: {
  component: ComponentResponse
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `visual-comp-${component.id}`,
      data: { component },
      disabled,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : disabled ? 0.35 : 1,
    cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 60 : "auto",
  }

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...listeners}
      {...attributes}
      className="w-full border-2 border-foreground bg-card p-3 text-left transition hover:border-primary disabled:cursor-not-allowed"
      disabled={disabled}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
          {component.type} · {formatSpecs(component)}
        </p>
        <MousePointer2 className="h-3.5 w-3.5 shrink-0 text-muted" />
      </div>
      <p className="text-sm font-extrabold leading-tight">{component.name}</p>
      <p className="mt-1 text-xs text-muted">฿{component.price.toLocaleString()}</p>
    </button>
  )
}

function StepRail({
  activeIndex,
  slots,
  onSelect,
}: {
  activeIndex: number
  slots: SlotState
  onSelect: (index: number) => void
}) {
  return (
    <div className="space-y-2">
      {STEPS.map((step, index) => {
        const done = Boolean(slots[step.type])
        const active = index === activeIndex
        return (
          <button
            key={step.type}
            type="button"
            onClick={() => onSelect(index)}
            className={`flex w-full items-center justify-between gap-3 border-2 p-3 text-left transition ${
              active
                ? "border-primary bg-primary/10"
                : "border-foreground bg-background hover:border-primary"
            }`}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
                Step {index + 1}
              </p>
              <p className="truncate text-sm font-extrabold">{step.title}</p>
            </div>
            {done ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
            ) : (
              <CircleDashed className="h-5 w-5 shrink-0 text-muted" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function SystemCheck({ slots }: { slots: SlotState }) {
  const total = computeTotalPrice(slots)
  const tdp = computeTotalTdp(slots)
  const complete = isBuildComplete(slots)
  const fps = predictFps(slots.GPU)

  const checks = [
    { label: "Mainboard", ok: Boolean(slots.MB) },
    { label: "CPU", ok: Boolean(slots.CPU) },
    { label: "Cooling", ok: Boolean(slots.COOLER) },
    { label: "Memory", ok: Boolean(slots.RAM) },
    { label: "Storage", ok: Boolean(slots.STORAGE) },
    { label: "Power", ok: Boolean(slots.PSU) },
  ]

  return (
    <div
      className={`border-2 p-4 ${
        complete
          ? "border-primary bg-primary/10"
          : "border-foreground bg-card"
      }`}
    >
      <div className="mb-4 border-b-2 border-foreground pb-3">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
          Final Check
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">
          {complete ? "ประกอบครบแล้ว" : "พร้อมเปิดเครื่องไหม"}
        </h2>
      </div>

      {complete ? (
        <div className="mb-4 flex items-start gap-3 border-2 border-primary bg-background p-3 text-primary">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-bold leading-relaxed">
            ประกอบครบทุกขั้นแล้ว ตรวจความเข้ากันได้พื้นฐานผ่าน พร้อมทดสอบเปิดเครื่อง
          </p>
        </div>
      ) : null}

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between border-2 border-foreground bg-background p-2 text-sm font-bold"
          >
            {check.label}
            {check.ok ? (
              <CheckCircle className="h-4 w-4 text-primary" />
            ) : (
              <CircleDashed className="h-4 w-4 text-muted" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="border-2 border-foreground bg-background p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
            Price
          </p>
          <p className="text-xl font-extrabold">฿{total.toLocaleString()}</p>
        </div>
        <div className="border-2 border-foreground bg-background p-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
            Load
          </p>
          <p className="text-xl font-extrabold">{tdp}W</p>
        </div>
      </div>

      <div className="mt-3 border-2 border-foreground bg-background p-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          Result
        </p>
        <p className="text-sm font-bold">
          {complete ? "ผ่านขั้นพื้นฐาน พร้อมทดสอบเปิดเครื่อง" : "ยังประกอบไม่ครบ"}
        </p>
        {fps ? (
          <p className="mt-2 text-xs leading-relaxed text-muted">
            FPS เป็นค่าประมาณเพื่อการเรียนรู้: Valorant {fps.valorant}, GTA V{" "}
            {fps.gta5}, Cyberpunk {fps.cyberpunk}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function VisualSimulatorClient({ components }: Props) {
  const [slots, setSlots] = useState<SlotState>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const isFirstStep = activeIndex === 0
  const isLastStep = activeIndex === STEPS.length - 1

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  )

  const activeStep = STEPS[activeIndex]
  const activeParts = useMemo(
    () => components.filter((component) => component.type === activeStep.type),
    [activeStep.type, components]
  )

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 4500)
    return () => clearTimeout(t)
  }, [message])

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

    if (targetSlot !== activeStep.type) {
      setMessage(`ขั้นนี้ต้องประกอบ ${COMPONENT_TYPE_LABEL[activeStep.type]} ก่อน`)
      return
    }

    const result = checkCompat(draggedComponent, targetSlot, slots)
    if (!result.ok) {
      setMessage(result.reason ?? "ไม่สามารถวางได้")
      return
    }

    setSlots((prev) => ({ ...prev, [targetSlot]: draggedComponent }))
    setMessage(`ติดตั้ง ${COMPONENT_TYPE_LABEL[targetSlot]} แล้ว`)
    setActiveIndex((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  const handleRemove = (type: ComponentType) => {
    setSlots((prev) => {
      const next = { ...prev }
      delete next[type]
      return next
    })
    const index = STEPS.findIndex((step) => step.type === type)
    if (index >= 0) setActiveIndex(index)
  }

  const usedIds = Object.values(slots)
    .filter((component): component is ComponentResponse => Boolean(component))
    .map((component) => component.id)

  const goPrevious = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0))
  }

  const goNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, STEPS.length - 1))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {message ? (
        <div className="fixed right-4 top-4 z-50 max-w-sm border-2 border-primary bg-background p-4 text-primary shadow-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{message}</p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <aside className="space-y-6">
          <div className="border-b-2 border-foreground pb-3">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Lesson
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight">ขั้นตอนประกอบ</h2>
          </div>
          <StepRail
            activeIndex={activeIndex}
            slots={slots}
            onSelect={setActiveIndex}
          />
        </aside>

        <main className="min-w-0 xl:sticky xl:top-24">
          <VisualPCCase
            slots={slots}
            activeType={activeStep.type}
            onRemove={handleRemove}
          />
        </main>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <div className="border-2 border-foreground bg-card p-4">
            <div className="mb-4 border-b-2 border-foreground pb-3">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Workbench
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {activeStep.title}
              </h2>
            </div>

            <div className="mb-4 border-2 border-foreground bg-background p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
                <Lightbulb className="h-4 w-4" />
                ทำอะไร
              </div>
              <p className="text-sm font-bold">{activeStep.action}</p>
              <p className="mt-2 border-l-2 border-primary pl-3 text-sm font-bold text-primary">
                ลากชิ้นส่วนด้านล่างไปยังตำแหน่งที่ขอบสีน้ำเงินในเคส
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {activeStep.lesson}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={goPrevious}
                disabled={isFirstStep}
                className="inline-flex items-center justify-center gap-2 border-2 border-foreground px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={isLastStep}
                className="inline-flex items-center justify-center gap-2 bg-foreground px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-foreground"
              >
                ถัดไป
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {activeParts.map((component) => (
                <DraggablePart
                  key={component.id}
                  component={component}
                  disabled={usedIds.includes(component.id)}
                />
              ))}
            </div>
          </div>

          <SystemCheck slots={slots} />
        </aside>
      </div>
    </DndContext>
  )
}
