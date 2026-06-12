import { Suspense } from "react";
import { SearchPalette } from "@/components/search/SearchPalette";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { buildSearchIndex } from "@/lib/search-index";
import { LocaleLink } from "./LocaleLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface ChromeProps {
  locale: Locale;
  dict: Dictionary;
}

export function Header({ locale, dict }: ChromeProps) {
  const navLinks = [
    { href: "/lasers", label: dict.nav.lasers },
    { href: "/best", label: dict.nav.bestOf },
    { href: "/finder", label: dict.nav.finder },
    { href: "/brands", label: dict.nav.brands },
    { href: "/guides", label: dict.nav.guides },
    { href: "/compare", label: dict.nav.compare },
    { href: "/about", label: dict.nav.about },
  ];
  const searchIndex = buildSearchIndex(locale, dict);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
        <LocaleLink href="/" locale={locale} className="group flex min-w-0 items-center gap-2 self-start">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
            MA
          </span>
          <div className="min-w-0">
            <span className="block truncate text-lg font-semibold tracking-tight text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400">
              {dict.meta.siteName}
            </span>
            <span className="hidden truncate text-xs text-stone-500 dark:text-stone-400 sm:block">
              {dict.meta.siteTagline}
            </span>
          </div>
        </LocaleLink>
        <nav className="-mx-1 flex flex-wrap items-center gap-1 sm:mx-0 sm:justify-end sm:gap-2">
          {navLinks.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              locale={locale}
              className="rounded-md px-2 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100 sm:px-3 sm:py-2"
            >
              {link.label}
            </LocaleLink>
          ))}
          <SearchPalette items={searchIndex} locale={locale} dict={dict} />
          <ThemeToggle labels={dict.theme} />
          <Suspense fallback={null}>
            <LocaleSwitcher locale={locale} labels={dict.localeSwitcher} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

function FooterLinkGroup({
  title,
  links,
  locale,
}: {
  title: string;
  links: { href: string; label: string }[];
  locale: Locale;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <LocaleLink
              href={link.href}
              locale={locale}
              className="text-sm text-stone-700 hover:text-amber-700 hover:underline dark:text-stone-300 dark:hover:text-amber-400"
            >
              {link.label}
            </LocaleLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ locale, dict }: ChromeProps) {
  const siteLinks = [
    { href: "/lasers", label: dict.nav.lasers },
    { href: "/best", label: dict.nav.bestOf },
    { href: "/finder", label: dict.nav.finder },
    { href: "/materials", label: dict.nav.materials },
    { href: "/brands", label: dict.nav.brands },
    { href: "/guides", label: dict.nav.guides },
    { href: "/compare", label: dict.nav.compare },
  ];
  const trustLinks = [
    { href: "/about", label: dict.footer.about },
    { href: "/methodology", label: dict.footer.methodology },
    { href: "/transparency", label: dict.footer.transparency },
    { href: "/guides/laser-safety-basics", label: dict.footer.safety },
  ];
  const legalLinks = [
    { href: "/legal", label: dict.footer.legalNotice },
    { href: "/privacy", label: dict.footer.privacy },
    { href: "/cookies", label: dict.footer.cookies },
  ];

  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-semibold text-stone-900 dark:text-stone-100">{dict.meta.siteName}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {dict.footer.blurb}
            </p>
          </div>
          <FooterLinkGroup title={dict.footer.siteLinks} links={siteLinks} locale={locale} />
          <FooterLinkGroup title={dict.footer.trustLinks} links={trustLinks} locale={locale} />
          <FooterLinkGroup title={dict.footer.legalLinks} links={legalLinks} locale={locale} />
        </div>
        <p className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
          © {new Date().getFullYear()} {dict.meta.siteName} · {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
