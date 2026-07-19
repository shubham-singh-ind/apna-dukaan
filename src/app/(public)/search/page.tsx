import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = Promise<{ q?: string }>;

// Basic keyword search (see PROJECT.md §6 Public — basic keyword search).
export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = q?.trim();

  const results = query
    ? await prisma.shop.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: { category: true, locality: true },
        take: 50,
      })
    : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>
      <form method="get" className="flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search shops…"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">Search</button>
      </form>

      {query && (
        <p className="text-sm text-gray-500">
          {results.length} result(s) for &ldquo;{query}&rdquo;
        </p>
      )}

      <ul className="divide-y">
        {results.map((shop) => (
          <li key={shop.id} className="py-3">
            <Link href={`/shops/${shop.id}`} className="font-medium">
              {shop.name}
            </Link>
            <span className="block text-sm text-gray-500">
              {shop.category.name} · {shop.locality.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
