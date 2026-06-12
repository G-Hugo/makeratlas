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
export const alt = "Maker Atlas — laser finder quiz";

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dict = getDictionary(locale);

  const steps =
    locale === "fr"
      ? ["Usage", "Matériaux", "Budget", "Expérience"]
      : ["Usage", "Materials", "Budget", "Experience"];

  return ogImageResponse(
    <OgShell footer="maker-atlas.com">
      <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
        {dict.finder.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 32,
          fontSize: 28,
          color: OG_COLORS.muted,
          maxWidth: 900,
          lineHeight: 1.35,
        }}
      >
        {dict.finder.description}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
        {steps.map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 22px",
              borderRadius: 999,
              background: i === 0 ? OG_COLORS.amber : OG_COLORS.bgSoft,
              color: i === 0 ? "#ffffff" : OG_COLORS.muted,
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {i + 1}. {step}
          </div>
        ))}
      </div>
    </OgShell>,
  );
}
