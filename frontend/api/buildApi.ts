import type {
  CreateBuildRequest,
  HydratedBuild,
} from "@/shared/types/build"

async function handleJson<T>(r: Response): Promise<T> {
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
  return json
}

export const buildApi = {
  create: (data: CreateBuildRequest): Promise<{ id: string }> =>
    fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  detail: (id: string): Promise<HydratedBuild> =>
    fetch(`/api/builds/${id}`).then(handleJson),
}
