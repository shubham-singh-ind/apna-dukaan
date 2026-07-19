import { z } from "zod";
import { prisma } from "@/lib/db";
import { created, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  shopId: z.string().min(1),
  text: z.string().min(1),
  imageUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
});

// POST /api/v1/admin/updates — create a stock update for a shop.
export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const body = updateSchema.parse(await req.json());
    const update = await prisma.stockUpdate.create({
      data: {
        shopId: body.shopId,
        text: body.text,
        imageUrl: body.imageUrl,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      },
    });
    return created(update);
  } catch (e) {
    return handleError(e);
  }
}
