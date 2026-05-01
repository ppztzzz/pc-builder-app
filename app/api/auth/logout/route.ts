import { getSession } from "@/backend/session"

export async function POST() {
  const session = await getSession()
  session.destroy()
  return Response.json({ ok: true })
}
