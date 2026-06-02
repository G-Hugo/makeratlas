import type { Locale } from "@/i18n/config";

const DATE_LOCALE: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
};

/** Format ISO date (YYYY-MM or YYYY-MM-DD) for display on detail pages */
export function formatReleaseDate(iso: string, locale: Locale = "en"): string {
  return formatContentDate(iso, locale, { includeDay: true });
}

/** Profile / guide "last updated" line */
export function formatLastUpdated(iso: string, locale: Locale = "en"): string {
  return formatContentDate(iso, locale, { includeDay: true });
}

function formatContentDate(
  iso: string,
  locale: Locale,
  options: { includeDay?: boolean } = {},
): string {
  const parts = iso.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  if (!year || Number.isNaN(year)) return iso;

  if (!month || Number.isNaN(month)) {
    return String(year);
  }

  const day = parts[2];
  const hasDay = Boolean(day && !Number.isNaN(day) && options.includeDay);

  const date = hasDay
    ? new Date(Date.UTC(year, month - 1, day))
    : new Date(Date.UTC(year, month - 1, 1));

  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    month: "long",
    year: "numeric",
    ...(hasDay ? { day: "numeric" } : {}),
  }).format(date);
}
