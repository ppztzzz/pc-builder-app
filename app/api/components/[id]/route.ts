import { componentService } from "@/backend/services/componentService"
import { requireAdmin } from "@/backend/session"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const c = await componentService.detail(Number(id))
  if (!c) return new Response("Not found", { status: 404 })
  return Response.json(c)
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
  return Response.json(await componentService.update(Number(id), body))
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const { id } = await params
  await componentService.delete(Number(id))
  return Response.json({ ok: true })
}
