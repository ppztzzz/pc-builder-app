import { articleService } from "@/backend/services/articleService"
import { requireAdmin } from "@/backend/session"
import { uploadService } from "@/backend/services/uploadService"
import { prisma } from "@/backend/prisma/client"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const article = await articleService.detail(Number(id))
  if (!article) return new Response("Not found", { status: 404 })
  return Response.json(article)
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id } = await params
  const body = await req.json()
  const article = await articleService.update(Number(id), body)
  return Response.json(article)
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id } = await params
  const articleId = Number(id)

  // Delete image files from disk first
  const images = await prisma.articleImage.findMany({
    where: { articleId },
  })
  await Promise.all(images.map((img) => uploadService.deleteImage(img.image)))

  await articleService.delete(articleId)
  return Response.json({ ok: true })
}
