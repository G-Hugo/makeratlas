import type { Locale } from "@/i18n/config";
import type { Machine } from "@/types/machine";
import { LocaleLink } from "@/components/layout/LocaleLink";
import {
  getTierChipVariant,
  powerTierLabel,
  TIER_CHIP_STYLES,
  type TierChipVariant,
} from "@/lib/catalog-display";

interface PowerTierChipsProps {
  tiers: Machine[];
  /** Highlight this slug (detail page). Omit on catalog cards. */
  activeSlug?: string;
  /** Link chips on cards; on detail page use onSelectTier instead */
  linkable?: boolean;
  /** Detail page: switch variant in-page + update URL */
  onSelectTier?: (slug: string) => void;
  /** Catalog: e.g. save list scroll before navigating to a tier */
  onTierNavigate?: (slug: string) => void;
  /** Amber = watt SKUs; sky = interchangeable modules (auto-detected if omitted) */
  variant?: TierChipVariant;
  size?: "sm" | "md";
  locale?: Locale;
}

export function PowerTierChips({
  tiers,
  activeSlug,
  linkable = true,
  onSelectTier,
  onTierNavigate,
  variant: variantProp,
  size = "sm",
  locale = "en",
}: PowerTierChipsProps) {
  if (tiers.length <= 1) return null;

  const variant = variantProp ?? getTierChipVariant(tiers);
  const styles = TIER_CHIP_STYLES[variant];
  const pad = size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <div className="flex flex-wrap gap-1.5" role="list">
      {tiers.map((tier) => {
        const label = powerTierLabel(tier, locale, tiers);
        const isActive = tier.slug === activeSlug;
        const className = `${pad} rounded-full font-semibold no-underline transition ${
          isActive ? styles.active : styles.idle
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
              onClick={() => onTierNavigate?.(tier.slug)}
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
