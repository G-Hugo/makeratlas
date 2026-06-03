import type { Metadata } from "next";
import { ComparePageClient } from "@/components/machines/ComparePageClient";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getIndexableMachines } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

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
    path: "/compare",
    title: dict.compare.title,
    description: dict.compare.description,
  });
}

export default async function ComparePage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const machines = getIndexableMachines(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={dict.compare.title} description={dict.compare.description} />
      <div className="mt-10">
        <ComparePageClient machines={machines} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
