import type { Metadata } from "next";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { LasersBrowse } from "@/components/machines/LasersBrowse";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import { getCatalogEntries } from "@/lib/content";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return {
    title: dict.lasers.title,
    description: interpolate(dict.lasers.description, {
      count: getCatalogEntries(localeParam as Locale).length,
    }),
  };
}

export default async function LasersPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const entries = getCatalogEntries(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <LasersBrowse
        entries={entries}
        locale={locale}
        dict={dict}
        description={interpolate(dict.lasers.description, { count: entries.length })}
      />
      <p className="mt-8 text-sm text-stone-500">
        {dict.lasers.helpChoosing}{" "}
        <LocaleLink
          href="/guides/understanding-laser-types"
          locale={locale}
          className="text-amber-700 hover:underline"
        >
          {dict.lasers.laserTypesGuide}
        </LocaleLink>{" "}
        {dict.lasers.or}{" "}
        <LocaleLink
          href="/guides/laser-buying-guide-2026"
          locale={locale}
          className="text-amber-700 hover:underline"
        >
          {dict.lasers.buyingGuide}
        </LocaleLink>
        .
      </p>
    </div>
  );
}
