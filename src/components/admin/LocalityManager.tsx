"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Locality {
  id: string;
  name: string;
  pincode: string;
  city: string;
  isActive: boolean;
}

const blank = { name: "", pincode: "", city: "" };

export default function LocalityManager({ localities }: { localities: Locality[] }) {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(blank);

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
    if (!form.name.trim() || !form.pincode.trim() || !form.city.trim()) return;
    if (await call("/api/v1/admin/localities", "POST", form)) setForm(blank);
  }

  const input = "rounded border px-2 py-1 text-sm";

  return (
    <div className="space-y-4">
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Locality name"
          className={input}
        />
        <input
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          placeholder="Pincode"
          className={`${input} w-28`}
        />
        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="City"
          className={input}
        />
        <button
          disabled={busy}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <ul className="divide-y rounded border">
        {localities.map((l) => (
          <li key={l.id} className={`p-3 text-sm ${l.isActive ? "" : "bg-gray-50 opacity-70"}`}>
            {editId === l.id ? (
              <div className="flex flex-wrap items-center gap-2">
                <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={input} />
                <input value={edit.pincode} onChange={(e) => setEdit({ ...edit, pincode: e.target.value })} className={`${input} w-28`} />
                <input value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} className={input} />
                <button
                  disabled={busy}
                  onClick={async () => {
                    if (await call(`/api/v1/admin/localities/${l.id}`, "PUT", edit)) setEditId(null);
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
                  <span className="font-medium">{l.name}</span>
                  <span className="ml-2 text-gray-400">
                    {l.pincode} · {l.city}
                  </span>
                  {!l.isActive && (
                    <span className="ml-2 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                      Inactive
                    </span>
                  )}
                </span>
                <span className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditId(l.id);
                      setEdit({ name: l.name, pincode: l.pincode, city: l.city });
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      call(`/api/v1/admin/localities/${l.id}`, "PUT", { isActive: !l.isActive })
                    }
                    className={l.isActive ? "text-red-600 hover:underline" : "text-green-600 hover:underline"}
                  >
                    {l.isActive ? "Deactivate" : "Activate"}
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
