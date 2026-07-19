import { z } from "zod";
import { prisma } from "@/lib/db";
import { created, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";

const bodySchema = z.object({
  name: z.string().min(1),
  pincode: z.string().min(1),
  city: z.string().min(1),
});

// POST /api/v1/admin/localities
export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);
    const data = bodySchema.parse(await req.json());
    const locality = await prisma.locality.create({ data });
    return created(locality);
  } catch (e) {
    return handleError(e);
  }
}
