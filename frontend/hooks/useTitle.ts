"use client"

import { useEffect } from "react"

const SUFFIX = "PC Builder"

// Sets document.title to "{title} · PC Builder" while the component is mounted.
// Pass an empty string to skip (e.g. while data is still loading).
export function useTitle(title: string) {
  useEffect(() => {
    if (!title) return
    document.title = `${title} · ${SUFFIX}`
  }, [title])
}
