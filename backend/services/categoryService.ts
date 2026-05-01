import { prisma } from "../prisma/client"
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/shared/types/category"

export const categoryService = {
  list: () =>
    prisma.category.findMany({
      orderBy: { id: "asc" },
    }),

  detail: (id: number) =>
    prisma.category.findUnique({ where: { id } }),

  create: (dto: CreateCategoryRequest) =>
    prisma.category.create({ data: dto }),

  update: (id: number, dto: UpdateCategoryRequest) =>
    prisma.category.update({ where: { id }, data: dto }),

  delete: (id: number) => prisma.category.delete({ where: { id } }),
}
