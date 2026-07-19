import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

// Explicit OG image route at a fixed URL: /shop/{id}/og — referenced directly
// from the shop page's metadata, so the absolute URL is fully under our control
// (no metadataBase resolution). Node runtime so Prisma works.
export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const shop = await prisma.shop
    .findUnique({
      where: { id },
      include: {
        category: { select: { name: true } },
        locality: { select: { name: true, city: true } },
        photos: { orderBy: { sort: "asc" }, take: 1, select: { url: true } },
      },
    })
    .catch(() => null);

  const name = shop?.name ?? "Apna Dukaan";
  const meta = shop
    ? `${shop.category.name} · ${shop.locality.name}, ${shop.locality.city}`
    : "Local neighbourhood shops";
  const photo = shop?.photos[0]?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          background: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: photo
              ? "linear-gradient(to top, rgba(15,23,42,0.94), rgba(15,23,42,0.30))"
              : "linear-gradient(135deg, #4f46e5, #312e81)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 72,
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#4f46e5",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
            </div>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#e0e7ff" }}>
              Apna Dukaan
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
            {name}
          </div>

          <div style={{ display: "flex", fontSize: 34, color: "#cbd5e1" }}>{meta}</div>

          {shop?.verified && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(79,70,229,0.9)",
                fontSize: 26,
                alignSelf: "flex-start",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Verified
            </div>
          )}
        </div>
      </div>
    ),
    SIZE,
  );
}
