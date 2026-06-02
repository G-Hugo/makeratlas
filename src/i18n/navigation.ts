import type { Locale } from "./config";

/** Prefix an app path with locale (path must start with /). */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** Strip locale prefix from pathname, e.g. /fr/lasers → /lasers */
export function stripLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(en|fr)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] || "/";
}
