import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import { breadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SeoFaqSection } from "@/components/seo/SeoFaqSection";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { getMachineBySlug } from "@/lib/content";
import { DEALS, DEALS_CHECKED_ON, DEALS_COPY, INFLATED_WAS_PRICES } from "@/lib/deals";
import { interpolate } from "@/lib/i18n-helpers";
import { formatMoney } from "@/lib/pricing";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = DEALS_COPY[locale];
  return buildPageMetadata({
    locale,
    path: "/deals",
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

/** USD as in the store, with the approximate euro price on the French pages. */
function price(amount: number, locale: Locale): string {
  const usd = formatMoney(amount, "USD");
  return locale === "fr" ? `${usd} (≈ ${formatMoney(amount, "EUR")})` : usd;
}

/** French typography puts a space before the colon. */
function colon(locale: Locale): string {
  return locale === "fr" ? " : " : ": ";
}

function checkedOnLabel(locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${DEALS_CHECKED_ON}T12:00:00Z`));
}

export default async function DealsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const copy = DEALS_COPY[locale];

  const deals = DEALS.flatMap((deal) => {
    const machine = getMachineBySlug(deal.slug, locale);
    return machine ? [{ deal, machine, saving: deal.usualPrice - deal.price }] : [];
  }).sort((a, b) => b.saving / b.deal.usualPrice - a.saving / a.deal.usualPrice);

  const inflated = INFLATED_WAS_PRICES.flatMap((row) => {
    const machine = getMachineBySlug(row.slug, locale);
    return machine ? [{ row, machine }] : [];
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([{ name: copy.breadcrumb, path: localizedPath(locale, "/deals") }])}
      />

      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-3 max-w-2xl text-stone-600 dark:text-stone-300">{copy.intro}</p>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
        {interpolate(copy.checkedOn, { date: checkedOnLabel(locale) })}
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{copy.dropsTitle}</h2>
        <p className="mt-2 text-stone-600 dark:text-stone-300">{copy.dropsIntro}</p>

        <ul className="mt-6 space-y-5">
          {deals.map(({ deal, machine, saving }) => (
            <li
              key={deal.slug}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900"
            >
              <div className="flex flex-col sm:flex-row">
                <LocaleLink
                  href={`/lasers/${machine.slug}`}
                  locale={locale}
                  className="block w-full shrink-0 sm:w-48"
                >
                  <MachineImage
                    machine={machine}
                    className="aspect-[4/3] w-full sm:h-full"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                </LocaleLink>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <div>
                    <LocaleLink
                      href={`/lasers/${machine.slug}`}
                      locale={locale}
                      className="text-lg font-semibold text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                    >
                      {machine.name}
                    </LocaleLink>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {deal.configuration[locale]} · {deal.store}
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-stone-500 dark:text-stone-400">{copy.dealPrice}</dt>
                      <dd className="text-lg font-bold text-stone-900 dark:text-stone-100">
                        {price(deal.price, locale)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-500 dark:text-stone-400">{copy.usualPrice}</dt>
                      <dd className="text-stone-700 dark:text-stone-300">{formatMoney(deal.usualPrice, "USD")}</dd>
                    </div>
                    <div>
                      <dt className="text-stone-500 dark:text-stone-400">{copy.saving}</dt>
                      <dd className="font-semibold text-emerald-700 dark:text-emerald-400">
                        −{formatMoney(saving, "USD")} ({Math.round((saving / deal.usualPrice) * 100)}{locale === "fr" ? " %" : "%"})
                      </dd>
                    </div>
                  </dl>
                  {deal.storeWasPrice && deal.storeWasPrice > deal.usualPrice && (
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {copy.storeWas}{colon(locale)}<s>{formatMoney(deal.storeWasPrice, "USD")}</s>
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2">
                    <LocaleLink
                      href={`/lasers/${machine.slug}`}
                      locale={locale}
                      className="rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                    >
                      {copy.viewProfile}
                    </LocaleLink>
                    <a
                      href={deal.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="rounded-lg border border-stone-300 px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-800 dark:border-stone-600 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:text-amber-300"
                    >
                      {copy.viewStore}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {inflated.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{copy.inflatedTitle}</h2>
          <p className="mt-2 text-stone-600 dark:text-stone-300">{copy.inflatedIntro}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700 dark:text-stone-300">
            {inflated.map(({ row, machine }) => (
              <li key={row.slug}>
                <LocaleLink
                  href={`/lasers/${machine.slug}`}
                  locale={locale}
                  className="font-medium text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                >
                  {machine.name}
                </LocaleLink>
                {interpolate(copy.inflatedRow, {
                  was: formatMoney(row.storeWasPrice, "USD"),
                  october: formatMoney(row.octoberPrice, "USD"),
                  now: formatMoney(row.price, "USD"),
                })}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{copy.datesTitle}</h2>
        <ul className="mt-4 space-y-1 text-stone-700 dark:text-stone-300">
          {copy.dates.map((d) => (
            <li key={d.label}>
              <span className="font-semibold text-stone-900 dark:text-stone-100">{d.label}</span>{colon(locale)}{d.date}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-stone-600 dark:text-stone-300">{copy.datesNote}</p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{copy.tipsTitle}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-700 dark:text-stone-300">
          {copy.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <SeoFaqSection title={copy.faqTitle} items={copy.faq} />
      </div>
    </div>
  );
}
