import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  localityId: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  verified: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/v1/admin/shops/{id}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const { id } = await params;
    const data = updateSchema.parse(await req.json());
    const shop = await prisma.shop.update({ where: { id }, data });
    return ok(shop);
  } catch (e) {
    return handleError(e);
  }
}

// DELETE /api/v1/admin/shops/{id}
// Soft delete — marks the shop inactive (hidden from the public site) instead
// of removing it, so it can be restored and its photos/updates are preserved.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const { id } = await params;
    await prisma.shop.update({ where: { id }, data: { isActive: false } });
    return ok({ id });
  } catch (e) {
    return handleError(e);
  }
}
