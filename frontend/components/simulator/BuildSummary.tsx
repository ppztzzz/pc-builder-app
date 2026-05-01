"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Share2, FileText, Loader2 } from "lucide-react"
import {
  computeTotalPrice,
  computeTotalTdp,
  isBuildComplete,
  type SlotState,
} from "@/frontend/lib/compatibility"
import { predictFps } from "@/frontend/lib/fps"
import { exportBuildPdf } from "@/frontend/lib/buildPdf"
import { buildApi } from "@/frontend/api/buildApi"
import { ShareDialog } from "./ShareDialog"
import type { BuildSlotEntry } from "@/shared/types/build"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"

type Props = {
  slots: SlotState
  readOnly?: boolean
}

export function BuildSummary({ slots, readOnly }: Props) {
  const [sharing, setSharing] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)

  const total = computeTotalPrice(slots)
  const tdp = computeTotalTdp(slots)
  const complete = isBuildComplete(slots)
  const fps = predictFps(slots.GPU)
  const filled = Object.values(slots).filter(Boolean).length
  const hasAny = filled > 0

  const handleShare = async () => {
    setSharing(true)
    try {
      const components: BuildSlotEntry[] = Object.entries(slots)
        .filter((entry): entry is [ComponentType, ComponentResponse] => !!entry[1])
        .map(([slot, c]) => ({ slot: slot as ComponentType, componentId: c.id }))

      const { id } = await buildApi.create({
        components,
        totalPrice: total,
        fpsResult: fps,
      })
      setShareId(id)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Share failed")
    } finally {
      setSharing(false)
    }
  }

  const handlePdf = () => {
    exportBuildPdf(slots, total, fps)
  }

  return (
    <>
      <div className="border-2 border-foreground bg-card p-4 space-y-4">
        <div className="border-b-2 border-foreground pb-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-1">
            Summary
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight">สรุปสเปก</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border-2 border-foreground p-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">
              ราคารวม
            </p>
            <p className="text-2xl font-extrabold">฿{total.toLocaleString()}</p>
          </div>
          <div className="border-2 border-foreground p-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">
              กินไฟ
            </p>
            <p className="text-2xl font-extrabold">{tdp}W</p>
          </div>
        </div>

        <div className="border-2 border-foreground p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted">
              สถานะ
            </p>
            <p className="text-xs font-bold">{filled}/7</p>
          </div>
          {complete ? (
            <p className="inline-flex items-center gap-2 font-bold text-primary">
              <CheckCircle className="w-5 h-5" />
              พร้อมเปิดเครื่อง
            </p>
          ) : (
            <p className="inline-flex items-center gap-2 font-bold text-muted">
              <AlertCircle className="w-5 h-5" />
              ยังประกอบไม่ครบ
            </p>
          )}
        </div>

        {fps && complete && (
          <div className="border-2 border-foreground p-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-3">
              คาดการณ์ FPS @ 1080p
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Valorant</span>
                <span className="font-extrabold">{fps.valorant} FPS</span>
              </div>
              <div className="flex justify-between">
                <span>GTA V</span>
                <span className="font-extrabold">{fps.gta5} FPS</span>
              </div>
              <div className="flex justify-between">
                <span>Cyberpunk 2077</span>
                <span className="font-extrabold">{fps.cyberpunk} FPS</span>
              </div>
            </div>
          </div>
        )}

        {!readOnly && hasAny && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-foreground">
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-3 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-primary transition disabled:opacity-50"
            >
              {sharing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              แชร์
            </button>
            <button
              type="button"
              onClick={handlePdf}
              className="inline-flex items-center justify-center gap-2 border-2 border-foreground px-3 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        )}
      </div>

      {shareId && (
        <ShareDialog buildId={shareId} onClose={() => setShareId(null)} />
      )}
    </>
  )
}
