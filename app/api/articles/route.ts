import { articleService } from "@/backend/services/articleService"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const featured = url.searchParams.get("featured")
  const categoryId = url.searchParams.get("categoryId")

  if (featured === "true") {
    const article = await articleService.featured()
    return Response.json(article)
  }

  if (categoryId) {
    const articles = await articleService.byCategory(Number(categoryId))
    return Response.json(articles)
  }

  const articles = await articleService.list()
  return Response.json(articles)
}
