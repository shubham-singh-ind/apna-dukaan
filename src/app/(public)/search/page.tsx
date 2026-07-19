import { prisma } from "@/lib/db";
import ShopCard, { type ShopCardData } from "@/components/ShopCard";
import { SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

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
        include: {
          category: { select: { name: true } },
          locality: { select: { name: true } },
          photos: { orderBy: { sort: "asc" }, take: 1, select: { url: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        take: 50,
      })
    : [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">Search shops</h1>

      <form
        method="get"
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-indigo-400"
      >
        <span className="pl-3 text-slate-400">
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          name="q"
          defaultValue={query}
          placeholder="Try a shop name or category…"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-slate-900 outline-none placeholder:text-slate-400"
          aria-label="Search shops"
          autoFocus
        />
        <button className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          Search
        </button>
      </form>

      {query && (
        <p className="text-sm text-slate-500">
          {results.length} {results.length === 1 ? "result" : "results"} for{" "}
          <span className="font-medium text-slate-700">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      {query && results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No shops matched. Try a different word.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(results as ShopCardData[]).map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
