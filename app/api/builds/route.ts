import { buildService } from "@/backend/services/buildService"
import { componentService } from "@/backend/services/componentService"
import type { BuildListItem, BuildSlotEntry, CreateBuildRequest } from "@/shared/types/build"

export async function POST(req: Request) {
  const body = (await req.json()) as CreateBuildRequest
  const build = await buildService.create(body)
  return Response.json({ id: build.id })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get("limit") ?? 12)
  const builds = await buildService.list(limit)

  const items: BuildListItem[] = await Promise.all(
    builds.map(async (b) => {
      const slots = JSON.parse(b.components) as BuildSlotEntry[]
      const cpuId = slots.find((s) => s.slot === "CPU")?.componentId
      const gpuId = slots.find((s) => s.slot === "GPU")?.componentId
      const [cpu, gpu] = await Promise.all([
        cpuId ? componentService.detail(cpuId) : null,
        gpuId ? componentService.detail(gpuId) : null,
      ])
      return {
        id: b.id,
        totalPrice: b.totalPrice ?? 0,
        createdAt: b.createdAt.toISOString(),
        cpuName: cpu?.name ?? null,
        gpuName: gpu?.name ?? null,
        cpuImage: cpu?.imageUrl ?? null,
        gpuImage: gpu?.imageUrl ?? null,
      }
    })
  )

  return Response.json(items)
}
