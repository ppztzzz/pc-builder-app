import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/shared/types/category"

async function handleJson<T>(r: Response): Promise<T> {
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
  return json
}

export const categoryApi = {
  list: (): Promise<CategoryResponse[]> =>
    fetch("/api/categories").then(handleJson),

  detail: (id: number): Promise<CategoryResponse> =>
    fetch(`/api/categories/${id}`).then(handleJson),

  create: (data: CreateCategoryRequest): Promise<CategoryResponse> =>
    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  update: (id: number, data: UpdateCategoryRequest): Promise<CategoryResponse> =>
    fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  delete: (id: number): Promise<void> =>
    fetch(`/api/categories/${id}`, { method: "DELETE" }).then(() => undefined),
}
