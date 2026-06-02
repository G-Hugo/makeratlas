import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatLastUpdated } from "@/lib/machine-dates";
import { LocaleLink } from "@/components/layout/LocaleLink";

interface ContentFreshnessProps {
  lastUpdated: string;
  locale: Locale;
  dict: Dictionary["freshness"];
  className?: string;
}

export function ContentFreshness({
  lastUpdated,
  locale,
  dict,
  className = "",
}: ContentFreshnessProps) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-500 ${className}`}
    >
      <span>
        {dict.lastUpdated}{" "}
        <time dateTime={lastUpdated}>{formatLastUpdated(lastUpdated, locale)}</time>
      </span>
      <span className="text-stone-300" aria-hidden>
        ·
      </span>
      <LocaleLink href="/methodology" locale={locale} className="font-medium text-amber-700 hover:underline">
        {dict.howWeEvaluate}
      </LocaleLink>
    </p>
  );
}
