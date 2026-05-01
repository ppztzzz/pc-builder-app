import { categoryService } from "@/backend/services/categoryService"
import { requireAdmin } from "@/backend/session"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const cat = await categoryService.detail(Number(id))
  if (!cat) return new Response("Not found", { status: 404 })
  return Response.json(cat)
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
  const cat = await categoryService.update(Number(id), body)
  return Response.json(cat)
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id } = await params
  await categoryService.delete(Number(id))
  return Response.json({ ok: true })
}
