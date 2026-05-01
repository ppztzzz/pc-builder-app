"use client"

import type { ComponentType } from "@/shared/types/component"

type Props = {
  type: ComponentType
  value: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
}

const inputClass =
  "w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none text-sm"
const labelClass = "block text-[10px] uppercase tracking-widest font-bold mb-1"

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: unknown
  onChange: (v: number) => void
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass}
      />
    </div>
  )
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: unknown
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={typeof value === "string" ? value : options[0]}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SpecFields({ type, value, onChange }: Props) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v })

  switch (type) {
    case "CPU":
      return (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Cores" value={value.cores} onChange={(v) => set("cores", v)} />
          <NumberInput label="Threads" value={value.threads} onChange={(v) => set("threads", v)} />
          <NumberInput label="TDP (W)" value={value.tdp} onChange={(v) => set("tdp", v)} />
          <SelectInput
            label="RAM Type"
            value={value.ramType}
            options={["DDR4", "DDR5"]}
            onChange={(v) => set("ramType", v)}
          />
        </div>
      )

    case "MB":
      return (
        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="RAM Type"
            value={value.ramType}
            options={["DDR4", "DDR5"]}
            onChange={(v) => set("ramType", v)}
          />
          <NumberInput label="Max RAM (GB)" value={value.maxRam} onChange={(v) => set("maxRam", v)} />
        </div>
      )

    case "RAM":
      return (
        <div className="grid grid-cols-3 gap-3">
          <NumberInput label="Size (GB)" value={value.size} onChange={(v) => set("size", v)} />
          <SelectInput
            label="Type"
            value={value.type}
            options={["DDR4", "DDR5"]}
            onChange={(v) => set("type", v)}
          />
          <NumberInput label="Speed (MHz)" value={value.speed} onChange={(v) => set("speed", v)} />
        </div>
      )

    case "GPU":
      return (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="VRAM (GB)" value={value.vram} onChange={(v) => set("vram", v)} />
          <NumberInput label="TDP (W)" value={value.tdp} onChange={(v) => set("tdp", v)} />
        </div>
      )

    case "PSU":
      return (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Watt" value={value.watt} onChange={(v) => set("watt", v)} />
          <div>
            <label className={labelClass}>Efficiency</label>
            <input
              type="text"
              value={typeof value.efficiency === "string" ? value.efficiency : ""}
              onChange={(e) => set("efficiency", e.target.value)}
              placeholder="80+ Gold"
              className={inputClass}
            />
          </div>
        </div>
      )

    case "STORAGE":
      return (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput label="Size (GB)" value={value.size} onChange={(v) => set("size", v)} />
          <SelectInput
            label="Type"
            value={value.type}
            options={["NVMe", "SATA"]}
            onChange={(v) => set("type", v)}
          />
        </div>
      )

    case "COOLER":
      return (
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="TDP Support (W)"
            value={value.tdpSupport}
            onChange={(v) => set("tdpSupport", v)}
          />
          <NumberInput label="Height (mm)" value={value.height} onChange={(v) => set("height", v)} />
        </div>
      )
  }
}
