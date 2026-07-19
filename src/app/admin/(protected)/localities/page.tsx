import { prisma } from "@/lib/db";
import LocalityManager from "@/components/admin/LocalityManager";

export const dynamic = "force-dynamic";

export default async function AdminLocalitiesPage() {
  const localities = await prisma.locality.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Localities</h1>
        <p className="text-sm text-gray-500">
          {localities.length} total · {localities.filter((l) => l.isActive).length} active
        </p>
      </div>
      <LocalityManager localities={localities} />
    </div>
  );
}
