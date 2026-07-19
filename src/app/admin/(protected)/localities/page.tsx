import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLocalitiesPage() {
  const localities = await prisma.locality.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Localities</h1>
      <ul className="divide-y rounded border">
        {localities.map((l) => (
          <li key={l.id} className="flex justify-between p-3 text-sm">
            <span>{l.name}</span>
            <span className="text-gray-400">
              {l.pincode} · {l.city}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
