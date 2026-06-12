import { isLocale, type Locale } from "@/i18n/config";
import { getBestOfCategory, getBestOfRanking } from "@/lib/best-of";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgScore,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas — laser rankings";

interface ImageProps {
  params: Promise<{ locale: string; category: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam, category: categorySlug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const category = getBestOfCategory(categorySlug);
  const ranking = category ? getBestOfRanking(category, locale).slice(0, 3) : [];
  const title = category ? category.copy[locale].title : "Maker Atlas";

  return ogImageResponse(
    <OgShell
      footer={
        locale === "fr"
          ? "maker-atlas.com · classements honnêtes, aucun placement sponsorisé"
          : "maker-atlas.com · honest rankings, no sponsored placements"
      }
    >
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 40 }}>
        {ranking.map(({ rank, entry }) => (
          <div
            key={entry.primary.slug}
            style={{ display: "flex", alignItems: "center", gap: 22 }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 56,
                background: rank === 1 ? OG_COLORS.amber : "#44403c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              {rank}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 38,
                fontWeight: rank === 1 ? 700 : 400,
                width: 760,
              }}
            >
              {entry.displayName}
            </div>
            <OgScore score={entry.primary.rating.overall} size={30} />
          </div>
        ))}
      </div>
    </OgShell>,
  );
}
