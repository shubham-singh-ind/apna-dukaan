"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  name: string;
}

export interface ShopValues {
  id: string;
  name: string;
  categoryId: string;
  localityId: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  whatsapp: string | null;
  hours: string | null;
  description: string | null;
  verified: boolean;
  isFeatured: boolean;
}

interface Props {
  categories: Option[];
  localities: Option[];
  /** When provided, the form edits this shop (PUT) instead of creating (POST). */
  shop?: ShopValues;
}

// Create/edit shop form. POSTs to /api/v1/admin/shops, or PUTs to
// /api/v1/admin/shops/{id} in edit mode (admin-only; session cookie auto-sent).
export default function ShopForm({ categories, localities, shop }: Props) {
  const router = useRouter();
  const isEdit = Boolean(shop);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    // On edit, blank optional fields are sent as null (clear them); on create
    // they are omitted so the POST schema's `.optional()` is satisfied.
    const empty = isEdit ? null : undefined;
    const num = (v: FormDataEntryValue | null) => {
      const s = String(v ?? "").trim();
      return s === "" ? empty : Number(s);
    };
    const str = (v: FormDataEntryValue | null) => {
      const s = String(v ?? "").trim();
      return s === "" ? empty : s;
    };

    const payload = {
      name: String(form.get("name") ?? "").trim(),
      categoryId: String(form.get("categoryId") ?? ""),
      localityId: String(form.get("localityId") ?? ""),
      address: String(form.get("address") ?? "").trim(),
      lat: num(form.get("lat")),
      lng: num(form.get("lng")),
      phone: str(form.get("phone")),
      whatsapp: str(form.get("whatsapp")),
      hours: str(form.get("hours")),
      description: str(form.get("description")),
      verified: form.get("verified") === "on",
      isFeatured: form.get("isFeatured") === "on",
    };

    const res = await fetch(
      isEdit ? `/api/v1/admin/shops/${shop!.id}` : "/api/v1/admin/shops",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      setError(body?.error?.message ?? `Failed (${res.status})`);
      setSaving(false);
      return;
    }

    // After creating, go to the edit page so photos can be added straight away.
    if (isEdit) {
      router.push("/admin/shops");
    } else {
      router.push(`/admin/shops/${body?.data?.id}/edit`);
    }
    router.refresh();
  }

  const input = "w-full rounded border px-3 py-2";
  const label = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label className={label} htmlFor="name">
          Name *
        </label>
        <input id="name" name="name" className={input} defaultValue={shop?.name} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="categoryId">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={input}
            required
            defaultValue={shop?.categoryId ?? ""}
          >
            <option value="" disabled>
              Select…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="localityId">
            Locality *
          </label>
          <select
            id="localityId"
            name="localityId"
            className={input}
            required
            defaultValue={shop?.localityId ?? ""}
          >
            <option value="" disabled>
              Select…
            </option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="address">
          Address *
        </label>
        <input id="address" name="address" className={input} defaultValue={shop?.address} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className={input} defaultValue={shop?.phone ?? ""} />
        </div>
        <div>
          <label className={label} htmlFor="whatsapp">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            className={input}
            defaultValue={shop?.whatsapp ?? ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="lat">
            Latitude
          </label>
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            className={input}
            defaultValue={shop?.lat ?? ""}
          />
        </div>
        <div>
          <label className={label} htmlFor="lng">
            Longitude
          </label>
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            className={input}
            defaultValue={shop?.lng ?? ""}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="hours">
          Hours
        </label>
        <input
          id="hours"
          name="hours"
          placeholder="9:00 AM – 9:00 PM"
          className={input}
          defaultValue={shop?.hours ?? ""}
        />
      </div>

      <div>
        <label className={label} htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className={input}
          defaultValue={shop?.description ?? ""}
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="verified" defaultChecked={shop?.verified} /> Verified
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={shop?.isFeatured} /> Featured
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create shop"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/shops")}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
