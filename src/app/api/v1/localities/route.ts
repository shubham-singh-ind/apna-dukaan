import { prisma } from "@/lib/db";
import { ok, handleError } from "@/lib/api";

// GET /api/v1/localities
export async function GET() {
  try {
    const localities = await prisma.locality.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return ok(localities);
  } catch (e) {
    return handleError(e);
  }
}
