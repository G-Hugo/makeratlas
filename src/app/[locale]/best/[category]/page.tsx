import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SeoFaqSection } from "@/components/seo/SeoFaqSection";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/site-url";
import {
  BEST_OF_CATEGORIES,
  getBestOfCategory,
  getBestOfRanking,
} from "@/lib/best-of";
import { getAllGuidesMeta } from "@/lib/content";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { serializeCompareIds } from "@/lib/machine-compare";
import { formatDualPriceRange } from "@/lib/pricing";
import { buildPageMetadata, type AppPath } from "@/lib/seo";
import { buildBestOfFaq } from "@/lib/seo-faq";
import { ratingColor } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    BEST_OF_CATEGORIES.map((category) => ({ locale, category: category.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, category: categorySlug } = await params;
  if (!isLocale(localeParam)) return {};
  const category = getBestOfCategory(categorySlug);
  if (!category) return {};
  const copy = category.copy[localeParam as Locale];

  return buildPageMetadata({
    locale: localeParam,
    path: `/best/${categorySlug}` as AppPath,
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function BestOfCategoryPage({ params }: PageProps) {
  const { locale: localeParam, category: categorySlug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const category = getBestOfCategory(categorySlug);
  if (!category) notFound();

  const dict = getDictionary(locale);
  const b = dict.bestOf;
  const copy = category.copy[locale];
  const ranking = getBestOfRanking(category, locale);
  if (ranking.length === 0) notFound();

  const guides = getAllGuidesMeta(locale).filter((g) =>
    category.guideSlugs.includes(g.slug),
  );
  const otherCategories = BEST_OF_CATEGORIES.filter((c) => c.slug !== category.slug);
  const compareTopHref = `/compare?ids=${serializeCompareIds(
    ranking.slice(0, 3).map((r) => r.entry.primary.slug),
  )}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.title,
    itemListElement: ranking.map((r) => ({
      "@type": "ListItem",
      position: r.rank,
      name: r.entry.displayName,
      url: absoluteUrl(localizedPath(locale, `/lasers/${r.entry.primary.slug}`)),
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: b.breadcrumb, path: localizedPath(locale, "/best") },
          { name: copy.title, path: localizedPath(locale, `/best/${category.slug}`) },
        ])}
      />
      <JsonLd data={itemListJsonLd} />

      <nav className="text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink href="/best" locale={locale} className="hover:underline">
          {b.breadcrumb}
        </LocaleLink>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-stone-700 dark:text-stone-300">{copy.title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">{copy.intro}</p>

      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
        {b.updatedNote}{" "}
        <LocaleLink href="/methodology" locale={locale} className="font-medium underline">
          {b.methodologyCta}
        </LocaleLink>
      </p>

      <ol className="mt-8 space-y-6">
        {ranking.map(({ rank, entry }) => {
          const m = entry.primary;
          const prices = formatDualPriceRange(m.priceRange.min, m.priceRange.max);

          return (
            <li
              key={m.slug}
              className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full shrink-0 sm:w-56">
                  <LocaleLink href={`/lasers/${m.slug}`} locale={locale} className="block h-full">
                    <MachineImage
                      machine={m}
                      className="aspect-[4/3] w-full sm:h-full"
                      sizes="(max-width: 640px) 100vw, 224px"
                    />
                  </LocaleLink>
                  <span
                    className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white shadow-md ${
                      rank === 1 ? "bg-amber-500" : "bg-stone-700 dark:bg-stone-600"
                    }`}
                  >
                    {rank}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <LocaleLink
                        href={`/lasers/${m.slug}`}
                        locale={locale}
                        className="text-lg font-semibold text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                      >
                        {entry.displayName}
                      </LocaleLink>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        {m.brand} · {laserTypeLabelLocalized(m.laserType, dict)} ·{" "}
                        {locale === "fr" ? `≈ ${prices.eurApprox}` : prices.usd}
                      </p>
                    </div>
                    <span className={`text-2xl font-bold ${ratingColor(m.rating.overall)}`}>
                      {m.rating.overall.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    {m.tldr}
                  </p>

                  <div className="mt-1 grid gap-3 text-sm sm:grid-cols-2">
                    <ul className="space-y-1">
                      {m.pros.slice(0, 3).map((pro) => (
                        <li key={pro} className="flex gap-2 text-stone-700 dark:text-stone-300">
                          <span className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-1">
                      {m.cons.slice(0, 2).map((con) => (
                        <li key={con} className="flex gap-2 text-stone-600 dark:text-stone-400">
                          <span className="mt-0.5 shrink-0 text-rose-500">−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm font-medium">
                    <LocaleLink
                      href={`/lasers/${m.slug}`}
                      locale={locale}
                      className="text-amber-700 hover:underline dark:text-amber-400"
                    >
                      {dict.brands.flagshipCta} →
                    </LocaleLink>
                    {rank > 1 && (
                      <LocaleLink
                        href={`/compare?ids=${serializeCompareIds([
                          ranking[0].entry.primary.slug,
                          m.slug,
                        ])}`}
                        locale={locale}
                        className="text-stone-500 hover:text-stone-800 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
                      >
                        vs #1
                      </LocaleLink>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex justify-center">
        <LocaleLink
          href={compareTopHref}
          locale={locale}
          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {b.compareTopCta}
        </LocaleLink>
      </div>

      <div className="mt-12">
        <SeoFaqSection
          title={b.faqTitle}
          items={buildBestOfFaq(category, ranking, locale, dict)}
        />
      </div>

      {guides.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {b.relatedGuides}
          </h2>
          <ul className="mt-4 space-y-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <LocaleLink
                  href={`/guides/${g.slug}`}
                  locale={locale}
                  className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                >
                  {g.title} →
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          {b.otherCategories}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {otherCategories.map((c) => (
            <LocaleLink
              key={c.slug}
              href={`/best/${c.slug}`}
              locale={locale}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-amber-700"
            >
              {c.copy[locale].title}
            </LocaleLink>
          ))}
        </div>
      </div>
    </div>
  );
}
