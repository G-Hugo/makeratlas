import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandsIndex } from "@/components/brands/BrandsIndex";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllBrandProfiles } from "@/lib/brands";
import { interpolate } from "@/lib/i18n-helpers";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const dict = getDictionary(localeParam);
  const brands = getAllBrandProfiles(localeParam as Locale);
  return buildPageMetadata({
    locale: localeParam,
    path: "/brands",
    title: dict.brands.title,
    description: interpolate(dict.brands.description, { count: brands.length }),
  });
}

export default async function BrandsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const brands = getAllBrandProfiles(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <BrandsIndex brands={brands} locale={locale} dict={dict} />
    </div>
  );
}
