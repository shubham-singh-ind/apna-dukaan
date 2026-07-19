import Link from "next/link";
import { prisma } from "@/lib/db";
import { type ShopCardData } from "@/components/ShopCard";
import NearbyShops from "@/components/NearbyShops";
import {
  SearchIcon,
  CategoryIcon,
  MapPinIcon,
  ArrowRightIcon,
  StoreIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const SHOP_INCLUDE = {
  category: { select: { name: true } },
  locality: { select: { name: true } },
  photos: { orderBy: { sort: "asc" as const }, take: 1, select: { url: true } },
};

export default async function HomePage() {
  let categories: { id: string; name: string; slug: string }[] = [];
  let localities: { id: string; name: string; pincode: string }[] = [];
  let featured: ShopCardData[] = [];
  let dbConnected = true;

  try {
    [categories, localities, featured] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.locality.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.shop.findMany({
        where: { isFeatured: true, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: SHOP_INCLUDE,
      }),
    ]);
  } catch {
    dbConnected = false;
  }

  if (!dbConnected) {
    return (
      <div className="space-y-3 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <StoreIcon className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Apna Dukaan</h1>
        <p className="text-slate-500">The deploy is live. Connect a database to load shops.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-12 text-center text-white sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Every local shop,
          <br className="hidden sm:block" /> at your fingertips
        </h1>
        <p className="mx-auto mt-3 max-w-md text-indigo-100">
          Find trusted neighbourhood stores near you — call or WhatsApp in seconds.
        </p>
        <form
          action="/search"
          method="get"
          className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
        >
          <span className="pl-3 text-slate-400">
            <SearchIcon className="h-5 w-5" />
          </span>
          <input
            name="q"
            placeholder="Search shops, e.g. grocery"
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-slate-900 outline-none placeholder:text-slate-400"
            aria-label="Search shops"
          />
          <button className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
            Search
          </button>
        </form>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Categories</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shops?category=${c.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <CategoryIcon slug={c.slug} className="h-5 w-5" />
                </span>
                <span className="font-medium text-slate-800">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured shops */}
      {featured.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Featured shops</h2>
            <Link
              href="/shops"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          {/* Auto-detects location on load and shows distance on each card;
              featured order is preserved (no re-sort, no button). */}
          <NearbyShops shops={featured} autoLocate showButton={false} sortByDistance={false} />
        </section>
      )}

      {/* Localities */}
      {localities.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Browse by locality</h2>
          <div className="flex flex-wrap gap-2">
            {localities.map((l) => (
              <Link
                key={l.id}
                href={`/shops?locality=${l.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
              >
                <MapPinIcon className="h-4 w-4 text-slate-400" />
                {l.name}
                <span className="text-slate-400">· {l.pincode}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
