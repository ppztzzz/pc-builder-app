"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">💻</span>
          <span>PC Builder</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition"
          >
            หน้าแรก
          </Link>
          <Link
            href="/simulator"
            className="rounded-full bg-primary px-4 py-2 text-white font-medium hover:opacity-90 transition"
          >
            🎮 ประกอบคอม
          </Link>
        </div>
      </nav>
    </header>
  )
}
