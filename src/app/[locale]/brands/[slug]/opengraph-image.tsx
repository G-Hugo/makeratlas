import { isLocale, type Locale } from "@/i18n/config";
import { getBrandBySlug, getCatalogEntriesByBrand } from "@/lib/brands";
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
export const alt = "Maker Atlas — laser brand profile";

interface ImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const brand = getBrandBySlug(slug, locale);

  if (!brand) {
    return ogImageResponse(
      <OgShell footer="maker-atlas.com">
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700 }}>Maker Atlas</div>
      </OgShell>,
    );
  }

  const entries = getCatalogEntriesByBrand(slug, locale);
  const avgScore =
    entries.length > 0
      ? entries.reduce((sum, e) => sum + e.primary.rating.overall, 0) / entries.length
      : 0;
  const footer =
    locale === "fr"
      ? `maker-atlas.com · ${brand.lineCount} gammes · avis honnêtes`
      : `maker-atlas.com · ${brand.lineCount} model lines · honest reviews`;

  return ogImageResponse(
    <OgShell footer={footer}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>
          {brand.name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: OG_COLORS.muted, lineHeight: 1.35 }}>
          {brand.knownFor}
        </div>
      </div>
      {avgScore > 0 && (
        <div style={{ display: "flex", marginTop: 40, alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 24, color: OG_COLORS.muted }}>
            {locale === "fr" ? "Note moyenne du catalogue" : "Average catalog score"}
          </div>
          <OgScore score={avgScore} size={42} />
        </div>
      )}
    </OgShell>,
  );
}
