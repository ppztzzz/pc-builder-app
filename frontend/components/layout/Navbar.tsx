"use client"

import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-foreground bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-extrabold tracking-tight group-hover:text-primary transition">
            PC<span className="text-primary">/</span>BUILDER
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="hidden sm:block uppercase tracking-wider hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/#categories"
            className="hidden sm:block uppercase tracking-wider hover:text-primary transition"
          >
            Categories
          </Link>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-2 bg-primary text-primary-fg px-4 py-2 font-bold uppercase tracking-wider text-xs hover:opacity-90 transition"
          >
            <Gamepad2 className="w-4 h-4" />
            Build Now
          </Link>
        </div>
      </nav>
    </header>
  )
}
