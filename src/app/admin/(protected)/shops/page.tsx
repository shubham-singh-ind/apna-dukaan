import Link from "next/link";
import { prisma } from "@/lib/db";
import ShopRowActions from "@/components/admin/ShopRowActions";

export const dynamic = "force-dynamic";

// Shop management list — track onboarding progress; edit/delete each shop.
export default async function AdminShopsPage() {
  const shops = await prisma.shop.findMany({
    include: { category: true, locality: true },
    orderBy: { createdAt: "desc" },
  });

  const verifiedCount = shops.filter((s) => s.verified).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shops</h1>
          <p className="text-sm text-gray-500">
            {shops.length} total · {verifiedCount} verified
          </p>
        </div>
        <Link href="/admin/shops/new" className="rounded bg-black px-3 py-2 text-sm text-white">
          Add shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <p className="rounded border border-dashed p-8 text-center text-sm text-gray-500">
          No shops yet. Click <span className="font-medium">Add shop</span> to onboard your first
          one.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2">Name</th>
                <th>Category</th>
                <th>Locality</th>
                <th>Status</th>
                <th>Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium">{s.name}</td>
                  <td>{s.category.name}</td>
                  <td>{s.locality.name}</td>
                  <td>
                    <span className={s.verified ? "text-green-600" : "text-gray-400"}>
                      {s.verified ? "Verified" : "Unverified"}
                    </span>
                    {s.isFeatured && (
                      <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-xs">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="text-gray-500">
                    {s.createdAt.toISOString().slice(0, 10)}
                  </td>
                  <td>
                    <ShopRowActions id={s.id} name={s.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
