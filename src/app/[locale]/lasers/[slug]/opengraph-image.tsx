import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getMachineBySlug } from "@/lib/content";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgScore,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";
import { formatPriceRange } from "@/lib/pricing";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas — laser engraver profile";

interface ImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const machine = getMachineBySlug(slug, locale);
  const dict = getDictionary(locale);

  if (!machine) {
    return ogImageResponse(
      <OgShell footer="maker-atlas.com">
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>Maker Atlas</div>
      </OgShell>,
    );
  }

  const price = formatPriceRange(
    machine.priceRange.min,
    machine.priceRange.max,
    locale === "fr" ? "EUR" : "USD",
  );
  const meta = [
    machine.brand,
    laserTypeLabelLocalized(machine.laserType, dict),
    locale === "fr" ? `≈ ${price}` : price,
  ].join("  ·  ");
  const footer =
    locale === "fr"
      ? "maker-atlas.com · avis et fiches techniques honnêtes"
      : "maker-atlas.com · honest reviews & specs";

  return ogImageResponse(
    <OgShell footer={footer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 800 }}>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 700, lineHeight: 1.1 }}>
            {machine.name}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: OG_COLORS.muted }}>{meta}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 220,
            height: 220,
            borderRadius: 220,
            border: `6px solid ${OG_COLORS.amber}`,
            flexShrink: 0,
          }}
        >
          <OgScore score={machine.rating.overall} size={64} />
        </div>
      </div>
    </OgShell>,
  );
}
