import bcrypt from "bcryptjs"
import { prisma } from "../prisma/client"

export const authService = {
  verifyCredentials: async (username: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) return null

    const ok = await bcrypt.compare(password, admin.password)
    if (!ok) return null

    return { id: admin.id, username: admin.username }
  },
}
