import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/base-url";
import {
  PhoneIcon,
  MessageIcon,
  MapPinIcon,
  ClockIcon,
  BadgeCheckIcon,
  NavigationIcon,
} from "@/components/icons";

type Params = Promise<{ id: string }>;

function getShop(id: string) {
  // findFirst (not findUnique) so we can require isActive — inactive shops 404.
  return prisma.shop.findFirst({
    where: { id, isActive: true },
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
  const base = await getBaseUrl();
  const url = `${base}/shop/${shop.id}`;
  // Explicit absolute OG image URL (served by ./og/route.tsx) — built from the
  // request host so it's always the real domain, never a stale localhost.
  const ogImage = `${base}/shop/${shop.id}/og`;

  return {
    metadataBase: new URL(base),
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
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Digits-only for tel:/wa.me links.
const digits = (s: string) => s.replace(/\D/g, "");

export default async function ShopDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const shop = await getShop(id);
  if (!shop) notFound();

  const url = `${await getBaseUrl()}/shop/${shop.id}`;
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

      <header className="space-y-2">
        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{shop.name}</h1>
          {shop.verified && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
              <BadgeCheckIcon className="h-4 w-4" />
              Verified
            </span>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
            {shop.category.name}
          </span>
          <span className="flex items-center gap-1 text-sm">
            <MapPinIcon className="h-4 w-4 text-slate-400" />
            {shop.locality.name}, {shop.locality.city}
          </span>
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 sm:flex-none"
            >
              <PhoneIcon className="h-5 w-5" />
              Call
            </a>
          )}
          {shop.whatsapp && (
            <a
              href={`https://wa.me/${digits(shop.whatsapp)}?text=${encodeURIComponent(
                `Hi ${shop.name}, I found you on Apna Dukaan.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 sm:flex-none"
            >
              <MessageIcon className="h-5 w-5" />
              WhatsApp
            </a>
          )}
        </div>
      )}

      {shop.description && <p className="leading-relaxed text-slate-700">{shop.description}</p>}

      <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2">
        <div className="flex gap-3">
          <MapPinIcon className="h-5 w-5 flex-none text-indigo-600" />
          <div>
            <dt className="text-slate-500">Address</dt>
            <dd className="text-slate-900">{shop.address}</dd>
          </div>
        </div>
        {shop.hours && (
          <div className="flex gap-3">
            <ClockIcon className="h-5 w-5 flex-none text-indigo-600" />
            <div>
              <dt className="text-slate-500">Timings</dt>
              <dd className="text-slate-900">{shop.hours}</dd>
            </div>
          </div>
        )}
        {shop.phone && (
          <div className="flex gap-3">
            <PhoneIcon className="h-5 w-5 flex-none text-indigo-600" />
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd>
                <a href={`tel:${digits(shop.phone)}`} className="text-indigo-600">
                  {shop.phone}
                </a>
              </dd>
            </div>
          </div>
        )}
        {shop.whatsapp && (
          <div className="flex gap-3">
            <MessageIcon className="h-5 w-5 flex-none text-indigo-600" />
            <div>
              <dt className="text-slate-500">WhatsApp</dt>
              <dd>
                <a href={`https://wa.me/${digits(shop.whatsapp)}`} className="text-indigo-600">
                  {shop.whatsapp}
                </a>
              </dd>
            </div>
          </div>
        )}
      </dl>

      {/* Map: keyless embed, lazy-loaded so it never blocks first paint */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <MapPinIcon className="h-5 w-5 text-indigo-600" />
          Location
        </h2>
        <iframe
          title={`Map of ${shop.name}`}
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full rounded-2xl border border-slate-200"
        />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <NavigationIcon className="h-4 w-4" />
          Open in Google Maps
        </a>
      </section>
    </article>
  );
}
