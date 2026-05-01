import { requireAdmin } from "@/backend/session"
import { prisma } from "@/backend/prisma/client"

type Ctx = { params: Promise<{ id: string }> }

// Add new images to an existing article
export async function POST(req: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id } = await params
  const articleId = Number(id)
  const { filenames } = (await req.json()) as { filenames: string[] }

  const created = await Promise.all(
    filenames.map((image) =>
      prisma.articleImage.create({
        data: { articleId, image, isCover: false },
      })
    )
  )
  return Response.json(created)
}
