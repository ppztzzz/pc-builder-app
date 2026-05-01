import { fetchJson, jsonInit } from "./_fetch"
import type {
  ComponentResponse,
  ComponentType,
  CreateComponentRequest,
  UpdateComponentRequest,
} from "@/shared/types/component"

export const componentApi = {
  list: () => fetchJson<ComponentResponse[]>("/api/components"),

  byType: (type: ComponentType) =>
    fetchJson<ComponentResponse[]>(`/api/components?type=${type}`),

  detail: (id: number) =>
    fetchJson<ComponentResponse>(`/api/components/${id}`),

  create: (data: CreateComponentRequest) =>
    fetchJson<ComponentResponse>("/api/components", jsonInit("POST", data)),

  update: (id: number, data: UpdateComponentRequest) =>
    fetchJson<ComponentResponse>(`/api/components/${id}`, jsonInit("PUT", data)),

  delete: (id: number) =>
    fetch(`/api/components/${id}`, { method: "DELETE" }).then(() => undefined),
}
