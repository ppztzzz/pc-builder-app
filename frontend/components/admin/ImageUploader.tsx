"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { uploadApi } from "@/frontend/api/uploadApi"

type Props = {
  onUploaded: (filenames: string[]) => void
  multiple?: boolean
}

export function ImageUploader({ onUploaded, multiple = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError("")

    const fileArray = Array.from(files)
    setPreviews(fileArray.map((f) => URL.createObjectURL(f)))
    setUploading(true)

    try {
      const filenames = await uploadApi.upload(fileArray)
      onUploaded(filenames)
      setPreviews([])
      if (inputRef.current) inputRef.current.value = ""
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed border-foreground p-8 text-center cursor-pointer hover:bg-card transition ${
          uploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs uppercase tracking-widest font-bold">
              กำลังอัพโหลด...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8" strokeWidth={1.5} />
            <p className="text-xs uppercase tracking-widest font-bold">
              คลิกเพื่อเลือกรูป
            </p>
            <p className="text-xs text-muted">
              JPG / PNG / WebP — สูงสุด 5MB
            </p>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
          {previews.map((src, i) => (
            <div key={i} className="aspect-square border border-border overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-primary border-2 border-primary px-3 py-2 bg-primary/5 inline-flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}
