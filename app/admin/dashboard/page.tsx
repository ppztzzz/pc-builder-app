"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FileText, FolderTree, Cpu, ArrowRight } from "lucide-react"
import { articleApi } from "@/frontend/api/articleApi"
import { categoryApi } from "@/frontend/api/categoryApi"
import { componentApi } from "@/frontend/api/componentApi"
import { useAuth } from "@/frontend/hooks/useAuth"

export default function AdminDashboardPage() {
  const { username } = useAuth()
  const [stats, setStats] = useState({ articles: 0, categories: 0, components: 0 })

  useEffect(() => {
    Promise.all([
      articleApi.list(),
      categoryApi.list(),
      componentApi.list(),
    ]).then(([articles, cats, comps]) => {
      setStats({
        articles: articles.length,
        categories: cats.length,
        components: comps.length,
      })
    })
  }, [])

  const cards = [
    {
      href: "/admin/articles",
      label: "บทความ",
      sublabel: "Manage articles",
      count: stats.articles,
      icon: FileText,
    },
    {
      href: "/admin/categories",
      label: "หมวดหมู่",
      sublabel: "Manage categories",
      count: stats.categories,
      icon: FolderTree,
    },
    {
      href: "/admin/components",
      label: "ชิ้นส่วน",
      sublabel: "Simulator catalog",
      count: stats.components,
      icon: Cpu,
    },
  ]

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-2">
        Admin Dashboard
      </p>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">
        จัดการระบบ
      </h1>
      {username && (
        <p className="text-muted mb-8">
          Welcome back,{" "}
          <span className="font-bold text-foreground">{username}</span>
        </p>
      )}

      <div className="border-t-2 border-foreground pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group border-2 border-foreground bg-card p-6 hover:bg-foreground hover:text-background transition"
            >
              <div className="flex items-start justify-between mb-6">
                <Icon className="w-10 h-10" strokeWidth={1.5} />
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs uppercase tracking-widest font-bold mb-1">
                {c.sublabel}
              </p>
              <p className="text-2xl font-extrabold mb-2">{c.label}</p>
              <p className="text-5xl font-extrabold">{c.count}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
