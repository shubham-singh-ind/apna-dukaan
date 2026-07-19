import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

// Regenerate hourly so newly onboarded shops appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let shops: { id: string; updatedAt: Date }[] = [];
  try {
    shops = await prisma.shop.findMany({ select: { id: true, updatedAt: true } });
  } catch {
    // DB unreachable at build/revalidate — still emit the static routes.
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/shops`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/search`, changeFrequency: "weekly", priority: 0.3 },
  ];

  const shopRoutes: MetadataRoute.Sitemap = shops.map((s) => ({
    url: `${BASE}/shop/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...shopRoutes];
}
