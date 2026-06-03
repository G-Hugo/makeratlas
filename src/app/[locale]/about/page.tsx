import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutContent } from "@/components/pages/AboutContent";
import {
  InfoPageLayout,
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
    path: "/about",
    title: dict.about.title,
    description: dict.about.subtitle,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <InfoPageLayout
      locale={locale}
      dict={dict}
      eyebrow={dict.about.eyebrow}
      title={dict.about.title}
      subtitle={dict.about.subtitle}
      related={trustRelatedLinks(dict)}
    >
      <AboutContent locale={locale} dict={dict} />
    </InfoPageLayout>
  );
}
