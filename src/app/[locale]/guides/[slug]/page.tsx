import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/guides/MarkdownContent";
import { ContentFreshness } from "@/components/content/ContentFreshness";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { guideJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizeGuideMarkdown } from "@/lib/i18n-helpers";
import { getAllGuidesMeta, getGuideBySlug } from "@/lib/content";
import { buildGuideMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllGuidesMeta(locale).map((guide) => ({ locale, slug: guide.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return { title: "Not found" };
  const guide = getGuideBySlug(slug, localeParam);
  if (!guide) return { title: localeParam === "fr" ? "Introuvable" : "Not found" };

  return buildGuideMetadata(guide, localeParam);
}

export default async function GuidePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const guide = getGuideBySlug(slug, locale);
  if (!guide) notFound();

  const content = localizeGuideMarkdown(guide.content, locale);

  return (
    <>
      <JsonLd data={guideJsonLd(guide, locale)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-stone-500 dark:text-stone-400">
          <LocaleLink href="/guides" locale={locale} className="hover:text-amber-700 dark:hover:text-amber-400">
            {dict.guides.title}
          </LocaleLink>
          <span className="mx-2">/</span>
          <span className="text-stone-800 dark:text-stone-200">{guide.title}</span>
        </nav>

        <ContentFreshness
          lastUpdated={guide.lastUpdated}
          locale={locale}
          dict={dict.freshness}
          className="mt-1"
        />
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{guide.readTime}</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-lg text-stone-600 dark:text-stone-400">{guide.description}</p>

        <div className="mt-10">
          <MarkdownContent content={content} />
        </div>
      </div>
    </>
  );
}
