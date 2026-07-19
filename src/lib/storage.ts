import { createClient } from "@supabase/supabase-js";

// Supabase Storage for shop photos. The DB stores only the public URL; image
// bytes live in the bucket. Uploads are proxied through our Node API route, so
// this uses the service-role key and never runs in the browser.
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "shop-photos";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Keep under Vercel's ~4.5MB serverless request-body limit for proxied uploads.
const MAX_BYTES = 4 * 1024 * 1024;

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function extFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

/** Upload one image for a shop and return its public URL. Validates type + size. */
export async function uploadShopPhoto(shopId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Unsupported image type: ${file.type || "unknown"} (jpeg, png, webp only)`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image too large (max 4MB).");
  }

  const key = `${shopId}/${crypto.randomUUID()}.${extFor(file.type)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const supabase = client();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  return supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
}

/** Best-effort removal of a stored object given its public URL. */
export async function deleteShopPhotoByUrl(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not a bucket URL we manage
  const key = url.slice(idx + marker.length);
  await client().storage.from(BUCKET).remove([key]);
}
