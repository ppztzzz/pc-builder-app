import type {
  ArticleResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@/shared/types/article"

async function handleJson<T>(r: Response): Promise<T> {
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`)
  return json
}

export const articleApi = {
  list: (): Promise<ArticleResponse[]> =>
    fetch("/api/articles").then(handleJson),

  detail: (id: number): Promise<ArticleResponse> =>
    fetch(`/api/articles/${id}`).then(handleJson),

  featured: (): Promise<ArticleResponse | null> =>
    fetch("/api/articles?featured=true").then((r) => r.json()),

  byCategory: (categoryId: number): Promise<ArticleResponse[]> =>
    fetch(`/api/articles?categoryId=${categoryId}`).then(handleJson),

  create: (data: CreateArticleRequest): Promise<ArticleResponse> =>
    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  update: (id: number, data: UpdateArticleRequest): Promise<ArticleResponse> =>
    fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleJson),

  delete: (id: number): Promise<void> =>
    fetch(`/api/articles/${id}`, { method: "DELETE" }).then(() => undefined),

  addImages: (articleId: number, filenames: string[]) =>
    fetch(`/api/articles/${articleId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filenames }),
    }).then(handleJson),

  deleteImage: (articleId: number, imageId: number): Promise<void> =>
    fetch(`/api/articles/${articleId}/images/${imageId}`, {
      method: "DELETE",
    }).then(() => undefined),

  setCover: (articleId: number, imageId: number): Promise<void> =>
    fetch(`/api/articles/${articleId}/images/${imageId}`, {
      method: "PATCH",
    }).then(() => undefined),
}
