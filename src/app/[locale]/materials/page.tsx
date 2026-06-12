import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import {
  MATERIAL_LASER_TYPES,
  MATERIALS_MATRIX,
  type MaterialCapability,
} from "@/lib/materials-matrix";
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
    path: "/materials",
    title: dict.materialsPage.title,
    description: dict.materialsPage.description,
  });
}

const CAPABILITY_STYLE: Record<MaterialCapability, string> = {
  both: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
  engrave: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  no: "bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:text-rose-300",
};

const CAPABILITY_SYMBOL: Record<MaterialCapability, string> = {
  both: "✓✓",
  engrave: "✓",
  no: "✕",
};

export default async function MaterialsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const m = dict.materialsPage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={m.title} description={m.intro} />

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm dark:border-stone-700 dark:bg-stone-900">
        <span className="font-medium text-stone-700 dark:text-stone-200">{m.legendTitle}</span>
        <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${CAPABILITY_STYLE.both}`}>
            {CAPABILITY_SYMBOL.both}
          </span>
          {m.legendBoth}
        </span>
        <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${CAPABILITY_STYLE.engrave}`}>
            {CAPABILITY_SYMBOL.engrave}
          </span>
          {m.legendEngrave}
        </span>
        <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
          <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${CAPABILITY_STYLE.no}`}>
            {CAPABILITY_SYMBOL.no}
          </span>
          {m.legendNo}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
                <th className="sticky left-0 z-10 min-w-[12rem] bg-stone-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                  {m.tableMaterial}
                </th>
                {MATERIAL_LASER_TYPES.map((type) => (
                  <th key={type} className="px-4 py-3 text-center text-sm font-semibold">
                    <LocaleLink
                      href={`/lasers/type/${type}`}
                      locale={locale}
                      className="text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
                    >
                      {laserTypeLabelLocalized(type, dict)}
                    </LocaleLink>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATERIALS_MATRIX.map((row) => (
                <tr key={row.id} className="border-b border-stone-100 dark:border-stone-800/80">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3.5 dark:bg-stone-900">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                      {row.label[locale]}
                    </p>
                    {row.note && (
                      <p className="mt-1 max-w-xs text-xs leading-snug text-stone-500 dark:text-stone-400">
                        {row.note[locale]}
                      </p>
                    )}
                  </td>
                  {MATERIAL_LASER_TYPES.map((type) => {
                    const capability = row.capability[type];
                    return (
                      <td key={type} className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${CAPABILITY_STYLE[capability]}`}
                          title={
                            capability === "both"
                              ? m.legendBoth
                              : capability === "engrave"
                                ? m.legendEngrave
                                : m.legendNo
                          }
                        >
                          {CAPABILITY_SYMBOL[capability]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <LocaleLink
          href="/guides/laser-materials-by-type"
          locale={locale}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {m.guideCta}
        </LocaleLink>
        {MATERIAL_LASER_TYPES.map((type) => (
          <LocaleLink
            key={type}
            href={`/lasers/type/${type}`}
            locale={locale}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-amber-700"
          >
            {interpolate(m.browseCta, { type: laserTypeLabelLocalized(type, dict) })}
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
