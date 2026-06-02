import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MachineDetailView } from "@/components/machines/MachineDetailView";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
  machineJsonLd,
} from "@/components/seo/JsonLd";
import { getCatalogRedirectSlug } from "@/lib/catalog";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { getPrimaryImage } from "@/lib/machine-images";
import { buildMachineMetadata } from "@/lib/seo";
import { hasMachineTranslation } from "@/lib/machine-locale";
import { getAllMachines, getMachineBySlug, getSimilarMachines } from "@/lib/content";
import { getPowerTiersForMachine } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllMachines().map((machine) => ({ locale, slug: machine.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return { title: "Not found" };
  const locale = localeParam as Locale;
  const machine = getMachineBySlug(slug, locale);
  if (!machine) return { title: locale === "fr" ? "Introuvable" : "Not found" };

  const redirectSlug = getCatalogRedirectSlug(machine, locale);
  if (redirectSlug && redirectSlug !== slug) {
    const target = getMachineBySlug(redirectSlug, locale);
    if (target) return buildMachineMetadata(target);
  }

  return buildMachineMetadata(machine);
}

export default async function MachinePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  const m = dict.machine;

  const machine = getMachineBySlug(slug, locale);
  if (!machine) notFound();

  const redirectSlug = getCatalogRedirectSlug(machine, locale);
  if (redirectSlug && redirectSlug !== slug) {
    redirect(localizedPath(locale, `/lasers/${redirectSlug}`));
  }

  const powerTiers = getPowerTiersForMachine(machine, locale);
  const tiers = powerTiers.length > 0 ? powerTiers : [machine];
  const catalogPrimaryMachine = tiers.find((t) => t.catalogPrimary) ?? tiers[0];
  const cardHeroSrc = getPrimaryImage(catalogPrimaryMachine);
  const similarBySlug = Object.fromEntries(
    tiers.map((tier) => [tier.slug, getSimilarMachines(tier, locale)]),
  );
  const hasTranslationBySlug = Object.fromEntries(
    tiers.map((tier) => [tier.slug, hasMachineTranslation(tier.slug)]),
  );

  return (
    <>
      <JsonLd data={machineJsonLd(machine)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: m.breadcrumbLasers, path: localizedPath(locale, "/lasers") },
          {
            name: laserTypeLabelLocalized(machine.laserType, dict),
            path: localizedPath(locale, `/lasers/type/${machine.laserType}`),
          },
          { name: machine.name, path: localizedPath(locale, `/lasers/${machine.slug}`) },
        ])}
      />
      {machine.faq && machine.faq.length > 0 && (
        <JsonLd data={faqJsonLd(machine.faq)} />
      )}
      <MachineDetailView
        locale={locale}
        dict={dict}
        initialSlug={slug}
        tiers={tiers}
        cardHeroSrc={cardHeroSrc}
        similarBySlug={similarBySlug}
        hasTranslationBySlug={hasTranslationBySlug}
      />
    </>
  );
}
