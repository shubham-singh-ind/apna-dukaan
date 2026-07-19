import { NextResponse } from "next/server";

// Liveness check — no database dependency. Used to confirm the deploy is up.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", service: "apna-dukaan" });
}
