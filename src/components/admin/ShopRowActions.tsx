"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Edit link + delete button for a shop row. Delete calls the admin API and
// refreshes the list on success.
export default function ShopRowActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/v1/admin/shops/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      window.alert(body?.error?.message ?? `Delete failed (${res.status})`);
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex justify-end gap-3">
      <Link href={`/admin/shops/${id}/edit`} className="text-blue-600 hover:underline">
        Edit
      </Link>
      <button
        onClick={onDelete}
        disabled={deleting}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
