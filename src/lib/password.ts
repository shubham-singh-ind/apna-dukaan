import bcrypt from "bcryptjs";

// Isolated from lib/auth.ts because bcryptjs uses Node APIs and must not be
// imported into the Edge runtime (middleware). Use only in Node route handlers.
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
