import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export type SessionData = {
  adminId?: number
  username?: string
}

const sessionOptions = {
  password:
    process.env.SESSION_SECRET ??
    "dev-only-fallback-secret-must-be-at-least-32-characters",
  cookieName: "admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session.adminId) {
    throw new Response("Unauthorized", { status: 401 })
  }
  return session
}
