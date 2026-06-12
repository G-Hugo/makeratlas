import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandDuelVerdict } from "@/components/compare/BrandDuelVerdict";
import { BrandVersusTable } from "@/components/compare/BrandVersusTable";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SeoFaqSection } from "@/components/seo/SeoFaqSection";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import {
  BRAND_COMPARE_DUELS,
  brandDuelParam,
  featuredMachineDuelHref,
  getAllResolvedBrandDuels,
  resolveBrandDuel,
} from "@/lib/compare-brand-duels";
import { interpolate } from "@/lib/i18n-helpers";
import { buildBrandDuelFaq } from "@/lib/seo-brand-faq";
import { buildPageMetadata, type AppPath } from "@/lib/seo";
import type { BrandProfile } from "@/types/brand";
import type { Machine } from "@/types/machine";

interface PageProps {
  params: Promise<{ locale: string; duel: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    BRAND_COMPARE_DUELS.map((d) => ({ locale, duel: brandDuelParam(d.brands) })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, duel: duelSlug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const duel = resolveBrandDuel(duelSlug, locale);
  if (!duel) return {};

  const dict = getDictionary(locale);
  const [a, b] = duel.brands;

  return buildPageMetadata({
    locale,
    path: `/compare/brands/${duelSlug}` as AppPath,
    title: interpolate(dict.brandDuel.metaTitle, { a: a.name, b: b.name }),
    description: interpolate(dict.brandDuel.metaDescription, { a: a.name, b: b.name }),
  });
}

function BrandHeroCard({
  brand,
  locale,
  dict,
}: {
  brand: BrandProfile;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <BrandLogo name={brand.name} src={brand.logoSrc} size="card" />
      <div>
        <LocaleLink
          href={`/brands/${brand.slug}`}
          locale={locale}
          className="text-2xl font-bold text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
        >
          {brand.name}
        </LocaleLink>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {brand.tagline}
        </p>
      </div>
      <LocaleLink
        href={`/brands/${brand.slug}`}
        locale={locale}
        className="mt-auto text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
      >
        {interpolate(dict.brandDuel.viewProfile, { brand: brand.name })} →
      </LocaleLink>
    </div>
  );
}

function FeaturedMachineCard({
  machine,
  locale,
}: {
  machine: Machine;
  locale: Locale;
}) {
  return (
    <LocaleLink
      href={`/lasers/${machine.slug}`}
      locale={locale}
      className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-3 transition hover:border-amber-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600"
    >
      <MachineImage machine={machine} className="h-16 w-20 shrink-0 rounded-lg" sizes="80px" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-stone-900 dark:text-stone-100">{machine.name}</p>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          {machine.rating.overall.toFixed(1)}/10
        </p>
      </div>
    </LocaleLink>
  );
}

export default async function BrandCompareDuelPage({ params }: PageProps) {
  const { locale: localeParam, duel: duelSlug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const duel = resolveBrandDuel(duelSlug, locale);
  if (!duel) notFound();

  const dict = getDictionary(locale);
  const c = dict.brandDuel;
  const [a, b] = duel.brands;
  const [ma, mb] = duel.featuredMachines;
  const title = `${a.name} vs ${b.name}`;
  const machineDuelHref = featuredMachineDuelHref(duel.definition.featuredMachines);

  const related = getAllResolvedBrandDuels(locale)
    .filter(
      (d) =>
        d.param !== duelSlug &&
        d.brands.some((brand) => brand.slug === a.slug || brand.slug === b.slug),
    )
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.compare.title, path: localizedPath(locale, "/compare") },
          { name: c.breadcrumb, path: localizedPath(locale, "/compare/brands") },
          { name: title, path: localizedPath(locale, `/compare/brands/${duelSlug}`) },
        ])}
      />

      <nav className="text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink href="/compare" locale={locale} className="hover:underline">
          {dict.compare.title}
        </LocaleLink>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-stone-700 dark:text-stone-300">{title}</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">
        {interpolate(c.intro, { a: a.name, b: b.name })}
      </p>

      <div className="relative mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <BrandHeroCard brand={a} locale={locale} dict={dict} />
        <BrandHeroCard brand={b} locale={locale} dict={dict} />
        <span
          className="absolute left-1/2 top-16 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-stone-900 text-sm font-black uppercase text-white shadow-lg dark:border-stone-950 dark:bg-amber-500 dark:text-stone-950 sm:flex"
          aria-hidden
        >
          vs
        </span>
      </div>

      <div className="mt-8">
        <BrandDuelVerdict duel={duel} locale={locale} dict={dict} />
      </div>

      <div className="mt-10">
        <BrandVersusTable duel={duel} locale={locale} dict={dict} />
      </div>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          {c.featuredTitle}
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{c.featuredSubtitle}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FeaturedMachineCard machine={ma} locale={locale} />
          <FeaturedMachineCard machine={mb} locale={locale} />
        </div>
        <div className="mt-5">
          <LocaleLink
            href={machineDuelHref}
            locale={locale}
            className="inline-flex rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            {interpolate(c.featuredCta, { a: ma.name, b: mb.name })} →
          </LocaleLink>
        </div>
      </section>

      <div className="mt-12">
        <SeoFaqSection title={c.faqTitle} items={buildBrandDuelFaq(duel, locale, dict)} />
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {c.relatedTitle}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((d) => (
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
    </div>
  );
}
