import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { CatalogEntry } from "@/lib/catalog-types";
import { MachineImage } from "@/components/machines/MachineImage";
import { MachineWorkFocusBadge } from "@/components/machines/MachineWorkFocusBadge";
import { PowerTierChips } from "@/components/machines/PowerTierChips";
import { formatMachinePowerBubble } from "@/lib/power-display";
import { formatMachineLaserLabel } from "@/lib/laser-capabilities";
import { getCatalogCardHero } from "@/lib/machine-images";
import { getMachineWorkFocus } from "@/lib/machine-work-focus";
import { ratingColor } from "@/lib/utils";
import { CatalogCardPrice } from "@/components/pricing/MachinePrice";

interface MachineCardProps {
  entry: CatalogEntry;
  locale: Locale;
  dict: Dictionary;
  /** Save list scroll target before navigating to the detail page. */
  onBeforeNavigate?: (slug: string) => void;
}

function cleanFrenchBubbleText(value: string): string {
  return value
    .replace(/\bFiber\b/g, "Fibre")
    .replace(/\bfiber\b/g, "fibre")
    .replace(/\bCO2\b/g, "CO₂")
    .replace(/\binfrared\b/gi, "infrarouge")
    .replace(/\bhybrid\b/gi, "hybride")
    .replace(/\bconsumer rated\b/gi, "")
    .replace(/\bverify sku\b/gi, "")
    .replace(/\btypical sku\b/gi, "")
    .replace(/\bclaimed\b/gi, "")
    .replace(/\boptical output\b/gi, "")
    .replace(/\bsticker makers?\b/gi, "Créateurs de stickers")
    .replace(/\bcrafters?\b/gi, "Créateurs")
    .replace(/\bmixed media\b/gi, "Multi-matériaux")
    .replace(/\bsign shops?\b/gi, "Ateliers d'enseignes")
    .replace(/\betsy sellers?\b/gi, "Vendeurs Etsy")
    .replace(/\bsmall business\b/gi, "Petite entreprise")
    .replace(/\bbatch production\b/gi, "Production en série")
    .replace(/\bheavy cutting\b/gi, "Découpe intensive")
    .replace(/\blarge panels\b/gi, "Grands panneaux")
    .replace(/\(\s*[^)]*(consumer rated|verify sku|typical sku|claimed|optical output)[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .replace(/[;,]\s*$/g, "")
    .trim();
}

export function MachineCard({ entry, locale, dict, onBeforeNavigate }: MachineCardProps) {
  const { primary, powerTiers, displayName } = entry;
  const multiTier = powerTiers.length > 1;
  const workFocus = getMachineWorkFocus(primary);
  const profileLabel = locale === "fr" ? "Voir la fiche" : "View profile";
  const powerOptionsLabel = locale === "fr" ? "options de puissance" : "power options";
  const releaseLabel = primary.releaseDate
    ? primary.releaseDate.slice(0, 4)
    : dict.lasers.releaseUnknown;
  const workAreaLabel = primary.specs.workArea.split(" (")[0];
  const powerBubbleLabel = formatMachinePowerBubble(primary, locale);
  const cardHeroSrc = getCatalogCardHero(primary);
  const cardImageClassName =
    primary.slug === "acmer-p3"
      ? "object-contain p-1 transition duration-300 group-hover:scale-[1.01]"
      : undefined;
  const interchangeableLabel =
    locale === "fr" ? "Modules interchangeables" : "Interchangeable modules";

  return (
    <LocaleLink
      id={`catalog-card-${primary.slug}`}
      href={`/lasers/${primary.slug}`}
      locale={locale}
      {...(onBeforeNavigate
        ? { onClick: () => onBeforeNavigate(primary.slug) }
        : {})}
      className="group relative flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/5 transition duration-200 hover:-translate-y-1 hover:border-amber-300/80 hover:shadow-xl hover:ring-amber-200/60 dark:border-stone-700 dark:bg-stone-900 dark:ring-stone-950/50 dark:hover:border-amber-500/40 dark:hover:ring-amber-500/20"
    >
      <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300" />
      <div className="relative overflow-hidden">
        <MachineImage
          machine={primary}
          heroSrc={`${cardHeroSrc}?card=9`}
          imageKey={`${primary.slug}:${cardHeroSrc}:card9`}
          qualityClassName={cardImageClassName}
          className="aspect-[4/3] w-full transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-950/5 to-transparent"
          aria-hidden
        />
        <div className="absolute left-3 top-3">
          <MachineWorkFocusBadge focus={workFocus} workFocusDict={dict.workFocus} />
        </div>
        <div
          className={`absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold shadow-sm backdrop-blur-sm dark:bg-stone-900/95 ${ratingColor(primary.rating.overall)}`}
        >
          {primary.rating.overall.toFixed(1)}
        </div>
        <p className="absolute bottom-3 left-3 right-3 text-[11px] font-medium uppercase tracking-wider text-white/90 drop-shadow-sm">
          {primary.brand} · {formatMachineLaserLabel(primary, locale)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold leading-tight text-stone-900 group-hover:text-amber-900 dark:text-stone-100 dark:group-hover:text-amber-400">
              {displayName}
            </h3>
          </div>
          <div className="mt-2">
            {multiTier ? (
              <PowerTierChips tiers={powerTiers} linkable={false} size="sm" locale={locale} />
            ) : (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {powerBubbleLabel}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm font-medium leading-snug text-stone-800 dark:text-stone-200">
          {primary.mainObjective}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
          <span className="rounded-md bg-stone-100 px-2 py-1 dark:bg-stone-800">
            {workAreaLabel}
          </span>
          <span className="rounded-md bg-stone-100 px-2 py-1 dark:bg-stone-800">
            {releaseLabel}
          </span>
          {multiTier && (
            <span className="rounded-md bg-stone-100 px-2 py-1 dark:bg-stone-800">
              {powerTiers.length} {powerOptionsLabel}
            </span>
          )}
          {primary.moduleSystem?.style === "interchangeable" && (
            <span className="rounded-md bg-sky-100 px-2 py-1 font-medium text-sky-900 dark:bg-sky-950 dark:text-sky-200">
              {interchangeableLabel}
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {primary.tldr}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {primary.bestFor.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              {locale === "fr" ? cleanFrenchBubbleText(tag) : tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone-100 pt-3 dark:border-stone-800">
          <CatalogCardPrice entry={entry} locale={locale} />
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900 opacity-0 transition group-hover:opacity-100 dark:bg-amber-950 dark:text-amber-200">
            {profileLabel} →
          </span>
        </div>
      </div>
    </LocaleLink>
  );
}
