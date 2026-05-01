import { categoryService } from "@/backend/services/categoryService"
import { requireAdmin } from "@/backend/session"

export async function GET() {
  return Response.json(await categoryService.list())
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const body = await req.json()
  const cat = await categoryService.create(body)
  return Response.json(cat)
}
