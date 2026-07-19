import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Edge-safe: this module only uses `jose` (Web Crypto), so it can be imported
// from middleware. Password hashing lives in lib/password.ts (Node-only).
const ADMIN_COOKIE = "ad_admin_session";

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    // Never fall back to a hardcoded default in production — a published default
    // secret lets anyone forge an admin session. Fail loudly instead so the
    // misconfiguration surfaces (e.g. JWT_SECRET not reaching the Edge runtime
    // because it was created as a "Sensitive" env var on Vercel).
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is not set");
    }
    return new TextEncoder().encode("dev-only-insecure-secret");
  }
  return new TextEncoder().encode(value);
}

export interface AdminSession {
  sub: string; // admin id
  email: string;
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "7d")
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

/** Read the current admin session from the request cookie, or null. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setAdminCookie(token: string): Promise<void> {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}

/**
 * Guard for admin server components/pages. Runs on the Node runtime (unlike Edge
 * middleware, which can't read JWT_SECRET on Vercel), so verification actually
 * works. Redirects to the login page when there is no valid session.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
