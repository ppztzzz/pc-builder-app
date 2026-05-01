import { fetchJson, jsonInit } from "./_fetch"
import type {
  BuildListItem,
  CreateBuildRequest,
  HydratedBuild,
} from "@/shared/types/build"

export const buildApi = {
  create: (data: CreateBuildRequest) =>
    fetchJson<{ id: string }>("/api/builds", jsonInit("POST", data)),

  detail: (id: string) => fetchJson<HydratedBuild>(`/api/builds/${id}`),

  list: (limit = 12) =>
    fetchJson<BuildListItem[]>(`/api/builds?limit=${limit}`),
}
