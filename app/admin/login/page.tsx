"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { authApi } from "@/frontend/api/authApi"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await authApi.login({ username, password })
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <div className="border-2 border-foreground bg-card p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-2">
          Admin Access
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">
          เข้าสู่ระบบ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-3 py-2 focus:border-primary focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-primary border-2 border-primary px-3 py-2 bg-primary/5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-primary transition disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-muted mt-6 text-center uppercase tracking-widest">
          Default: admin / admin123
        </p>
      </div>
    </div>
  )
}
