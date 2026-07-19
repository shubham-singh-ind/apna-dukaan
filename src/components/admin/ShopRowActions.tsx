"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Edit + activate/deactivate for a shop row. "Delete" is a soft delete: it marks
// the shop inactive (hidden publicly) rather than removing it.
export default function ShopRowActions({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function deactivate() {
    if (!window.confirm(`Deactivate "${name}"? It will be hidden from the public site.`)) return;
    setBusy(true);
    const res = await fetch(`/api/v1/admin/shops/${id}`, { method: "DELETE" });
    await finish(res);
  }

  async function activate() {
    setBusy(true);
    const res = await fetch(`/api/v1/admin/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    await finish(res);
  }

  async function finish(res: Response) {
    if (!res.ok) {
      const b = await res.json().catch(() => null);
      window.alert(b?.error?.message ?? `Action failed (${res.status})`);
      setBusy(false);
      return;
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex justify-end gap-3">
      <Link href={`/admin/shops/${id}/edit`} className="text-blue-600 hover:underline">
        Edit
      </Link>
      {isActive ? (
        <button
          onClick={deactivate}
          disabled={busy}
          className="text-red-600 hover:underline disabled:opacity-50"
        >
          {busy ? "…" : "Deactivate"}
        </button>
      ) : (
        <button
          onClick={activate}
          disabled={busy}
          className="text-green-600 hover:underline disabled:opacity-50"
        >
          {busy ? "…" : "Activate"}
        </button>
      )}
    </div>
  );
}
