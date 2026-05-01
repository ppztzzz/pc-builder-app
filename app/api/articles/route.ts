import { articleService } from "@/backend/services/articleService"
import { requireAdmin } from "@/backend/session"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const featured = url.searchParams.get("featured")
  const categoryId = url.searchParams.get("categoryId")

  if (featured === "true") {
    return Response.json(await articleService.featured())
  }
  if (categoryId) {
    return Response.json(await articleService.byCategory(Number(categoryId)))
  }
  return Response.json(await articleService.list())
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const body = await req.json()
  const article = await articleService.create(body)
  return Response.json(article)
}
