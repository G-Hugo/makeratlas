import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineCard } from "@/components/machines/MachineCard";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { BEST_OF_CATEGORIES, getBestOfRanking } from "@/lib/best-of";
import { getAllResolvedDuels } from "@/lib/compare-duels";
import { getAllGuidesMeta, getCatalogEntries } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return buildPageMetadata({
    locale: localeParam,
    path: "/",
    title: `${dict.meta.siteName} · ${dict.meta.siteTagline}`,
    description: dict.meta.defaultDescription,
    titleAbsolute: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  const entries = getCatalogEntries(locale);
  const featured = entries.slice(0, 6);
  const guides = getAllGuidesMeta(locale);
  const duels = getAllResolvedDuels(locale).slice(0, 8);

  const h = dict.home;

  const tools = [
    {
      href: "/finder",
      title: h.toolFinderTitle,
      body: h.toolFinderBody,
      icon: "?",
    },
    {
      href: "/compare",
      title: h.toolCompareTitle,
      body: h.toolCompareBody,
      icon: "⇄",
    },
    {
      href: "/best",
      title: h.toolRankingsTitle,
      body: h.toolRankingsBody,
      icon: "★",
    },
    {
      href: "/materials",
      title: h.toolMaterialsTitle,
      body: h.toolMaterialsBody,
      icon: "▦",
    },
  ];

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-stone-50 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            maker-atlas.com
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
            {h.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-600 dark:text-stone-300">{h.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink
              href="/finder"
              locale={locale}
              className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
            >
              {h.ctaFinder}
            </LocaleLink>
            <LocaleLink
              href="/guides/laser-buying-guide-2026"
              locale={locale}
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-500"
            >
              {h.ctaBuyingGuide}
            </LocaleLink>
            <LocaleLink
              href="/guides/understanding-laser-types"
              locale={locale}
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-500"
            >
              {h.ctaLaserTypes}
            </LocaleLink>
            <LocaleLink
              href="/guides/laser-safety-basics"
              locale={locale}
              className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 transition hover:border-red-300 dark:border-red-900 dark:bg-red-950 dark:text-red-200 dark:hover:border-red-800"
            >
              {h.ctaSafety}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{h.toolsTitle}</h2>
          <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-300">{h.toolsBody}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <LocaleLink
                key={tool.href}
                href={tool.href}
                locale={locale}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600 dark:hover:bg-amber-950/30"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-base font-bold text-white"
                >
                  {tool.icon}
                </span>
                <h3 className="mt-3 font-semibold text-stone-900 group-hover:text-amber-900 dark:text-stone-100 dark:group-hover:text-amber-300">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {tool.body}
                </p>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{h.featuredTitle}</h2>
            <p className="mt-2 text-stone-600 dark:text-stone-300">
              {interpolate(h.featuredSubtitle, { count: entries.length })}
            </p>
          </div>
          <LocaleLink
            href="/lasers"
            locale={locale}
            className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
          >
            {h.viewAll}
          </LocaleLink>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((entry) => (
            <MachineCard key={entry.primary.id} entry={entry} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {h.rankingsTitle}
                  </h2>
                  <p className="mt-2 text-stone-600 dark:text-stone-300">{h.rankingsSubtitle}</p>
                </div>
                <LocaleLink
                  href="/best"
                  locale={locale}
                  className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  {h.viewAll}
                </LocaleLink>
              </div>
              <ul className="mt-6 space-y-2.5">
                {BEST_OF_CATEGORIES.map((category) => {
                  const top = getBestOfRanking(category, locale)[0]?.entry;
                  return (
                    <li key={category.slug}>
                      <LocaleLink
                        href={`/best/${category.slug}`}
                        locale={locale}
                        className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600 dark:hover:bg-amber-950/30"
                      >
                        <span className="font-medium text-stone-800 dark:text-stone-100">
                          {category.copy[locale].title}
                        </span>
                        {top && (
                          <span className="shrink-0 text-xs text-stone-500 dark:text-stone-400">
                            #1 · {top.displayName}
                          </span>
                        )}
                      </LocaleLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {h.duelsTitle}
                  </h2>
                  <p className="mt-2 text-stone-600 dark:text-stone-300">{h.duelsSubtitle}</p>
                </div>
                <LocaleLink
                  href="/compare"
                  locale={locale}
                  className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
                >
                  {h.viewAll}
                </LocaleLink>
              </div>
              <ul className="mt-6 space-y-2.5">
                {duels.map((duel) => (
                  <li key={duel.param}>
                    <LocaleLink
                      href={`/compare/${duel.param}`}
                      locale={locale}
                      className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600 dark:hover:bg-amber-950/30"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-[10px] font-black uppercase text-white dark:bg-amber-500 dark:text-stone-950">
                        vs
                      </span>
                      <span className="min-w-0 truncate font-medium text-stone-800 dark:text-stone-100">
                        {duel.machines[0].name} vs {duel.machines[1].name}
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{h.startHereTitle}</h2>
          <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-300">{h.startHereBody}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => (
              <LocaleLink
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                locale={locale}
                className="rounded-xl border border-stone-200 p-6 transition hover:border-amber-300 hover:shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-500/50"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  {guide.category.replace("-", " ")} · {guide.readTime}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{guide.title}</h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{guide.description}</p>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-900 text-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold">{h.promiseTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-amber-400">{h.promiseHonestTitle}</h3>
              <p className="mt-2 text-sm text-stone-300">{h.promiseHonestBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">{h.promisePlainTitle}</h3>
              <p className="mt-2 text-sm text-stone-300">{h.promisePlainBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400">{h.promiseOnePlaceTitle}</h3>
              <p className="mt-2 text-sm text-stone-300">{h.promiseOnePlaceBody}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
