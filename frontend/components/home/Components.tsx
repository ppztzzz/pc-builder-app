"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ComponentCard } from "@/frontend/components/component/ComponentCard"
import { SectionTitle } from "@/frontend/components/ui/SectionTitle"
import type { ComponentResponse } from "@/shared/types/component"

type Props = {
  components: ComponentResponse[]
}

export function Components({ components }: Props) {
  if (components.length === 0) return null

  // Pick one of each type so the showcase is varied
  const seen = new Set<string>()
  const featured: ComponentResponse[] = []
  for (const c of components) {
    if (seen.has(c.type)) continue
    seen.add(c.type)
    featured.push(c)
    if (featured.length >= 6) break
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 border-t border-border">
      <SectionTitle label="Catalog" title="ชิ้นส่วน" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {featured.map((c) => (
          <Link key={c.id} href={`/components?type=${c.type}`}>
            <ComponentCard component={c} />
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
        >
          ดูชิ้นส่วนทั้งหมด
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
