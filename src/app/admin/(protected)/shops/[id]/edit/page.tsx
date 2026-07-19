import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ShopForm from "@/components/admin/ShopForm";
import PhotoManager from "@/components/admin/PhotoManager";

export const dynamic = "force-dynamic";

export default async function EditShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [shop, categories, localities] = await Promise.all([
    prisma.shop.findUnique({
      where: { id },
      include: { photos: { orderBy: { sort: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.locality.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!shop) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/shops">Shops</Link>
        <span>/</span>
        <span>{shop.name}</span>
      </div>
      <h1 className="text-2xl font-bold">Edit shop</h1>
      <ShopForm
        categories={categories}
        localities={localities}
        shop={{
          id: shop.id,
          name: shop.name,
          categoryId: shop.categoryId,
          localityId: shop.localityId,
          address: shop.address,
          lat: shop.lat,
          lng: shop.lng,
          phone: shop.phone,
          whatsapp: shop.whatsapp,
          hours: shop.hours,
          description: shop.description,
          verified: shop.verified,
          isFeatured: shop.isFeatured,
        }}
      />

      <hr className="my-2" />
      <PhotoManager
        shopId={shop.id}
        photos={shop.photos.map((p) => ({ id: p.id, url: p.url }))}
      />
    </div>
  );
}
