import Link from "next/link";
import { MapPinIcon, BadgeCheckIcon, StarIcon, StoreIcon } from "./icons";

export interface ShopCardData {
  id: string;
  name: string;
  verified: boolean;
  isFeatured: boolean;
  category: { name: string };
  locality: { name: string };
  photos: { url: string }[];
}

// Server-rendered shop card. Lazy image, no client JS.
export default function ShopCard({ shop }: { shop: ShopCardData }) {
  const photo = shop.photos[0]?.url;

  return (
    <Link
      href={`/shop/${shop.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={shop.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <StoreIcon className="h-10 w-10" />
          </div>
        )}
        {shop.isFeatured && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
            <StarIcon className="h-3 w-3" />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-slate-900 group-hover:text-indigo-600">
            {shop.name}
          </h3>
          {shop.verified && (
            <BadgeCheckIcon className="h-5 w-5 flex-none text-indigo-600" />
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPinIcon className="h-4 w-4 flex-none text-slate-400" />
          {shop.locality.name}
        </p>
        <span className="mt-2 inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {shop.category.name}
        </span>
      </div>
    </Link>
  );
}
