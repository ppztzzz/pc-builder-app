import { prisma } from "../prisma/client"
import type {
  ComponentType,
  CreateComponentRequest,
  UpdateComponentRequest,
} from "@/shared/types/component"

export const componentService = {
  list: () =>
    prisma.component.findMany({
      orderBy: [{ type: "asc" }, { price: "asc" }],
    }),

  byType: (type: ComponentType) =>
    prisma.component.findMany({
      where: { type },
      orderBy: { price: "asc" },
    }),

  detail: (id: number) =>
    prisma.component.findUnique({ where: { id } }),

  create: (dto: CreateComponentRequest) =>
    prisma.component.create({ data: dto }),

  update: (id: number, dto: UpdateComponentRequest) =>
    prisma.component.update({ where: { id }, data: dto }),

  delete: (id: number) => prisma.component.delete({ where: { id } }),
}
