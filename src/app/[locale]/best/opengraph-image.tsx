import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BEST_OF_CATEGORIES, getBestOfRanking } from "@/lib/best-of";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas — laser rankings";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dict = getDictionary(locale);

  const featured = BEST_OF_CATEGORIES.slice(0, 4);

  return ogImageResponse(
    <OgShell
      footer={
        locale === "fr"
          ? "maker-atlas.com · classements honnêtes, aucun placement sponsorisé"
          : "maker-atlas.com · honest rankings, no sponsored placements"
      }
    >
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
        {dict.bestOf.indexTitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
        {featured.map((category) => {
          const top = getBestOfRanking(category, locale)[0]?.entry;
          return (
            <div
              key={category.slug}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}
            >
              <div style={{ display: "flex", fontSize: 30, fontWeight: 700, width: 720 }}>
                {category.copy[locale].title}
              </div>
              {top && (
                <div style={{ display: "flex", fontSize: 24, color: OG_COLORS.muted }}>
                  #1 · {top.displayName}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </OgShell>,
  );
}
