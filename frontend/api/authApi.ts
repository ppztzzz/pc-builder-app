import { fetchJson, jsonInit } from "./_fetch"
import type { LoginRequest, SessionResponse } from "@/shared/types/auth"

export const authApi = {
  login: (data: LoginRequest) =>
    fetchJson<{ ok: boolean; username: string }>(
      "/api/auth/login",
      jsonInit("POST", data)
    ),

  logout: () =>
    fetch("/api/auth/logout", { method: "POST" }).then(() => undefined),

  session: () => fetchJson<SessionResponse>("/api/auth/session"),
}
