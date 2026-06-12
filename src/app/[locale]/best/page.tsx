import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BEST_OF_CATEGORIES, getBestOfRanking } from "@/lib/best-of";
import { interpolate } from "@/lib/i18n-helpers";
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
    path: "/best",
    title: dict.bestOf.indexTitle,
    description: dict.bestOf.indexDescription,
  });
}

export default async function BestOfIndexPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={dict.bestOf.indexTitle} description={dict.bestOf.indexDescription} />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BEST_OF_CATEGORIES.map((category) => {
          const copy = category.copy[locale];
          const ranking = getBestOfRanking(category, locale);
          const top = ranking[0]?.entry;

          return (
            <LocaleLink
              key={category.slug}
              href={`/best/${category.slug}`}
              locale={locale}
              className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600"
            >
              <h2 className="text-lg font-semibold text-stone-900 group-hover:text-amber-800 dark:text-stone-100 dark:group-hover:text-amber-400">
                {copy.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {copy.intro}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-sm dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">
                  {interpolate(dict.bestOf.rankedCount, { count: ranking.length })}
                </span>
                {top && (
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    #1 · {top.displayName}
                  </span>
                )}
              </div>
            </LocaleLink>
          );
        })}
      </div>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        {dict.bestOf.updatedNote}{" "}
        <LocaleLink
          href="/methodology"
          locale={locale}
          className="text-amber-700 hover:underline dark:text-amber-400"
        >
          {dict.bestOf.methodologyCta}
        </LocaleLink>
      </p>
    </div>
  );
}
