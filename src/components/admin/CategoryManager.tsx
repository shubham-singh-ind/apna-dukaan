"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  async function call(url: string, method: string, body?: object) {
    setBusy(true);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      const b = await res.json().catch(() => null);
      setError(b?.error?.message ?? `Failed (${res.status})`);
      return false;
    }
    router.refresh();
    return true;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (await call("/api/v1/admin/categories", "POST", { name: name.trim() })) setName("");
  }

  const input = "rounded border px-2 py-1 text-sm";

  return (
    <div className="space-y-4">
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={add} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className={`${input} flex-1`}
        />
        <button
          disabled={busy}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="divide-y rounded border">
        {categories.map((c) => (
          <li key={c.id} className={`p-3 text-sm ${c.isActive ? "" : "bg-gray-50 opacity-70"}`}>
            {editId === c.id ? (
              <div className="flex flex-wrap items-center gap-2">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={input} />
                <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className={input} />
                <button
                  disabled={busy}
                  onClick={async () => {
                    if (await call(`/api/v1/admin/categories/${c.id}`, "PUT", { name: editName, slug: editSlug }))
                      setEditId(null);
                  }}
                  className="text-green-600 hover:underline"
                >
                  Save
                </button>
                <button onClick={() => setEditId(null)} className="text-gray-500 hover:underline">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span>
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-2 text-gray-400">/{c.slug}</span>
                  {!c.isActive && (
                    <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                      Inactive
                    </span>
                  )}
                </span>
                <span className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditId(c.id);
                      setEditName(c.name);
                      setEditSlug(c.slug);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      call(`/api/v1/admin/categories/${c.id}`, "PUT", { isActive: !c.isActive })
                    }
                    className={c.isActive ? "text-red-600 hover:underline" : "text-green-600 hover:underline"}
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </button>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
