import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LaserType } from "@/types/machine";

export function laserTypeLabelLocalized(
  type: LaserType | string,
  dict: Dictionary,
): string {
  const key = type as keyof Dictionary["laserTypes"];
  return dict.laserTypes[key] ?? type;
}

/** Rewrite internal markdown links for the active locale */
export function localizeGuideMarkdown(content: string, locale: Locale): string {
  return content
    .replace(/\]\(\/guides\//g, `](/${locale}/guides/`)
    .replace(/\]\(\/lasers\//g, `](/${locale}/lasers/`)
    .replace(/\]\(\/compare\)/g, `](/${locale}/compare)`)
    .replace(/\]\(\/methodology\)/g, `](/${locale}/methodology)`)
    .replace(/\]\(\/transparency\)/g, `](/${locale}/transparency)`)
    .replace(/\]\(\/about\)/g, `](/${locale}/about)`)
    .replace(/\]\(\/legal\)/g, `](/${locale}/legal)`)
    .replace(/\]\(\/privacy\)/g, `](/${locale}/privacy)`)
    .replace(/\]\(\/cookies\)/g, `](/${locale}/cookies)`);
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}
