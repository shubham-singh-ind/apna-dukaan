import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";

// GET /api/v1/shops/{id} — shop detail with photos + non-expired updates.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const shop = await prisma.shop.findFirst({
      where: { id, isActive: true },
      include: {
        category: true,
        locality: true,
        photos: { orderBy: { sort: "asc" } },
        updates: {
          where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!shop) return error("Shop not found", 404);
    return ok(shop);
  } catch (e) {
    return handleError(e);
  }
}
