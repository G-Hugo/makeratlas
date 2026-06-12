import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgShell,
  ogImageResponse,
} from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Maker Atlas";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dict = getDictionary(locale);

  const subtitle =
    locale === "fr"
      ? "Fiches honnêtes, comparateur, quiz et classements"
      : "Honest specs, comparator, quiz, and rankings";

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
        {dict.meta.siteName}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 34,
          color: OG_COLORS.amber,
          fontWeight: 700,
          maxWidth: 900,
          lineHeight: 1.25,
        }}
      >
        {dict.meta.siteTagline}
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
    </OgShell>,
  );
}
