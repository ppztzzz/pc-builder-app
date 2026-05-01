import { uploadService } from "@/backend/services/uploadService"
import { requireAdmin } from "@/backend/session"

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const formData = await req.formData()
  const files = formData.getAll("files") as File[]

  if (files.length === 0) {
    return Response.json({ error: "ไม่มีไฟล์" }, { status: 400 })
  }

  try {
    const filenames = await Promise.all(
      files.map((f) => uploadService.saveImage(f))
    )
    return Response.json({ filenames })
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 }
    )
  }
}
