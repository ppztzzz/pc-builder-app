import { fetchJson, jsonInit } from "./_fetch"
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/shared/types/category"

export const categoryApi = {
  list: () => fetchJson<CategoryResponse[]>("/api/categories"),

  detail: (id: number) => fetchJson<CategoryResponse>(`/api/categories/${id}`),

  create: (data: CreateCategoryRequest) =>
    fetchJson<CategoryResponse>("/api/categories", jsonInit("POST", data)),

  update: (id: number, data: UpdateCategoryRequest) =>
    fetchJson<CategoryResponse>(`/api/categories/${id}`, jsonInit("PUT", data)),

  delete: (id: number) =>
    fetch(`/api/categories/${id}`, { method: "DELETE" }).then(() => undefined),
}
