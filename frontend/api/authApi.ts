import type { LoginRequest, SessionResponse } from "@/shared/types/auth"

export const authApi = {
  login: (data: LoginRequest): Promise<{ ok: boolean; username: string }> =>
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const json = await r.json()
      if (!r.ok) throw new Error(json.error ?? "Login failed")
      return json
    }),

  logout: (): Promise<void> =>
    fetch("/api/auth/logout", { method: "POST" }).then(() => undefined),

  session: (): Promise<SessionResponse> =>
    fetch("/api/auth/session").then((r) => r.json()),
}
