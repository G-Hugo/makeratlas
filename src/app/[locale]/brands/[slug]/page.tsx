import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandPageHero } from "@/components/brands/BrandPageHero";
import { BrandProfilePanel } from "@/components/brands/BrandProfilePanel";
import { BrandDuelsList } from "@/components/compare/BrandDuelsList";
import { getMachineBySlug } from "@/lib/content";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { LasersBrowse } from "@/components/machines/LasersBrowse";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllBrandProfiles, getBrandBySlug, getCatalogEntriesByBrand } from "@/lib/brands";
import { getBrandDuelsForBrand } from "@/lib/compare-brand-duels";
import { interpolate } from "@/lib/i18n-helpers";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const brands = getAllBrandProfiles("en");
  return locales.flatMap((locale) => brands.map((brand) => ({ locale, slug: brand.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const brand = getBrandBySlug(slug, localeParam as Locale);
  if (!brand) return { title: localeParam === "fr" ? "Introuvable" : "Not found" };
  const dict = getDictionary(localeParam);
  return buildPageMetadata({
    locale: localeParam,
    path: `/brands/${slug}`,
    title: interpolate(dict.brands.brandPageTitle, { brand: brand.name }),
    description: interpolate(dict.brands.brandPageDescription, {
      brand: brand.name,
      count: brand.lineCount,
    }),
  });
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const brand = getBrandBySlug(slug, locale);
  if (!brand) notFound();

  const dict = getDictionary(locale);
  const entries = getCatalogEntriesByBrand(slug, locale);
  const b = dict.brands;
  const flagship = brand.flagship.machineSlug
    ? getMachineBySlug(brand.flagship.machineSlug, locale)
    : undefined;
  const brandDuels = getBrandDuelsForBrand(slug, locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink
          href="/brands"
          locale={locale}
          className="hover:text-amber-700 dark:hover:text-amber-400"
        >
          {b.breadcrumbBrands}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800 dark:text-stone-200">{brand.name}</span>
      </nav>

      <BrandPageHero
        name={brand.name}
        eyebrow={b.breadcrumbBrands}
        tagline={brand.tagline}
        logoSrc={brand.logoSrc}
      />

      <BrandProfilePanel brand={brand} flagship={flagship} locale={locale} dict={dict} />

      {brandDuels.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {interpolate(b.brandDuelsTitle, { brand: brand.name })}
          </h2>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {interpolate(b.brandDuelsSubtitle, { brand: brand.name })}
          </p>
          <BrandDuelsList
            duels={brandDuels}
            locale={locale}
            highlightBrandSlug={slug}
            className="mt-6"
          />
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{b.catalogTitle}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-400">
          {interpolate(b.catalogIntro, { brand: brand.name })}
        </p>
        <div className="mt-6">
          <LasersBrowse
            entries={entries}
            locale={locale}
            dict={dict}
            title={`${brand.name} · ${dict.lasers.title.toLowerCase()}`}
          />
        </div>
      </section>
    </div>
  );
}
