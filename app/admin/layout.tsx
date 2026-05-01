"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/frontend/hooks/useAuth"
import { AdminNav } from "@/frontend/components/admin/AdminNav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isAuthenticated === false && !isLoginPage) {
      router.push("/admin/login")
    }
    if (isAuthenticated === true && isLoginPage) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, isLoginPage, router])

  // Login page — render without nav guard
  if (isLoginPage) {
    return <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
  }

  // Loading
  if (isAuthenticated === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted uppercase tracking-widest text-xs">
        Loading...
      </div>
    )
  }

  // Not authenticated — redirect in progress, render nothing
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <AdminNav />
      {children}
    </div>
  )
}
