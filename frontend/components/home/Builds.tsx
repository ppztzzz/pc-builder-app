"use client"

import Link from "next/link"
import { ArrowRight, Cpu, MonitorCog } from "lucide-react"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"
import type { BuildListItem } from "@/shared/types/build"

type Props = {
  builds: BuildListItem[]
}

export function Builds({ builds }: Props) {
  if (builds.length === 0) return null

  const items = builds.slice(0, 6)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t border-border">
      <SectionTitle label="Community" title="บิลด์ล่าสุด" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((b) => (
          <Link
            key={b.id}
            href={`/build/${b.id}`}
            className="border-2 border-foreground bg-card p-5 hover:bg-foreground hover:text-background transition group"
          >
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">
              Build · {b.id}
            </p>
            <div className="space-y-2 text-sm mb-4 min-h-[60px]">
              <p className="flex items-start gap-2">
                <Cpu className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                <span className="line-clamp-1">{b.cpuName ?? "—"}</span>
              </p>
              <p className="flex items-start gap-2">
                <MonitorCog className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                <span className="line-clamp-1">{b.gpuName ?? "—"}</span>
              </p>
            </div>
            <div className="flex items-baseline justify-between border-t-2 border-current/20 pt-3">
              <p className="text-2xl font-extrabold">
                ฿{b.totalPrice.toLocaleString()}
              </p>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/simulator"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
        >
          ลองสร้างบิลด์ของคุณ
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
