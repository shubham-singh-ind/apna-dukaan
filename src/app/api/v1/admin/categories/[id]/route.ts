import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

// PUT /api/v1/admin/categories/{id} — edit and/or toggle active.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const { id } = await params;
    const body = bodySchema.parse(await req.json());

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.slug !== undefined ? { slug: slugify(body.slug) } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });
    return ok(category);
  } catch (e) {
    return handleError(e);
  }
}
