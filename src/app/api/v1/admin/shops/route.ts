import { z } from "zod";
import { prisma } from "@/lib/db";
import { created, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";

const shopSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  localityId: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  hours: z.string().optional(),
  description: z.string().optional(),
  verified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// POST /api/v1/admin/shops
export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const data = shopSchema.parse(await req.json());
    const shop = await prisma.shop.create({ data });
    return created(shop);
  } catch (e) {
    return handleError(e);
  }
}
