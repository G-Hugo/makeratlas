import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllResolvedDuels } from "@/lib/compare-duels";
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
export const alt = "Maker Atlas — laser comparator";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dict = getDictionary(locale);
  const featured = getAllResolvedDuels(locale).slice(0, 3);

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
        {dict.compare.title}
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
        {dict.compare.description}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 36 }}>
        {featured.map((duel) => (
          <div
            key={duel.param}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}
          >
            <div style={{ display: "flex", fontSize: 28, fontWeight: 700, width: 620 }}>
              {duel.machines[0].name} vs {duel.machines[1].name}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <OgScore score={duel.machines[0].rating.overall} size={26} />
              <div style={{ display: "flex", fontSize: 22, color: OG_COLORS.muted }}>·</div>
              <OgScore score={duel.machines[1].rating.overall} size={26} />
            </div>
          </div>
        ))}
      </div>
    </OgShell>,
  );
}
