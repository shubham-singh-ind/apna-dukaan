import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            Apna Dukaan
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/shops">Shops</Link>
            <Link href="/search">Search</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-500">
          © Apna Dukaan
        </div>
      </footer>
    </div>
  );
}
