import { prisma } from "@/lib/db";
import { ok, handleError } from "@/lib/api";

// GET /api/v1/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return ok(categories);
  } catch (e) {
    return handleError(e);
  }
}
