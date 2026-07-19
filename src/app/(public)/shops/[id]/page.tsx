import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

async function getShop(id: string) {
  return prisma.shop.findUnique({
    where: { id },
    include: {
      category: true,
      locality: true,
      photos: { orderBy: { sort: "asc" } },
      updates: {
        where: { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// SEO-friendly per-shop metadata (see PROJECT.md §8 — SEO SSR).
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) return { title: "Shop not found" };
  return {
    title: shop.name,
    description: shop.description ?? `${shop.name} in ${shop.locality.name}`,
  };
}

export default async function ShopDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) notFound();

  return (
    <article className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{shop.name}</h1>
        <p className="text-gray-500">
          {shop.category.name} · {shop.locality.name}, {shop.locality.city}
        </p>
      </header>

      {shop.photos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto">
          {shop.photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={p.url}
              alt={shop.name}
              className="h-48 w-48 flex-none rounded object-cover"
            />
          ))}
        </div>
      )}

      {shop.description && <p>{shop.description}</p>}

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-gray-500">Address</dt>
          <dd>{shop.address}</dd>
        </div>
        {shop.hours && (
          <div>
            <dt className="text-gray-500">Timings</dt>
            <dd>{shop.hours}</dd>
          </div>
        )}
        {shop.phone && (
          <div>
            <dt className="text-gray-500">Phone</dt>
            <dd>
              <a href={`tel:${shop.phone}`}>{shop.phone}</a>
            </dd>
          </div>
        )}
        {shop.whatsapp && (
          <div>
            <dt className="text-gray-500">WhatsApp</dt>
            <dd>
              <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`}>{shop.whatsapp}</a>
            </dd>
          </div>
        )}
      </dl>

      {shop.updates.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Today&apos;s updates</h2>
          <ul className="space-y-2">
            {shop.updates.map((u) => (
              <li key={u.id} className="rounded border p-3 text-sm">
                {u.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
