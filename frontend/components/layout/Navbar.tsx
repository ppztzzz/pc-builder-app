"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, FileText } from "lucide-react"

const links = [
  { href: "/articles", label: "Article", icon: FileText },
  { href: "/simulator", label: "Builder", icon: Gamepad2 },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 border-b-2 border-foreground bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-extrabold tracking-tight group-hover:text-primary transition">
            PC<span className="text-primary">/</span>BUILDER
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => {
            const Icon = l.icon
            const active = pathname === l.href || pathname.startsWith(l.href + "/")
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest font-bold transition ${
                  active
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground hover:text-background"
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
