import { isLocale, type Locale } from "@/i18n/config";
import { resolveDuel } from "@/lib/compare-duels";
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
export const alt = "Maker Atlas — laser comparison";

interface ImageProps {
  params: Promise<{ locale: string; duel: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam, duel: duelSlug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const duel = resolveDuel(duelSlug, locale);

  const subtitle =
    locale === "fr" ? "Comparatif côte à côte, spec par spec" : "Side-by-side, spec-by-spec comparison";

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 36,
        }}
      >
        {duel ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                width: 440,
              }}
            >
              <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>
                {duel.machines[0].name}
              </div>
              <OgScore score={duel.machines[0].rating.overall} />
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
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 14,
                width: 440,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 52,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  textAlign: "right",
                }}
              >
                {duel.machines[1].name}
              </div>
              <OgScore score={duel.machines[1].rating.overall} />
            </div>
          </>
        ) : (
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>Maker Atlas</div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 42,
          fontSize: 28,
          color: OG_COLORS.muted,
        }}
      >
        {subtitle}
      </div>
    </OgShell>,
  );
}
