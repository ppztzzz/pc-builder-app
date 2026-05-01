"use client"

import { useEffect, useState } from "react"
import { authApi } from "@/frontend/api/authApi"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    authApi.session().then((s) => {
      setIsAuthenticated(s.isAuthenticated)
      setUsername(s.username)
    })
  }, [])

  return { isAuthenticated, username }
}
