import { headers } from "next/headers";

// Resolve the site's base URL from the incoming request host. This works on any
// Vercel domain (preview, production, custom) with no env config, and — unlike
// NEXT_PUBLIC_APP_URL, which is inlined at build time — can never get stuck on a
// stale localhost value. Falls back to the env var, then localhost.
export async function getBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto =
        h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // Not in a request scope (e.g. static generation) — fall through.
  }
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
