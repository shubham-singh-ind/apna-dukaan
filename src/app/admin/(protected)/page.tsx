import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  const [shops, categories, localities, updates] = await Promise.all([
    prisma.shop.count(),
    prisma.category.count(),
    prisma.locality.count(),
    prisma.stockUpdate.count(),
  ]);

  const stats = [
    { label: "Shops", value: shops },
    { label: "Categories", value: categories },
    { label: "Localities", value: localities },
    { label: "Stock updates", value: updates },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {session && <p className="text-sm text-gray-500">Signed in as {session.email}</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded border p-4">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
