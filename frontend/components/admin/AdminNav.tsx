"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, FileText, FolderTree, LayoutDashboard, Cpu } from "lucide-react"
import { authApi } from "@/frontend/api/authApi"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "บทความ", icon: FileText },
  { href: "/admin/categories", label: "หมวดหมู่", icon: FolderTree },
  { href: "/admin/components", label: "ชิ้นส่วน", icon: Cpu },
]

export function AdminNav() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await authApi.logout()
    // full reload so session cookie clear is picked up by useAuth
    window.location.href = "/"
  }

  return (
    <nav className="border-2 border-foreground bg-card mb-8">
      <div className="flex items-center justify-between flex-wrap gap-2 p-2">
        <div className="flex gap-1 flex-wrap">
          {links.map((l) => {
            const Icon = l.icon
            const active = pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest font-bold transition ${
                  active
                    ? "bg-primary text-primary-fg"
                    : "hover:bg-foreground hover:text-background"
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            )
          })}
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  )
}
