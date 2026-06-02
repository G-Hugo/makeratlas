import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineCard } from "@/components/machines/MachineCard";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { getAllGuidesMeta, getCatalogEntries } from "@/lib/content";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  const entries = getCatalogEntries(locale);
  const featured = entries.slice(0, 6);
  const guides = getAllGuidesMeta(locale);

  const h = dict.home;

  return (
    <div>
      <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-700">
            makeratlas.com
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            {h.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-600">{h.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink
              href="/guides/laser-buying-guide-2026"
              locale={locale}
              className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
            >
              {h.ctaBuyingGuide}
            </LocaleLink>
            <LocaleLink
              href="/guides/understanding-laser-types"
              locale={locale}
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400"
            >
              {h.ctaLaserTypes}
            </LocaleLink>
            <LocaleLink
              href="/guides/laser-safety-basics"
              locale={locale}
              className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-800 transition hover:border-red-300"
            >
              {h.ctaSafety}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{h.featuredTitle}</h2>
            <p className="mt-2 text-stone-600">
              {interpolate(h.featuredSubtitle, { count: entries.length })}
            </p>
          </div>
          <LocaleLink
            href="/lasers"
            locale={locale}
            className="shrink-0 text-sm font-medium text-amber-700 hover:text-amber-800"
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

      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-stone-900">{h.startHereTitle}</h2>
          <p className="mt-2 max-w-2xl text-stone-600">{h.startHereBody}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {guides.map((guide) => (
              <LocaleLink
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                locale={locale}
                className="rounded-xl border border-stone-200 p-6 transition hover:border-amber-300 hover:shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                  {guide.category.replace("-", " ")} · {guide.readTime}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">{guide.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{guide.description}</p>
              </LocaleLink>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-900 text-white">
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
