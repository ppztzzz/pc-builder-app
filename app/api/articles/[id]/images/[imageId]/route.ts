import { requireAdmin } from "@/backend/session"
import { prisma } from "@/backend/prisma/client"
import { uploadService } from "@/backend/services/uploadService"

type Ctx = { params: Promise<{ id: string; imageId: string }> }

// Delete one image
export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { imageId } = await params
  const id = Number(imageId)

  const img = await prisma.articleImage.findUnique({ where: { id } })
  if (!img) return new Response("Not found", { status: 404 })

  await uploadService.deleteImage(img.image)
  await prisma.articleImage.delete({ where: { id } })

  return Response.json({ ok: true })
}

// Set as cover (sets isCover=true, others=false for the same article)
export async function PATCH(_: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id, imageId } = await params
  const articleId = Number(id)
  const targetImageId = Number(imageId)

  await prisma.$transaction([
    prisma.articleImage.updateMany({
      where: { articleId },
      data: { isCover: false },
    }),
    prisma.articleImage.update({
      where: { id: targetImageId },
      data: { isCover: true },
    }),
  ])

  return Response.json({ ok: true })
}
