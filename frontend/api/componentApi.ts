import type {
  ComponentResponse,
  ComponentType,
  CreateComponentRequest,
  UpdateComponentRequest,
} from "@/shared/types/component"

async function handleJson<T>(r: Response): Promise<T> {
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
  return json
}

export const componentApi = {
  list: (): Promise<ComponentResponse[]> =>
    fetch("/api/components").then(handleJson),

  byType: (type: ComponentType): Promise<ComponentResponse[]> =>
    fetch(`/api/components?type=${type}`).then(handleJson),

  detail: (id: number): Promise<ComponentResponse> =>
    fetch(`/api/components/${id}`).then(handleJson),

  create: (data: CreateComponentRequest) =>
    fetch("/api/components", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  update: (id: number, data: UpdateComponentRequest) =>
    fetch(`/api/components/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  delete: (id: number): Promise<void> =>
    fetch(`/api/components/${id}`, { method: "DELETE" }).then(() => undefined),
}
