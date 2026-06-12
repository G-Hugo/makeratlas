import type { Metadata } from "next";
import { Suspense } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { ComparePageClient } from "@/components/machines/ComparePageClient";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllResolvedDuels } from "@/lib/compare-duels";
import { getAllResolvedBrandDuels } from "@/lib/compare-brand-duels";
import { getIndexableMachines } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

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
    path: "/compare",
    title: dict.compare.title,
    description: dict.compare.description,
  });
}

export default async function ComparePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const machines = getIndexableMachines(locale);
  const duels = getAllResolvedDuels(locale);
  const brandDuels = getAllResolvedBrandDuels(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={dict.compare.title} description={dict.compare.description} />
      <div className="mt-10">
        <Suspense fallback={<p className="text-stone-500">{dict.compare.loading}</p>}>
          <ComparePageClient machines={machines} locale={locale} dict={dict} />
        </Suspense>
      </div>

      {brandDuels.length > 0 && (
        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              {dict.brandDuel.popularTitle}
            </h2>
            <LocaleLink
              href="/compare/brands"
              locale={locale}
              className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            >
              {dict.brandDuel.breadcrumb} →
            </LocaleLink>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {brandDuels.map((d) => (
              <LocaleLink
                key={d.param}
                href={`/compare/brands/${d.param}`}
                locale={locale}
                className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-amber-700"
              >
                {d.brands[0].name} vs {d.brands[1].name}
              </LocaleLink>
            ))}
          </div>
        </div>
      )}

      {duels.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {dict.compare.popularTitle}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {duels.map((d) => (
              <LocaleLink
                key={d.param}
                href={`/compare/${d.param}`}
                locale={locale}
                className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-amber-700"
              >
                {d.machines[0].name} vs {d.machines[1].name}
              </LocaleLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
