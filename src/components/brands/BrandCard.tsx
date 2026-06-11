import { BrandLogo } from "@/components/brands/BrandLogo";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import type { BrandProfile } from "@/types/brand";
import type { LaserType } from "@/types/machine";

interface BrandCardProps {
  brand: BrandProfile;
  locale: Locale;
  dict: Dictionary;
}

export function BrandCard({ brand, locale, dict }: BrandCardProps) {
  const b = dict.brands;

  return (
    <LocaleLink
      href={`/brands/${brand.slug}`}
      locale={locale}
      className="group flex flex-col rounded-xl border border-stone-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-amber-800"
    >
      <div className="flex items-start gap-4">
        <BrandLogo name={brand.name} src={brand.logoSrc} size="card" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400">
                {brand.name}
              </h2>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {brand.lineCount}{" "}
                {brand.lineCount === 1 ? b.lineSingular : b.linePlural}
              </p>
            </div>
            {brand.website && (
              <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                {b.officialSite}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium leading-snug text-stone-800 dark:text-stone-200">
        {brand.knownFor}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        {brand.tagline}
      </p>
      {brand.laserTypes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {brand.laserTypes.map((type) => (
            <span
              key={type}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
            >
              {laserTypeLabelLocalized(type as LaserType, dict)}
            </span>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm font-medium text-amber-700 group-hover:underline dark:text-amber-400">
        {b.viewBrand} →
      </p>
    </LocaleLink>
  );
}

