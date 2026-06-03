import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalContent } from "@/components/pages/LegalContent";
import {
  InfoPageLayout,
  legalRelatedLinks,
  trustRelatedLinks,
} from "@/components/pages/InfoPageLayout";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  return buildPageMetadata({
    locale: localeParam,
    path: "/privacy",
    title: dict.legal.privacy.title,
    description: dict.legal.privacy.subtitle,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <InfoPageLayout
      locale={locale}
      dict={dict}
      eyebrow={dict.footer.legalLinks}
      title={dict.legal.privacy.title}
      subtitle={dict.legal.privacy.subtitle}
      related={[...legalRelatedLinks(dict), ...trustRelatedLinks(dict)]}
    >
      <LegalContent page="privacy" dict={dict} />
    </InfoPageLayout>
  );
}
