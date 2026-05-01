"use client"

import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { X, Copy, Check, Share2 } from "lucide-react"

type Props = {
  buildId: string
  onClose: () => void
}

export function ShareDialog({ buildId, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    setShareUrl(`${window.location.origin}/build/${buildId}`)
  }, [buildId])

  const handleCopy = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="border-2 border-foreground bg-background w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-foreground p-4">
          <p className="text-xs uppercase tracking-[0.25em] font-bold inline-flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            แชร์ Build
          </p>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-primary transition"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-center">
            <div className="border-2 border-foreground p-3 bg-white">
              {shareUrl && (
                <QRCodeSVG value={shareUrl} size={180} level="M" />
              )}
            </div>
          </div>

          <p className="text-xs uppercase tracking-widest text-muted text-center">
            สแกนด้วยมือถือ หรือคัดลอกลิงก์
          </p>

          <div className="border-2 border-foreground bg-card p-3 flex items-center gap-2">
            <p className="text-xs flex-1 truncate font-mono">{shareUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-foreground text-background hover:bg-primary text-[10px] uppercase tracking-widest font-bold transition flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
