"use client"

import { useEffect, useState } from "react"
import { useTitle } from "@/frontend/hooks/useTitle"
import { HeroBanner } from "@/frontend/components/home/HeroBanner"
import { Article } from "@/frontend/components/home/Article"
import { News } from "@/frontend/components/home/News"
import { Components } from "@/frontend/components/home/Components"
import { Builds } from "@/frontend/components/home/Builds"
import { articleApi } from "@/frontend/api/articleApi"
import { componentApi } from "@/frontend/api/componentApi"
import { buildApi } from "@/frontend/api/buildApi"
import type { ArticleResponse } from "@/shared/types/article"
import type { ComponentResponse } from "@/shared/types/component"
import type { BuildListItem } from "@/shared/types/build"

export default function HomePage() {
  useTitle("หน้าแรก")
  const [featured, setFeatured] = useState<ArticleResponse[]>([])
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [news, setNews] = useState<ArticleResponse[]>([])
  const [components, setComponents] = useState<ComponentResponse[]>([])
  const [builds, setBuilds] = useState<BuildListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      articleApi.featured(),
      articleApi.list("ARTICLE"),
      articleApi.list("NEWS"),
      componentApi.list(),
      buildApi.list(6),
    ])
      .then(([feat, arts, newsList, comps, buildsList]) => {
        setFeatured(feat)
        setArticles(arts)
        setNews(newsList)
        setComponents(comps)
        setBuilds(buildsList)
      })
      .catch((e) => {
        console.error("Home page load failed:", e)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  return (
    <>
      <HeroBanner featured={featured} />
      <Article articles={articles} />
      <News articles={news} />
      <Components components={components} />
      <Builds builds={builds} />
    </>
  )
}
