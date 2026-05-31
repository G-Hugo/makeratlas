import Link from "next/link";

const navLinks = [
  { href: "/lasers", label: "Lasers" },
  { href: "/guides", label: "Guides" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
            MA
          </span>
          <div>
            <span className="block text-lg font-semibold tracking-tight text-stone-900 group-hover:text-amber-700">
              Maker Atlas
            </span>
            <span className="hidden text-xs text-stone-500 sm:block">
              The complete reference for maker machines
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-stone-900">Maker Atlas</p>
            <p className="mt-1 max-w-md text-sm text-stone-600">
              Honest, clear reference guides for makers and small artisans.
              We explain what machines actually do — no hype.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href="/about" className="text-amber-700 hover:underline">
                About
              </Link>
              <Link href="/guides/laser-safety-basics" className="text-amber-700 hover:underline">
                Safety
              </Link>
              <Link href="/guides" className="text-amber-700 hover:underline">
                Guides
              </Link>
            </div>
          </div>
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Maker Atlas · makeratlas.com
          </p>
        </div>
      </div>
    </footer>
  );
}
