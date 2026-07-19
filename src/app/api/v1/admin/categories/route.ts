import { z } from "zod";
import { prisma } from "@/lib/db";
import { created, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
});

// POST /api/v1/admin/categories
export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const { name, slug } = bodySchema.parse(await req.json());
    const finalSlug = slugify(slug || name);
    if (!finalSlug) return error("Could not derive a slug from the name", 422);

    const category = await prisma.category.create({ data: { name, slug: finalSlug } });
    return created(category);
  } catch (e) {
    return handleError(e);
  }
}
