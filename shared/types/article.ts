export type ArticleImageResponse = {
  id: number
  image: string
  isCover: boolean
}

export type ArticleResponse = {
  id: number
  title: string
  content: string
  excerpt: string | null
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
  isFeatured: boolean
  categoryId: number
  imageFilenames: string[]
}

export type UpdateArticleRequest = Partial<CreateArticleRequest>
