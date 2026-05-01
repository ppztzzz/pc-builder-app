import { categoryService } from "@/backend/services/categoryService"

export async function GET() {
  const categories = await categoryService.list()
  return Response.json(categories)
}
