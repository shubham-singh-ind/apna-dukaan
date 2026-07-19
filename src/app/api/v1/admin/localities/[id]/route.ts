import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  pincode: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/v1/admin/localities/{id} — edit and/or toggle active.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const { id } = await params;
    const data = bodySchema.parse(await req.json());
    const locality = await prisma.locality.update({ where: { id }, data });
    return ok(locality);
  } catch (e) {
    return handleError(e);
  }
}
