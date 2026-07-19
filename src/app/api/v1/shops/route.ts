import { prisma } from "@/lib/db";
import { ok, handleError } from "@/lib/api";

// GET /api/v1/shops?category=&locality=&q=&page=&pageSize=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const locality = searchParams.get("locality") ?? undefined;
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));

    const where = {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(locality ? { localityId: locality } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: { category: true, locality: true, photos: { orderBy: { sort: "asc" }, take: 1 } },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.shop.count({ where }),
    ]);

    return ok({ shops, page, pageSize, total });
  } catch (e) {
    return handleError(e);
  }
}
