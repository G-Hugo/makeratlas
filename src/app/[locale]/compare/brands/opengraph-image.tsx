import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllResolvedBrandDuels } from "@/lib/compare-brand-duels";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas — brand comparisons";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dict = getDictionary(locale);
  const featured = getAllResolvedBrandDuels(locale).slice(0, 4);

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
        {dict.brandDuel.indexTitle}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 26,
          color: OG_COLORS.muted,
          maxWidth: 900,
          lineHeight: 1.35,
        }}
      >
        {dict.brandDuel.indexDescription}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 40 }}>
        {featured.map((duel) => (
          <div key={duel.param} style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: OG_COLORS.amber,
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
              {duel.brands[0].name} vs {duel.brands[1].name}
            </div>
          </div>
        ))}
      </div>
    </OgShell>,
  );
}
