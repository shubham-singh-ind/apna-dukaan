import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/base-url";

// Derived from the request host, so URLs always match the crawled domain.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getBaseUrl();

  let shops: { id: string; updatedAt: Date }[] = [];
  try {
    shops = await prisma.shop.findMany({ select: { id: true, updatedAt: true } });
  } catch {
    // DB unreachable — still emit the static routes.
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shops`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.3 },
  ];

  const shopRoutes: MetadataRoute.Sitemap = shops.map((s) => ({
    url: `${base}/shop/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...shopRoutes];
}
