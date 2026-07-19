import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>
      <ul className="divide-y rounded border">
        {categories.map((c) => (
          <li key={c.id} className="flex justify-between p-3 text-sm">
            <span>{c.name}</span>
            <span className="text-gray-400">{c.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
