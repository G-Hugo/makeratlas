import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { powerTierLabel } from "@/lib/catalog-display";

interface PowerTierChipsProps {
  tiers: Machine[];
  /** Highlight this slug (detail page). Omit on catalog cards. */
  activeSlug?: string;
  /** Link chips on cards; on detail page use onSelectTier instead */
  linkable?: boolean;
  /** Detail page: switch variant in-page + update URL */
  onSelectTier?: (slug: string) => void;
  size?: "sm" | "md";
  locale?: Locale;
}

export function PowerTierChips({
  tiers,
  activeSlug,
  linkable = true,
  onSelectTier,
  size = "sm",
  locale = "en",
}: PowerTierChipsProps) {
  if (tiers.length <= 1) return null;

  const pad = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <div className="flex flex-wrap gap-1.5" role="list">
      {tiers.map((tier) => {
        const label = powerTierLabel(tier, locale);
        const isActive = tier.slug === activeSlug;
        const className = `${pad} rounded-full font-semibold transition ${
          isActive
            ? "bg-amber-500 text-white"
            : "bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-amber-950 dark:hover:text-amber-300"
        }`;

        if (onSelectTier) {
          if (isActive) {
            return (
              <span
                key={tier.slug}
                className={className}
                role="listitem"
                aria-current="true"
              >
                {label}
              </span>
            );
          }
          return (
            <button
              key={tier.slug}
              type="button"
              onClick={() => onSelectTier(tier.slug)}
              className={className}
              role="listitem"
            >
              {label}
            </button>
          );
        }

        if (linkable && !isActive) {
          return (
            <LocaleLink
              key={tier.slug}
              href={`/lasers/${tier.slug}`}
              locale={locale}
              className={className}
              role="listitem"
            >
              {label}
            </LocaleLink>
          );
        }

        return (
          <span
            key={tier.slug}
            className={className}
            role="listitem"
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
