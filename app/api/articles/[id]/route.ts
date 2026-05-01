import { articleService } from "@/backend/services/articleService"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const article = await articleService.detail(Number(id))
  if (!article) return new Response("Not found", { status: 404 })
  return Response.json(article)
}
