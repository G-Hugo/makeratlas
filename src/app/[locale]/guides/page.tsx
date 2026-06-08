import type { Metadata } from "next";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { PageHeader } from "@/components/pages/PageHeader";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/dictionaries/types";
import {
  GUIDE_INDEX_SECTIONS,
  LASER_TYPE_GUIDE_SLUG,
  SETUP_GUIDE_ORDER,
  SPECIALTY_BUYER_SLUGS,
  SPECIALTY_TECH_SLUGS,
  getAllGuidesMeta,
  guideIndexSectionFor,
  type GuideIndexSection,
} from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import type { GuideMeta } from "@/types/machine";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TYPE_GUIDE_ORDER = Object.values(LASER_TYPE_GUIDE_SLUG);

function sectionTitle(section: GuideIndexSection, guides: Dictionary["guides"]): string {
  switch (section) {
    case "overview":
      return guides.sectionOverview;
    case "byType":
      return guides.sectionByType;
    case "specialtyTech":
      return guides.sectionSpecialtyTech;
    case "specialtyBuyer":
      return guides.sectionSpecialtyBuyer;
    case "buying":
      return guides.sectionBuying;
    case "safetySetup":
      return guides.sectionSafetySetup;
  }
}

function guideCategoryLabel(category: GuideMeta["category"], dict: Dictionary): string {
  switch (category) {
    case "buying-guide":
      return dict.guides.categoryBuying;
    case "safety":
      return dict.guides.categorySafety;
    case "laser-types":
      return dict.guides.categoryTypes;
    case "setup":
      return dict.guides.categorySetup;
    case "specialty":
      return dict.guides.categorySpecialty;
    default:
      return category.replace("-", " ");
  }
}

function sortGuidesForSection(section: GuideIndexSection, guides: GuideMeta[]): GuideMeta[] {
  if (section === "byType") {
    return [...guides].sort(
      (a, b) => TYPE_GUIDE_ORDER.indexOf(a.slug) - TYPE_GUIDE_ORDER.indexOf(b.slug),
    );
  }
  if (section === "specialtyTech") {
    return [...guides].sort(
      (a, b) => SPECIALTY_TECH_SLUGS.indexOf(a.slug) - SPECIALTY_TECH_SLUGS.indexOf(b.slug),
    );
  }
  if (section === "specialtyBuyer") {
    return [...guides].sort(
      (a, b) => SPECIALTY_BUYER_SLUGS.indexOf(a.slug) - SPECIALTY_BUYER_SLUGS.indexOf(b.slug),
    );
  }
  if (section === "safetySetup") {
    return [...guides].sort(
      (a, b) => SETUP_GUIDE_ORDER.indexOf(a.slug) - SETUP_GUIDE_ORDER.indexOf(b.slug),
    );
  }
  return [...guides].sort((a, b) => a.title.localeCompare(b.title));
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
    path: "/guides",
    title: dict.guides.title,
    description: dict.guides.description,
  });
}

export default async function GuidesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const guides = getAllGuidesMeta(locale);

  const sections = GUIDE_INDEX_SECTIONS.map((section) => ({
    section,
    guides: sortGuidesForSection(
      section,
      guides.filter((guide) => guideIndexSectionFor(guide) === section),
    ),
  })).filter((group) => group.guides.length > 0);

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

      <div className="mt-8 rounded-2xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 to-white p-6 dark:border-amber-800 dark:from-amber-950/40 dark:to-stone-900 sm:p-8">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{dict.guides.hubTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          {dict.guides.hubBody}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <LocaleLink
            href="/guides/understanding-laser-types"
            locale={locale}
            className="inline-flex rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            {dict.guides.hubOverviewCta}
          </LocaleLink>
          <LocaleLink
            href="/lasers"
            locale={locale}
            className="inline-flex rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-amber-400 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-amber-600"
          >
            {dict.guides.hubCatalogCta}
          </LocaleLink>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {sections.map(({ section, guides: sectionGuides }) => (
          <section key={section}>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {sectionTitle(section, dict.guides)}
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {sectionGuides.map((guide) => (
                <LocaleLink
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  locale={locale}
                  className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-amber-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-amber-600"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    {guideCategoryLabel(guide.category, dict)} · {guide.readTime}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    {guide.description}
                  </p>
                </LocaleLink>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
