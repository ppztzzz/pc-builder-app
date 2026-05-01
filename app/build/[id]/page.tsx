"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"
import { buildApi } from "@/frontend/api/buildApi"
import { PCCase } from "@/frontend/components/simulator/PCCase"
import { BuildSummary } from "@/frontend/components/simulator/BuildSummary"
import type { HydratedBuild } from "@/shared/types/build"

export default function BuildSharePage() {
  const params = useParams<{ id: string }>()
  const [build, setBuild] = useState<HydratedBuild | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    buildApi
      .detail(params.id)
      .then((data) => {
        setBuild(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [params?.id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  if (error || !build) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-muted mb-4">ไม่พบ Build นี้</p>
        <Link
          href="/simulator"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-primary"
        >
          <ArrowLeft className="w-4 h-4" /> ลองประกอบเอง
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/simulator"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-muted hover:text-primary transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> ประกอบเอง
      </Link>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2 inline-flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Shared Build
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight border-b-2 border-foreground pb-4">
          Build #{build.id}
        </h1>
        <p className="text-muted mt-3">
          แชร์เมื่อ{" "}
          {new Date(build.createdAt).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <PCCase slots={build.hydrated} onRemove={() => undefined} />
        <BuildSummary slots={build.hydrated} readOnly />
      </div>
    </div>
  )
}
