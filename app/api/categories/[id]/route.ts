import { categoryService } from "@/backend/services/categoryService"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const category = await categoryService.detail(Number(id))
  if (!category) return new Response("Not found", { status: 404 })
  return Response.json(category)
}
