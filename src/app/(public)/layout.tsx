import Link from "next/link";
import { StoreIcon, SearchIcon } from "@/components/icons";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <StoreIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">Apna Dukaan</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/shops"
              className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Browse
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <StoreIcon className="h-4 w-4 text-indigo-600" />
            Apna Dukaan
          </div>
          <p>Discover trusted neighborhood shops near you.</p>
          <p className="mt-2 text-xs text-slate-400">© {"2026"} Apna Dukaan</p>
        </div>
      </footer>
    </div>
  );
}
