import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Consistent JSON envelope for the versioned API (see PROJECT.md Part C #2).
export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function error(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { message, details } }, { status });
}

/** Translate common thrown errors into an API response. */
export function handleError(e: unknown) {
  if (e instanceof ZodError) {
    return error("Validation failed", 422, e.flatten());
  }
  if (e instanceof Error) {
    return error(e.message, 400);
  }
  return error("Internal server error", 500);
}
