import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllResolvedBrandDuels } from "@/lib/compare-brand-duels";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return buildPageMetadata({
    locale: localeParam,
    path: "/compare/brands",
    title: dict.brandDuel.indexTitle,
    description: dict.brandDuel.indexDescription,
  });
}

export default async function BrandCompareIndexPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const duels = getAllResolvedBrandDuels(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink
          href="/compare"
          locale={locale}
          className="hover:text-amber-700 dark:hover:text-amber-400"
        >
          {dict.compare.title}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800 dark:text-stone-200">{dict.brandDuel.breadcrumb}</span>
      </nav>

      <PageHeader title={dict.brandDuel.indexTitle} description={dict.brandDuel.indexDescription} />

      <ul className="mt-10 space-y-3">
        {duels.map((duel) => (
          <li key={duel.param}>
            <LocaleLink
              href={`/compare/brands/${duel.param}`}
              locale={locale}
              className="flex flex-col gap-1 rounded-xl border border-stone-200 bg-white px-5 py-4 transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600 dark:hover:bg-amber-950/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {duel.brands[0].name} vs {duel.brands[1].name}
              </span>
              <span className="text-sm text-stone-500 dark:text-stone-400">
                {duel.brands[0].knownFor} · {duel.brands[1].knownFor}
              </span>
            </LocaleLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
