import { authService } from "@/backend/services/authService"
import { getSession } from "@/backend/session"
import type { LoginRequest } from "@/shared/types/auth"

export async function POST(req: Request) {
  const body = (await req.json()) as LoginRequest

  const admin = await authService.verifyCredentials(body.username, body.password)
  if (!admin) {
    return Response.json(
      { error: "Username หรือ Password ไม่ถูกต้อง" },
      { status: 401 }
    )
  }

  const session = await getSession()
  session.adminId = admin.id
  session.username = admin.username
  await session.save()

  return Response.json({ ok: true, username: admin.username })
}
