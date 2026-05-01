import { nanoid } from "nanoid"
import { prisma } from "../prisma/client"
import type { CreateBuildRequest } from "@/shared/types/build"

export const buildService = {
  create: async (dto: CreateBuildRequest) => {
    const id = nanoid(8)
    return prisma.build.create({
      data: {
        id,
        components: JSON.stringify(dto.components),
        totalPrice: dto.totalPrice,
        fpsResult: dto.fpsResult ? JSON.stringify(dto.fpsResult) : null,
      },
    })
  },

  detail: (id: string) => prisma.build.findUnique({ where: { id } }),

  list: (limit = 12) =>
    prisma.build.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
}
