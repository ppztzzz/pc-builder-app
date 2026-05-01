import { buildService } from "@/backend/services/buildService"
import { componentService } from "@/backend/services/componentService"
import type { BuildSlotEntry, HydratedBuild } from "@/shared/types/build"
import type { ComponentResponse, ComponentType } from "@/shared/types/component"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const build = await buildService.detail(id)
  if (!build) return new Response("Not found", { status: 404 })

  const slots = JSON.parse(build.components) as BuildSlotEntry[]
  const hydrated: Partial<Record<ComponentType, ComponentResponse>> = {}

  for (const entry of slots) {
    const c = await componentService.detail(entry.componentId)
    if (c) hydrated[entry.slot] = c as ComponentResponse
  }

  const response: HydratedBuild = {
    id: build.id,
    components: slots,
    totalPrice: build.totalPrice ?? 0,
    fpsResult: build.fpsResult ? JSON.parse(build.fpsResult) : null,
    createdAt: build.createdAt.toISOString(),
    hydrated,
  }

  return Response.json(response)
}
