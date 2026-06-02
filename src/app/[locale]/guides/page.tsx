import type { Metadata } from "next";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getAllGuidesMeta } from "@/lib/content";
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
  return { title: dict.guides.title, description: dict.guides.description };
}

export default async function GuidesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const guides = getAllGuidesMeta(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader title={dict.guides.title} description={dict.guides.description}>
        <LocaleLink
          href="/guides/laser-safety-basics"
          locale={locale}
          className="mt-6 inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 transition hover:border-red-300 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200 dark:hover:border-red-800 dark:hover:bg-red-950"
        >
          ⚠ {dict.guides.safetyBanner}
        </LocaleLink>
      </PageHeader>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {guides.map((guide) => (
          <LocaleLink
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            locale={locale}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
              {guide.category.replace("-", " ")} · {guide.readTime}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{guide.title}</h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{guide.description}</p>
          </LocaleLink>
        ))}
      </div>
    </div>
  );
}
