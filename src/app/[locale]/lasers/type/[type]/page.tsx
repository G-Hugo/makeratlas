import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { LasersBrowse } from "@/components/machines/LasersBrowse";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import {
  LASER_TYPE_INFO,
  SPECIALTY_GUIDES_BY_LASER_TYPE,
  SPECIALTY_GUIDE_SLUGS,
  getCatalogEntries,
  getCatalogEntriesByLaserType,
  getCatalogMachineCount,
} from "@/lib/content";
import type { LaserType } from "@/types/machine";
import { buildPageMetadata } from "@/lib/seo";

const VALID_TYPES: LaserType[] = ["diode", "co2", "fiber", "uv", "hybrid"];

interface PageProps {
  params: Promise<{ locale: string; type: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    VALID_TYPES.map((type) => ({ locale, type })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, type } = await params;
  if (!isLocale(localeParam) || !VALID_TYPES.includes(type as LaserType)) {
    return { title: localeParam === "fr" ? "Introuvable" : "Not found" };
  }
  const dict = getDictionary(localeParam);
  const label = laserTypeLabelLocalized(type, dict);
  return buildPageMetadata({
    locale: localeParam,
    path: `/lasers/type/${type}`,
    title: `${label} | ${dict.lasers.title}`,
    description: dict.laserTypeDescriptions[type as LaserType],
  });
}

export default async function LaserTypePage({ params }: PageProps) {
  const { locale: localeParam, type } = await params;
  if (!isLocale(localeParam) || !VALID_TYPES.includes(type as LaserType)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const laserType = type as LaserType;
  const label = laserTypeLabelLocalized(laserType, dict);
  const description = dict.laserTypeDescriptions[laserType];
  const entries = getCatalogEntries(locale);
  const typeCount = getCatalogEntriesByLaserType(laserType, locale).length;
  const allCount = getCatalogMachineCount(locale);

  if (typeCount === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
          <LocaleLink href="/lasers" locale={locale} className="hover:text-amber-700 dark:hover:text-amber-400">
            {dict.machine.breadcrumbLasers}
          </LocaleLink>
          <span className="mx-2">/</span>
          <span className="text-stone-800 dark:text-stone-200">{label}</span>
        </nav>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          {label} · {dict.lasers.title.toLowerCase()}
        </h1>
        <p className="mt-4 text-stone-600 dark:text-stone-400">{description}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
        <LocaleLink href="/lasers" locale={locale} className="hover:text-amber-700 dark:hover:text-amber-400">
          {dict.machine.breadcrumbLasers}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800 dark:text-stone-200">{label}</span>
      </nav>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{label}</p>
        <p className="mt-2 text-stone-700 dark:text-stone-300">{description}</p>
        <div className="mt-3 flex flex-col gap-1.5 text-sm">
          <LocaleLink
            href={`/guides/${LASER_TYPE_INFO[laserType].guideSlug}`}
            locale={locale}
            className="font-medium text-amber-700 hover:underline dark:text-amber-400"
          >
            {dict.guides.typeGuideLink} →
          </LocaleLink>
          <LocaleLink
            href="/guides/understanding-laser-types"
            locale={locale}
            className="text-stone-600 hover:text-amber-700 hover:underline dark:text-stone-400 dark:hover:text-amber-400"
          >
            {dict.lasers.laserTypesGuide} →
          </LocaleLink>
        </div>
        {(SPECIALTY_GUIDES_BY_LASER_TYPE[laserType]?.length ?? 0) > 0 && (
          <div className="mt-4 border-t border-amber-200/80 pt-4 dark:border-amber-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-300">
              {dict.guides.specialtyGuideLink}
            </p>
            <ul className="mt-2 space-y-1.5">
              {SPECIALTY_GUIDES_BY_LASER_TYPE[laserType]!.map((key) => (
                <li key={key}>
                  <LocaleLink
                    href={`/guides/${SPECIALTY_GUIDE_SLUGS[key]}`}
                    locale={locale}
                    className="text-sm text-stone-700 hover:text-amber-700 hover:underline dark:text-stone-300 dark:hover:text-amber-400"
                  >
                    {dict.guides.specialtyGuides[key]} →
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <LasersBrowse
        entries={entries}
        locale={locale}
        dict={dict}
        initialType={laserType}
        title={`${label} · ${dict.lasers.title.toLowerCase()}`}
        description={interpolate(dict.lasers.typePageIntro, {
          type: label.toLowerCase(),
        })}
      />
      <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        {typeCount} / {allCount} {dict.lasers.lines}
      </p>
    </div>
  );
}
