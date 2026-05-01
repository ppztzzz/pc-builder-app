import { fetchJson, jsonInit } from "./_fetch"
import type {
  ArticleResponse,
  ArticleType,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@/shared/types/article"

export const articleApi = {
  list: (type?: ArticleType) =>
    fetchJson<ArticleResponse[]>(
      type ? `/api/articles?type=${type}` : "/api/articles"
    ),

  detail: (id: number) => fetchJson<ArticleResponse>(`/api/articles/${id}`),

  featured: () =>
    fetchJson<ArticleResponse[]>("/api/articles?featured=true"),

  byCategory: (categoryId: number) =>
    fetchJson<ArticleResponse[]>(`/api/articles?categoryId=${categoryId}`),

  create: (data: CreateArticleRequest) =>
    fetchJson<ArticleResponse>("/api/articles", jsonInit("POST", data)),

  update: (id: number, data: UpdateArticleRequest) =>
    fetchJson<ArticleResponse>(`/api/articles/${id}`, jsonInit("PUT", data)),

  delete: (id: number) =>
    fetch(`/api/articles/${id}`, { method: "DELETE" }).then(() => undefined),

  addImages: (articleId: number, filenames: string[]) =>
    fetchJson(`/api/articles/${articleId}/images`, jsonInit("POST", { filenames })),

  deleteImage: (articleId: number, imageId: number) =>
    fetch(`/api/articles/${articleId}/images/${imageId}`, {
      method: "DELETE",
    }).then(() => undefined),

  setCover: (articleId: number, imageId: number) =>
    fetch(`/api/articles/${articleId}/images/${imageId}`, {
      method: "PATCH",
    }).then(() => undefined),
}
