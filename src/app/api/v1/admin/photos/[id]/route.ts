import { prisma } from "@/lib/db";
import { ok, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";
import { deleteShopPhotoByUrl } from "@/lib/storage";

// DELETE /api/v1/admin/photos/{id} — remove the ShopPhoto row and its object.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);

    const { id } = await params;
    const photo = await prisma.shopPhoto.findUnique({ where: { id } });
    if (!photo) return error("Photo not found", 404);

    // Remove the object first (best-effort), then the DB row.
    await deleteShopPhotoByUrl(photo.url);
    await prisma.shopPhoto.delete({ where: { id } });

    return ok({ id });
  } catch (e) {
    return handleError(e);
  }
}
