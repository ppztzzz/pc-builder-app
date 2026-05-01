import { buildService } from "@/backend/services/buildService"
import type { CreateBuildRequest } from "@/shared/types/build"

export async function POST(req: Request) {
  const body = (await req.json()) as CreateBuildRequest
  const build = await buildService.create(body)
  return Response.json({ id: build.id })
}
