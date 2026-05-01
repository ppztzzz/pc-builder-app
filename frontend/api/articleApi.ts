import type { ArticleResponse } from "@/shared/types/article"

export const articleApi = {
  list: (): Promise<ArticleResponse[]> =>
    fetch("/api/articles").then((r) => r.json()),

  detail: (id: number): Promise<ArticleResponse> =>
    fetch(`/api/articles/${id}`).then((r) => {
      if (!r.ok) throw new Error("Article not found")
      return r.json()
    }),

  featured: (): Promise<ArticleResponse | null> =>
    fetch("/api/articles?featured=true").then((r) => r.json()),

  byCategory: (categoryId: number): Promise<ArticleResponse[]> =>
    fetch(`/api/articles?categoryId=${categoryId}`).then((r) => r.json()),
}
