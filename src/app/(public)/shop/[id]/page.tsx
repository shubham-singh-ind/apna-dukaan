import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";

type Params = Promise<{ id: string }>;

// ISR: HTML is cached at the edge and refreshed periodically. Far cheaper for
// slow connections than rendering per request; new photos/edits appear within
// the revalidate window.
export const revalidate = 300;

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

function getShop(id: string) {
  return prisma.shop.findUnique({
    where: { id },
    include: {
      category: true,
      locality: true,
      photos: { orderBy: { sort: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) return { title: "Shop not found" };

  const title = `${shop.name} — ${shop.category.name} in ${shop.locality.name}`;
  const description =
    shop.description ??
    `${shop.name}: ${shop.category.name} in ${shop.locality.name}, ${shop.locality.city}. Address, timings, phone and WhatsApp.`;
  const url = `${APP_URL}/shop/${shop.id}`;
  const image = shop.photos[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Apna Dukaan",
      locale: "en_IN",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

// Digits-only for tel:/wa.me links.
const digits = (s: string) => s.replace(/\D/g, "");

export default async function ShopDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) notFound();

  const url = `${APP_URL}/shop/${shop.id}`;
  const mapQuery =
    shop.lat != null && shop.lng != null
      ? `${shop.lat},${shop.lng}`
      : encodeURIComponent(`${shop.name}, ${shop.address}, ${shop.locality.name}`);

  // schema.org LocalBusiness structured data for Google rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.name,
    description: shop.description ?? undefined,
    image: shop.photos.length ? shop.photos.map((p) => p.url) : undefined,
    url,
    telephone: shop.phone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: shop.locality.name,
      postalCode: shop.locality.pincode,
      addressRegion: shop.locality.city,
      addressCountry: "IN",
    },
    geo:
      shop.lat != null && shop.lng != null
        ? { "@type": "GeoCoordinates", latitude: shop.lat, longitude: shop.lng }
        : undefined,
    openingHours: shop.hours ?? undefined,
  };

  return (
    <article className="space-y-6">
      {/* Structured data — inert, adds no client JS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{shop.name}</h1>
        <p className="text-gray-500">
          {shop.category.name} · {shop.locality.name}, {shop.locality.city}
          {shop.verified && <span className="ml-2 text-green-600 text-sm">✓ Verified</span>}
        </p>
      </header>

      {/* Photos: hero eager for LCP, rest lazy. Fixed aspect ratio avoids layout
          shift. Native lazy-loading ships no JavaScript. */}
      {shop.photos.length > 0 && (
        <div className="space-y-3">
          <img
            src={shop.photos[0].url}
            alt={shop.name}
            width={1200}
            height={800}
            fetchPriority="high"
            decoding="async"
            className="w-full rounded-lg border object-cover"
            style={{ aspectRatio: "3 / 2" }}
          />
          {shop.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {shop.photos.slice(1).map((p) => (
                <img
                  key={p.id}
                  src={p.url}
                  alt={shop.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded border object-cover"
                  style={{ aspectRatio: "1 / 1" }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click-to-chat — plain anchors, no JS */}
      {(shop.phone || shop.whatsapp) && (
        <div className="flex flex-wrap gap-3">
          {shop.phone && (
            <a
              href={`tel:${digits(shop.phone)}`}
              className="rounded-lg bg-black px-4 py-2 text-center text-white"
            >
              📞 Call
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${digits(shop.whatsapp)}?text=${encodeURIComponent(
                `Hi ${shop.name}, I found you on Apna Dukaan.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-4 py-2 text-center text-white"
            >
              💬 WhatsApp
            </a>
          )}
        </div>
      )}

      {shop.description && <p className="text-gray-800">{shop.description}</p>}

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
              <a href={`tel:${digits(shop.phone)}`}>{shop.phone}</a>
            </dd>
          </div>
        )}
        {shop.whatsapp && (
          <div>
            <dt className="text-gray-500">WhatsApp</dt>
            <dd>
              <a href={`https://wa.me/${digits(shop.whatsapp)}`}>{shop.whatsapp}</a>
            </dd>
          </div>
        )}
      </dl>

      {/* Map: keyless embed, lazy-loaded so it never blocks first paint */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Location</h2>
        <iframe
          title={`Map of ${shop.name}`}
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full rounded-lg border-0"
        />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-blue-600"
        >
          Open in Google Maps →
        </a>
      </section>
    </article>
  );
}
