import { componentService } from "@/backend/services/componentService"
import { requireAdmin } from "@/backend/session"
import type { ComponentType } from "@/shared/types/component"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const type = url.searchParams.get("type") as ComponentType | null

  if (type) {
    return Response.json(await componentService.byType(type))
  }
  return Response.json(await componentService.list())
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
  } catch (e) {
    if (e instanceof Response) return e
    throw e
  }

  const body = await req.json()
  return Response.json(await componentService.create(body))
}
