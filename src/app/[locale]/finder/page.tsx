import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LaserFinderQuiz } from "@/components/finder/LaserFinderQuiz";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getFinderMachines } from "@/lib/finder";
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
    path: "/finder",
    title: dict.finder.title,
    description: dict.finder.description,
  });
}

export default async function FinderPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const machines = getFinderMachines(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={dict.finder.title} description={dict.finder.description} />
      <div className="mt-10">
        <LaserFinderQuiz machines={machines} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
