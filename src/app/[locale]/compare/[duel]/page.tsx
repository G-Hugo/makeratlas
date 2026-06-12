import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineDuelVerdict } from "@/components/compare/MachineDuelVerdict";
import { MachineVersusStatic } from "@/components/compare/MachineVersusStatic";
import { MachineImage } from "@/components/machines/MachineImage";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import {
  COMPARE_DUELS,
  duelParam,
  getAllResolvedDuels,
  resolveDuel,
} from "@/lib/compare-duels";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { serializeCompareIds } from "@/lib/machine-compare";
import { buildPageMetadata, type AppPath } from "@/lib/seo";
import { ratingColor } from "@/lib/utils";
import type { Machine } from "@/types/machine";

interface PageProps {
  params: Promise<{ locale: string; duel: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COMPARE_DUELS.map((pair) => ({ locale, duel: duelParam(pair) })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, duel: duelSlug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const duel = resolveDuel(duelSlug, locale);
  if (!duel) return {};

  const dict = getDictionary(locale);
  const [a, b] = duel.machines;

  return buildPageMetadata({
    locale,
    path: `/compare/${duelSlug}` as AppPath,
    title: interpolate(dict.compare.duelMetaTitle, { a: a.name, b: b.name }),
    description: interpolate(dict.compare.duelMetaDescription, { a: a.name, b: b.name }),
  });
}

function DuelHeroCard({
  machine,
  locale,
  dict,
}: {
  machine: Machine;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <LocaleLink href={`/lasers/${machine.slug}`} locale={locale} className="block">
        <MachineImage machine={machine} className="aspect-[4/3] w-full" sizes="(max-width: 640px) 50vw, 420px" />
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className={`text-2xl font-bold leading-none ${ratingColor(machine.rating.overall)}`}>
          {machine.rating.overall.toFixed(1)}
        </p>
        <LocaleLink
          href={`/lasers/${machine.slug}`}
          locale={locale}
          className="text-lg font-semibold leading-snug text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
        >
          {machine.name}
        </LocaleLink>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {machine.tldr}
        </p>
        <LocaleLink
          href={`/lasers/${machine.slug}`}
          locale={locale}
          className="mt-auto pt-3 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {dict.brands.flagshipCta} →
        </LocaleLink>
      </div>
    </div>
  );
}

export default async function CompareDuelPage({ params }: PageProps) {
  const { locale: localeParam, duel: duelSlug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const duel = resolveDuel(duelSlug, locale);
  if (!duel) notFound();

  const dict = getDictionary(locale);
  const c = dict.compare;
  const [a, b] = duel.machines;
  const title = `${a.name} vs ${b.name}`;

  const related = getAllResolvedDuels(locale)
    .filter(
      (d) =>
        d.param !== duelSlug &&
        d.machines.some((m) => m.slug === a.slug || m.slug === b.slug),
    )
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: c.title, path: localizedPath(locale, "/compare") },
          { name: title, path: localizedPath(locale, `/compare/${duelSlug}`) },
        ])}
      />

      <nav className="text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink href="/compare" locale={locale} className="hover:underline">
          {c.title}
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
        {interpolate(c.duelIntro, { a: a.name, b: b.name })}
      </p>

      <div className="relative mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
        <DuelHeroCard machine={a} locale={locale} dict={dict} />
        <DuelHeroCard machine={b} locale={locale} dict={dict} />
        <span
          className="absolute left-1/2 top-24 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-stone-900 text-sm font-black uppercase text-white shadow-lg dark:border-stone-950 dark:bg-amber-500 dark:text-stone-950 sm:flex"
          aria-hidden
        >
          vs
        </span>
      </div>

      <div className="mt-8">
        <MachineDuelVerdict machines={[a, b]} locale={locale} dict={dict} />
      </div>

      <div className="mt-6 flex justify-center">
        <LocaleLink
          href={`/compare?ids=${serializeCompareIds([a.slug, b.slug])}`}
          locale={locale}
          className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {c.duelOpenComparator}
        </LocaleLink>
      </div>

      <div className="mt-10">
        <MachineVersusStatic machines={[a, b]} locale={locale} dict={dict} />
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {c.duelRelatedTitle}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((d) => (
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
