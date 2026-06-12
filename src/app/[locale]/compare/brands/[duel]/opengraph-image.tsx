import { isLocale, type Locale } from "@/i18n/config";
import { resolveBrandDuel } from "@/lib/compare-brand-duels";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas — brand comparison";

interface ImageProps {
  params: Promise<{ locale: string; duel: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam, duel: duelSlug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const duel = resolveBrandDuel(duelSlug, locale);

  const subtitle =
    locale === "fr"
      ? "Quelle marque choisir ? Positionnement, gamme et modèles phares"
      : "Which brand to choose? Positioning, lineup, and flagship picks";

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      {duel ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 36,
            }}
          >
            <div style={{ display: "flex", fontSize: 56, fontWeight: 700, width: 440 }}>
              {duel.brands[0].name}
            </div>
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: 104,
                background: OG_COLORS.amber,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 700,
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              VS
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 700,
                width: 440,
                justifyContent: "flex-end",
                textAlign: "right",
              }}
            >
              {duel.brands[1].name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 26,
              color: OG_COLORS.muted,
            }}
          >
            {subtitle}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>Maker Atlas</div>
      )}
    </OgShell>,
  );
}
