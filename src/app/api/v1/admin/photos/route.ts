import { prisma } from "@/lib/db";
import { created, error, handleError } from "@/lib/api";
import { getAdminSession } from "@/lib/auth";
import { uploadShopPhoto } from "@/lib/storage";

// POST /api/v1/admin/photos  (multipart/form-data: shopId, file)
// Uploads the image to Supabase Storage and saves a ShopPhoto row (URL only).
export async function POST(req: Request) {
  try {
    if (!(await getAdminSession())) return error("Unauthorized", 401);

    const form = await req.formData();
    const shopId = String(form.get("shopId") ?? "");
    const file = form.get("file");

    if (!shopId) return error("shopId is required", 422);
    if (!(file instanceof File)) return error("file is required", 422);

    const shop = await prisma.shop.findUnique({ where: { id: shopId }, select: { id: true } });
    if (!shop) return error("Shop not found", 404);

    const url = await uploadShopPhoto(shopId, file);

    // Append to the end of the shop's photo order.
    const count = await prisma.shopPhoto.count({ where: { shopId } });
    const photo = await prisma.shopPhoto.create({
      data: { shopId, url, sort: count },
    });

    return created(photo);
  } catch (e) {
    return handleError(e);
  }
}
