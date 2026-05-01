export type CategoryResponse = {
  id: number
  name: string
  icon: string
}

export type CreateCategoryRequest = {
  name: string
  icon: string
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>
