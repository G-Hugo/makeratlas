import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineImage } from "@/components/machines/MachineImage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import type { BrandProfile } from "@/types/brand";
import type { LaserType, Machine } from "@/types/machine";

interface BrandProfilePanelProps {
  brand: BrandProfile;
  flagship?: Machine;
  locale: Locale;
  dict: Dictionary;
}

function BulletList({
  items,
  variant,
}: {
  items: string[];
  variant: "strength" | "weakness";
}) {
  const iconClass =
    variant === "strength"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
      : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300";

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconClass}`}
            aria-hidden
          >
            {variant === "strength" ? "+" : "−"}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BrandProfilePanel({ brand, flagship, locale, dict }: BrandProfilePanelProps) {
  const b = dict.brands;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:border-stone-800 dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-950">
        <div className="border-b border-amber-200/80 px-6 py-5 dark:border-amber-900/50">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            {b.knownForLabel}
          </p>
          <p className="mt-2 text-xl font-semibold leading-snug text-stone-900 dark:text-stone-100 sm:text-2xl">
            {brand.knownFor}
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-4 text-stone-700 dark:text-stone-300">
            {brand.overview.map((paragraph, i) => (
              <p key={i} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white/80 p-4 text-sm dark:border-stone-700 dark:bg-stone-950/80 lg:min-w-[220px]">
            {brand.headquarters && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {b.headquarters}
                </p>
                <p className="mt-1 text-stone-800 dark:text-stone-200">{brand.headquarters}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {b.catalogOnAtlas}
              </p>
              <p className="mt-1 text-stone-800 dark:text-stone-200">
                {brand.lineCount}{" "}
                {brand.lineCount === 1 ? b.lineSingular : b.linePlural}
              </p>
            </div>
            {brand.laserTypes.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {b.laserTypesLabel}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {brand.laserTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    >
                      {laserTypeLabelLocalized(type as LaserType, dict)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center rounded-lg border border-stone-300 px-3 py-2 text-center font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-800 dark:border-stone-600 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:text-amber-300"
              >
                {b.visitWebsite} ↗
              </a>
            )}
          </aside>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{b.strengthsTitle}</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{b.strengthsSubtitle}</p>
          <div className="mt-5">
            <BulletList items={brand.strengths} variant="strength" />
          </div>
        </section>

        <section className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-6 dark:border-rose-900/40 dark:bg-rose-950/15">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{b.weaknessesTitle}</h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{b.weaknessesSubtitle}</p>
          <div className="mt-5">
            <BulletList items={brand.weaknesses} variant="weakness" />
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white dark:border-amber-900/50 dark:bg-stone-900">
        <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            {b.flagshipLabel}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">{brand.flagship.name}</h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,280px)_1fr] md:items-center">
          {flagship ? (
            <LocaleLink
              href={`/lasers/${brand.flagship.machineSlug}`}
              locale={locale}
              className="block overflow-hidden rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-950"
            >
              <MachineImage machine={flagship} className="aspect-[4/3] w-full" sizes="280px" priority />
            </LocaleLink>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-400">
              {brand.flagship.name}
            </div>
          )}

          <div>
            <p className="text-base leading-relaxed text-stone-700 dark:text-stone-300">
              {brand.flagship.summary}
            </p>
            <LocaleLink
              href={`/lasers/${brand.flagship.machineSlug}`}
              locale={locale}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {b.flagshipCta} →
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
}
