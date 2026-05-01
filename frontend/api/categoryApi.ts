import type { CategoryResponse } from "@/shared/types/category"

export const categoryApi = {
  list: (): Promise<CategoryResponse[]> =>
    fetch("/api/categories").then((r) => r.json()),

  detail: (id: number): Promise<CategoryResponse> =>
    fetch(`/api/categories/${id}`).then((r) => {
      if (!r.ok) throw new Error("Category not found")
      return r.json()
    }),
}
