import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";
import { createSessionToken, setAdminCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/v1/admin/login
export async function POST(req: Request) {
  try {
    const { email, password } = bodySchema.parse(await req.json());
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return error("Invalid email or password", 401);
    }

    const token = await createSessionToken({ sub: admin.id, email: admin.email });
    await setAdminCookie(token);
    return ok({ id: admin.id, name: admin.name, email: admin.email });
  } catch (e) {
    return handleError(e);
  }
}
