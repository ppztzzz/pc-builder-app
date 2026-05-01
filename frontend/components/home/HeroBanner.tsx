"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Gamepad2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import type { ArticleResponse } from "@/shared/types/article"

type Props = {
  featured?: ArticleResponse[]
}

export function HeroBanner({ featured = [] }: Props) {
  if (featured.length === 0) return <StaticHero />
  return <FeaturedCarousel articles={featured} />
}

// Default CTA shown when no article is marked as featured
function StaticHero() {
  return (
    <section className="border-b-2 border-foreground bg-foreground text-background">
      <Link
        href="/simulator"
        className="block group mx-auto max-w-6xl px-4 py-12 sm:py-16 hover:bg-primary transition-colors"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-background/60 group-hover:text-background/90 mb-4 font-bold flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" />
          Hands-on Lab
        </p>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] mb-6 max-w-4xl">
          อยากรู้ว่าประกอบเครื่องนี้ได้ไหม?
          <br />
          <span className="opacity-50 group-hover:opacity-80 transition">
            ลองประกอบเลย
          </span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl text-background/80 leading-relaxed">
          ลากชิ้นส่วนเข้าเคส ระบบตรวจ compatibility อัตโนมัติ
          คำนวณ FPS ของเกม และแชร์ build ผ่าน QR ได้
        </p>
        <p className="text-sm font-bold uppercase tracking-widest mt-8 inline-flex items-center gap-2">
          เริ่มประกอบ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </p>
      </Link>
    </section>
  )
}

function FeaturedCarousel({ articles }: { articles: ArticleResponse[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ])
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()
  const scrollTo = (i: number) => emblaApi?.scrollTo(i)

  return (
    <section className="relative border-b-2 border-foreground bg-foreground text-background">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {articles.map((a) => (
            <div key={a.id} className="flex-[0_0_100%] min-w-0">
              <Slide article={a} />
            </div>
          ))}
        </div>
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-background/10 hover:bg-background hover:text-foreground border border-background/30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-background/10 hover:bg-background hover:text-foreground border border-background/30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {articles.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 transition-all ${
                  i === selected ? "bg-primary w-8" : "bg-background/40 w-3 hover:bg-background/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function Slide({ article }: { article: ArticleResponse }) {
  const cover = article.images.find((i) => i.isCover) ?? article.images[0]
  return (
    <Link
      href={`/article/${article.id}`}
      className="block group mx-auto max-w-6xl px-4 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-bold">
          {article.type === "NEWS" ? "ข่าวเด่น" : "บทความเด่น"}
        </p>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-base sm:text-lg text-background/80 leading-relaxed line-clamp-3 mb-8">
            {article.excerpt}
          </p>
        )}
        <p className="text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2 group-hover:text-primary transition-colors">
          อ่านบทความ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </p>
      </div>

      {cover && (
        <div className="aspect-[4/3] border-2 border-background/20 overflow-hidden">
          <img
            src={`/uploads/${cover.image}`}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </Link>
  )
}
