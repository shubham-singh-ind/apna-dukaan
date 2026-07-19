import { prisma } from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-gray-500">
          {categories.length} total · {categories.filter((c) => c.isActive).length} active
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
