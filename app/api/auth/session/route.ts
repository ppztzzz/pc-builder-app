import { getSession } from "@/backend/session"

export async function GET() {
  const session = await getSession()
  return Response.json({
    isAuthenticated: !!session.adminId,
    username: session.username ?? null,
  })
}
