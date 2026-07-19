import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = Promise<{ category?: string; locality?: string; q?: string }>;

// Shop listing filtered by category / locality / keyword.
export default async function ShopsPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, locality, q } = await searchParams;

  const shops = await prisma.shop.findMany({
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
    include: { category: true, locality: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Shops</h1>
      {shops.length === 0 ? (
        <p className="text-gray-500">No shops found.</p>
      ) : (
        <ul className="divide-y rounded border">
          {shops.map((shop) => (
            <li key={shop.id} className="p-4 hover:bg-gray-50">
              <Link href={`/shops/${shop.id}`} className="flex items-center justify-between">
                <span>
                  <span className="font-medium">{shop.name}</span>{" "}
                  {shop.verified && <span className="text-green-600 text-xs">✓ verified</span>}
                  <span className="block text-sm text-gray-500">
                    {shop.category.name} · {shop.locality.name}
                  </span>
                </span>
                {shop.isFeatured && (
                  <span className="text-xs rounded bg-yellow-100 px-2 py-1">Featured</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
