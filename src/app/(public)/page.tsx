import Link from "next/link";
import { prisma } from "@/lib/db";

// Renders live shop data — render per-request rather than prerender at build.
export const dynamic = "force-dynamic";

// Homepage — locality selector + categories (see PROJECT.md §6 Public).
export default async function HomePage() {
  // Degrade gracefully before a database is connected so the deploy stays
  // green ("hello world" milestone). Once DATABASE_URL is set this renders
  // the real directory.
  let categories: { id: string; name: string; slug: string }[] = [];
  let localities: { id: string; name: string; pincode: string }[] = [];
  let dbConnected = true;

  try {
    [categories, localities] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.locality.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    dbConnected = false;
  }

  if (!dbConnected) {
    return (
      <div className="space-y-3 text-center py-12">
        <h1 className="text-3xl font-bold">Apna Dukaan 👋</h1>
        <p className="text-gray-600">Hello world — the deploy is live.</p>
        <p className="text-sm text-gray-400">
          Connect a database (set <code>DATABASE_URL</code>) to load the shop directory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Discover shops near you</h1>
        <p className="text-gray-600">
          Browse verified neighborhood shops, timings, and today&apos;s updates.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Localities</h2>
        <ul className="flex flex-wrap gap-2">
          {localities.map((l) => (
            <li key={l.id}>
              <Link
                href={`/shops?locality=${l.id}`}
                className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
              >
                {l.name} · {l.pincode}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Categories</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/shops?category=${c.slug}`}
                className="block rounded border p-4 text-center hover:bg-gray-50"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
