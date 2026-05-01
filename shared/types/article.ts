export type ArticleImageResponse = {
  id: number
  image: string
  isCover: boolean
}

export type ArticleType = "ARTICLE" | "NEWS"

export type ArticleResponse = {
  id: number
  title: string
  content: string
  excerpt: string | null
  type: ArticleType
  isFeatured: boolean
  categoryId: number
  createdAt: string
  images: ArticleImageResponse[]
  category?: { id: number; name: string; icon: string }
}

export type CreateArticleRequest = {
  title: string
  content: string
  excerpt?: string
  type: ArticleType
  isFeatured: boolean
  categoryId: number
  imageFilenames: string[]
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>
