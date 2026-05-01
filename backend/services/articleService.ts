import { prisma } from "../prisma/client"
import type {
  ArticleType,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@/shared/types/article"

export const articleService = {
  list: (type?: ArticleType) =>
    prisma.article.findMany({
      where: type ? { type } : undefined,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    }),

  featured: () =>
    prisma.article.findFirst({
      where: { isFeatured: true },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    }),

  detail: (id: number) =>
    prisma.article.findUnique({
      where: { id },
      include: { images: true, category: true },
    }),

  byCategory: (categoryId: number) =>
    prisma.article.findMany({
      where: { categoryId },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    }),

  create: (dto: CreateArticleRequest) =>
    prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        excerpt: dto.excerpt,
        type: dto.type,
        isFeatured: dto.isFeatured,
        categoryId: dto.categoryId,
        images: {
          create: dto.imageFilenames.map((image, i) => ({
            image,
            isCover: i === 0,
          })),
        },
      },
      include: { images: true },
    }),

  update: (id: number, dto: UpdateArticleRequest) => {
    const { imageFilenames: _ignored, ...rest } = dto
    return prisma.article.update({
      where: { id },
      data: rest,
      include: { images: true },
    })
  },

  delete: (id: number) => prisma.article.delete({ where: { id } }),
}
