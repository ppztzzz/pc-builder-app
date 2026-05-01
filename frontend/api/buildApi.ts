import { fetchJson, jsonInit } from "./_fetch"
import type {
  CreateBuildRequest,
  HydratedBuild,
} from "@/shared/types/build"

export const buildApi = {
  create: (data: CreateBuildRequest) =>
    fetchJson<{ id: string }>("/api/builds", jsonInit("POST", data)),

  detail: (id: string) => fetchJson<HydratedBuild>(`/api/builds/${id}`),
}
