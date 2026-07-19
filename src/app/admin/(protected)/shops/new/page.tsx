import Link from "next/link";
import { prisma } from "@/lib/db";
import ShopForm from "@/components/admin/ShopForm";

export const dynamic = "force-dynamic";

export default async function NewShopPage() {
  const [categories, localities] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.locality.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/shops">Shops</Link>
        <span>/</span>
        <span>New</span>
      </div>
      <h1 className="text-2xl font-bold">Add shop</h1>
      {categories.length === 0 || localities.length === 0 ? (
        <p className="rounded bg-yellow-50 p-3 text-sm text-yellow-800">
          You need at least one category and one locality before adding a shop.
        </p>
      ) : (
        <ShopForm categories={categories} localities={localities} />
      )}
    </div>
  );
}
