import { writeFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"]

async function ensureDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true })
  }
}

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export const uploadService = {
  saveImage: async (file: File): Promise<string> => {
    if (!ALLOWED_MIME.includes(file.type)) {
      throw new Error(`ไฟล์ประเภท ${file.type} ไม่รองรับ`)
    }
    if (file.size > MAX_BYTES) {
      throw new Error(`ไฟล์ใหญ่เกิน ${MAX_BYTES / 1024 / 1024}MB`)
    }

    await ensureDir()

    const buffer = Buffer.from(await file.arrayBuffer())
    const ts = Date.now()
    const rand = Math.random().toString(36).slice(2, 8)
    const filename = `${ts}_${rand}_${sanitizeName(file.name)}`

    await writeFile(path.join(UPLOADS_DIR, filename), buffer)

    return filename
  },

  deleteImage: async (filename: string): Promise<void> => {
    const filepath = path.join(UPLOADS_DIR, filename)
    if (existsSync(filepath)) {
      await unlink(filepath)
    }
  },
}
