import Link from "next/link";
import { prisma } from "@/lib/db";
import ShopCard, { type ShopCardData } from "@/components/ShopCard";
import { StoreIcon, ChevronRightIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ category?: string; locality?: string; q?: string }>;

export default async function ShopsPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, locality, q } = await searchParams;

  const [shops, categoryRow, localityRow] = await Promise.all([
    prisma.shop.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(locality ? { localityId: locality } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        category: { select: { name: true } },
        locality: { select: { name: true } },
        photos: { orderBy: { sort: "asc" }, take: 1, select: { url: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
    category ? prisma.category.findUnique({ where: { slug: category } }) : null,
    locality ? prisma.locality.findUnique({ where: { id: locality } }) : null,
  ]);

  const heading = categoryRow?.name ?? localityRow?.name ?? "All shops";

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="text-slate-900">{heading}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
        <p className="text-sm text-slate-500">
          {shops.length} {shops.length === 1 ? "shop" : "shops"}
          {localityRow && categoryRow ? ` in ${localityRow.name}` : ""}
        </p>
      </div>

      {shops.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <StoreIcon className="h-10 w-10 text-slate-300" />
          <p className="text-slate-500">No shops found here yet.</p>
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            Back to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(shops as ShopCardData[]).map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
