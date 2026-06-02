import type { Locale } from "@/i18n/config";
import { formatDualPriceRange } from "@/lib/pricing";

interface DualPriceProps {
  min: number;
  max: number;
  locale?: Locale;
  /** Stack secondary currency under primary (default) or inline for tables */
  layout?: "stack" | "inline";
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  /** @deprecated use primaryClassName */
  usdClassName?: string;
  /** @deprecated use secondaryClassName */
  eurClassName?: string;
}

export function DualPrice({
  min,
  max,
  locale = "en",
  layout = "stack",
  className = "",
  primaryClassName,
  usdClassName,
}: DualPriceProps) {
  const { usd, eurApprox } = formatDualPriceRange(min, max);
  const primary = locale === "fr" ? eurApprox : usd;
  const primaryCls = primaryClassName ?? usdClassName ?? "";

  if (layout === "inline") {
    return (
      <span className={className}>
        <span className={primaryCls}>{primary}</span>
      </span>
    );
  }

  return (
    <div className={className}>
      <p className={primaryCls}>{primary}</p>
    </div>
  );
}
