import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

// Auth gate for all admin pages except /admin/login (which sits outside this
// route group). Runs on the Node runtime, so JWT_SECRET is available and
// verification works — replacing the Edge-middleware check that couldn't.
export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r p-4 space-y-2">
        <div className="font-bold mb-4">Admin</div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/shops">Shops</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/localities">Localities</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
