import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TransparencyContent } from "@/components/pages/TransparencyContent";
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
    path: "/transparency",
    title: dict.transparency.title,
    description: dict.transparency.subtitle,
  });
}

export default async function TransparencyPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <InfoPageLayout
      locale={locale}
      dict={dict}
      eyebrow={dict.transparency.eyebrow}
      title={dict.transparency.title}
      subtitle={dict.transparency.subtitle}
      related={[...trustRelatedLinks(dict), ...legalRelatedLinks(dict)]}
    >
      <TransparencyContent locale={locale} dict={dict} />
    </InfoPageLayout>
  );
}
