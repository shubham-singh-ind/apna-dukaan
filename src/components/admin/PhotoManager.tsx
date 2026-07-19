"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Photo {
  id: string;
  url: string;
}

// Manages a shop's photos: upload (proxied to Supabase Storage via our API) and
// delete. Only rendered on the edit page, where the shop already has an id.
export default function PhotoManager({ shopId, photos }: { shopId: string; photos: Photo[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);

    const body = new FormData();
    body.append("shopId", shopId);
    body.append("file", file);

    const res = await fetch("/api/v1/admin/photos", { method: "POST", body });
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";

    if (!res.ok) {
      const b = await res.json().catch(() => null);
      setError(b?.error?.message ?? `Upload failed (${res.status})`);
      return;
    }
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this photo?")) return;
    setBusy(true);
    const res = await fetch(`/api/v1/admin/photos/${id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      const b = await res.json().catch(() => null);
      setError(b?.error?.message ?? `Delete failed (${res.status})`);
      return;
    }
    router.refresh();
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Photos</h2>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      {photos.length === 0 ? (
        <p className="text-sm text-gray-500">No photos yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {photos.map((p) => (
            <li key={p.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                className="h-24 w-24 rounded border object-cover"
              />
              <button
                onClick={() => onDelete(p.id)}
                disabled={busy}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-xs text-white disabled:opacity-50"
                title="Delete photo"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onUpload}
          disabled={busy}
          className="text-sm"
        />
        {busy && <span className="ml-2 text-sm text-gray-500">Working…</span>}
        <p className="mt-1 text-xs text-gray-400">JPEG, PNG or WebP · max 4MB</p>
      </div>
    </section>
  );
}
