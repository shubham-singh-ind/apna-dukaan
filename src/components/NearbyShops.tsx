"use client";

import { useEffect, useState } from "react";
import ShopCard, { type ShopCardData } from "./ShopCard";
import { haversineKm } from "@/lib/distance";
import { MapPinIcon } from "./icons";

type Status = "idle" | "loading" | "ready" | "denied" | "unsupported" | "error";

interface Props {
  shops: ShopCardData[];
  /** Request location automatically on mount (home page) instead of on click. */
  autoLocate?: boolean;
  /** Show the "near me" button + status text. Default true (listing page). */
  showButton?: boolean;
  /** Re-order nearest-first once located. Default true (listing page). */
  sortByDistance?: boolean;
}

// Progressive enhancement: the grid is server-rendered (SEO + no-JS). Computes
// distance to each shop in the browser; no extra API/DB calls.
export default function NearbyShops({
  shops,
  autoLocate = false,
  showButton = true,
  sortByDistance = true,
}: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  // Home page: ask for location as soon as the page loads.
  useEffect(() => {
    if (autoLocate) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLocate]);

  function locate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("ready");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }

  const withDistance = shops.map((shop) => ({
    shop,
    d:
      coords && shop.lat != null && shop.lng != null
        ? haversineKm(coords, { lat: shop.lat, lng: shop.lng })
        : null,
  }));

  if (coords && sortByDistance) {
    withDistance.sort((a, b) => {
      if (a.d == null) return 1; // shops without coords go last
      if (b.d == null) return -1;
      return a.d - b.d;
    });
  }

  const message: Record<Status, string> = {
    idle: "",
    loading: "Getting your location…",
    ready: "Sorted by distance from you.",
    denied: "Location access denied — enable it in your browser to see distances.",
    unsupported: "Your browser doesn’t support location.",
    error: "Couldn’t get your location. Try again.",
  };

  return (
    <div className="space-y-4">
      {showButton && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={locate}
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            <MapPinIcon className="h-4 w-4" />
            {coords ? "Update my location" : "Show shops near me"}
          </button>
          {message[status] && (
            <span
              className={
                status === "denied" || status === "error" || status === "unsupported"
                  ? "text-sm text-red-600"
                  : "text-sm text-slate-500"
              }
            >
              {message[status]}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {withDistance.map(({ shop, d }) => (
          <ShopCard key={shop.id} shop={shop} distanceKm={d} />
        ))}
      </div>
    </div>
  );
}
