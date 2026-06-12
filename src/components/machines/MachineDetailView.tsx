"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RatingDisplay } from "@/components/machines/RatingDisplay";
import { MachineGallery } from "@/components/machines/MachineGallery";
import { PerformanceHighlights } from "@/components/machines/PerformanceHighlights";
import { MachineQuickSpecs, MachineTechnicalSpecs } from "@/components/machines/MachineSpecsPanel";
import { AddToCompareLink } from "@/components/machines/AddToCompareLink";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { getDetailDisplayTitle, powerTierLabel } from "@/lib/catalog-display";
import { formatMachinePowerBubble } from "@/lib/power-display";
import { formatMachineLaserLabel } from "@/lib/laser-capabilities";
import { getMachinePhotos } from "@/lib/machine-images";
import { MachineAccessoriesPanel } from "@/components/machines/MachineAccessoriesPanel";
import { MachineMaterialsPanel } from "@/components/machines/MachineMaterialsPanel";
import { MachineStandoutFeatures } from "@/components/machines/MachineStandoutFeatures";
import { MachineVerdictPanel } from "@/components/machines/MachineVerdictPanel";
import { getMachineEditorialDepth } from "@/lib/machine-editorial-depth";
import { getMachineStandoutFeatures } from "@/lib/machine-standout-features";
import { ModuleSystemNotice } from "@/components/machines/ModuleSystemNotice";
import { PowerTierNav } from "@/components/machines/PowerTierNav";
import { ContentFreshness } from "@/components/content/ContentFreshness";
import { resolveMachineEditorial } from "@/lib/power-tier-editorial";
import { getTierChipVariant } from "@/lib/catalog-display";
import { formatReleaseDate, ratingColor } from "@/lib/utils";
import { MachineDetailPrice } from "@/components/pricing/MachinePrice";
import { brandToSlug } from "@/lib/brand-slug";
import type { Machine } from "@/types/machine";

interface MachineDetailViewProps {
  locale: Locale;
  dict: Dictionary;
  initialSlug: string;
  tiers: Machine[];
  similarBySlug: Record<string, Machine[]>;
  hasTranslationBySlug: Record<string, boolean>;
}

export function MachineDetailView({
  locale,
  dict,
  initialSlug,
  tiers,
  similarBySlug,
  hasTranslationBySlug,
}: MachineDetailViewProps) {
  const router = useRouter();
  const m = dict.machine;

  const tiersBySlug = useMemo(
    () => Object.fromEntries(tiers.map((t) => [t.slug, t])),
    [tiers],
  );

  const [activeSlug, setActiveSlug] = useState(initialSlug);

  useEffect(() => {
    setActiveSlug(initialSlug);
  }, [initialSlug]);

  const machine =
    tiersBySlug[activeSlug] ?? tiersBySlug[initialSlug] ?? tiers[0];
  if (!machine) return null;
  const multiTier = tiers.length > 1;
  const tierChipVariant = getTierChipVariant(tiers);
  const tierLabel = powerTierLabel(machine, locale, tiers);
  const specsPowerLabel = multiTier ? tierLabel : formatMachinePowerBubble(machine, locale);
  const editorial = resolveMachineEditorial(machine, tiers, locale);
  const displayTitle = getDetailDisplayTitle(machine, tiers, locale);
  const similar = similarBySlug[machine.slug] ?? [];
  const photos = useMemo(() => getMachinePhotos(machine), [machine]);

  const handleSelectTier = useCallback(
    (slug: string) => {
      if (slug === activeSlug) return;
      setActiveSlug(slug);
      router.push(localizedPath(locale, `/lasers/${slug}`), { scroll: false });
    },
    [activeSlug, locale, router],
  );

  const showContentNotice =
    locale === "fr" &&
    !hasTranslationBySlug[machine.slug] &&
    Boolean(m.contentNotice);

  const standoutFeatures = useMemo(
    () => getMachineStandoutFeatures(machine, locale),
    [machine, locale],
  );

  const editorialDepth = useMemo(
    () => getMachineEditorialDepth(machine, locale, editorial),
    [machine, locale, editorial],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500 dark:text-stone-300">
        <LocaleLink href="/lasers" locale={locale} className="hover:text-amber-700 dark:hover:text-amber-400">
          {m.breadcrumbLasers}
        </LocaleLink>
        <span className="mx-2">/</span>
        <LocaleLink
          href={`/lasers/type/${machine.laserType}`}
          locale={locale}
          className="hover:text-amber-700 dark:hover:text-amber-400"
        >
          {laserTypeLabelLocalized(machine.laserType, dict)}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800 dark:text-stone-200">{displayTitle}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div key={activeSlug} className="min-w-0 space-y-8 lg:col-span-2">
          <MachineGallery
            key={machine.slug}
            machineKey={machine.slug}
            photos={photos}
            name={machine.name}
            layout="detail"
          />

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
              <LocaleLink
                href={`/brands/${brandToSlug(machine.brand)}`}
                locale={locale}
                className="hover:underline"
              >
                {machine.brand}
              </LocaleLink>
              {" · "}
              {formatMachineLaserLabel(machine, locale)}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
              {displayTitle}
            </h1>
            <p className="mt-2 text-lg text-stone-600 dark:text-stone-300">{machine.tagline}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <LocaleLink
                href={`/brands/${brandToSlug(machine.brand)}`}
                locale={locale}
                className="font-medium text-amber-700 hover:underline dark:text-amber-400"
              >
                {interpolate(m.viewAllFromBrand, { brand: machine.brand })} →
              </LocaleLink>
              <AddToCompareLink
                machineSlug={machine.slug}
                locale={locale}
                className="font-medium text-amber-700 hover:underline dark:text-amber-400"
              >
                {dict.compare.addToCompare} →
              </AddToCompareLink>
            </p>
            <ContentFreshness
              lastUpdated={machine.lastUpdated}
              locale={locale}
              dict={dict.freshness}
              className="mt-3"
            />
            {machine.releaseDate && (
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                {m.released} {formatReleaseDate(machine.releaseDate, locale)}
              </p>
            )}
            {showContentNotice && (
              <p className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300">
                {m.contentNotice}
              </p>
            )}
          </div>

          {multiTier && (
            <PowerTierNav
              tiers={tiers}
              activeSlug={activeSlug}
              locale={locale}
              labels={m}
              onSelectTier={handleSelectTier}
            />
          )}

          <ModuleSystemNotice
            machine={machine}
            powerTierCount={tiers.length}
            tierChipVariant={tierChipVariant}
            tiers={tiers}
            locale={locale}
            labels={m}
          />

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/50">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
              {m.tldr}
            </h2>
            <p className="mt-2 text-stone-800 dark:text-stone-200">{machine.tldr}</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{m.bestFor}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {editorial.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <MachineStandoutFeatures features={standoutFeatures} labels={m} />

          <MachineVerdictPanel
            pros={editorial.pros}
            cons={editorial.cons}
            labels={m}
            depth={editorialDepth}
          />

          <PerformanceHighlights
            performance={machine.specs.performance}
            mainObjective={editorial.mainObjective}
            primaryUse={editorial.primaryUse}
            labels={m}
            variant="summary"
          />

          <MachineMaterialsPanel machine={machine} labels={m} />

          <MachineAccessoriesPanel machine={machine} locale={locale} dict={dict} />

          <section className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900 sm:p-6">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {m.practicalNotes}
            </h2>
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {m.beginnerNotes}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {editorial.beginnerNotes}
                </p>
              </div>
              <div className="border-t border-stone-100 pt-5 dark:border-stone-800">
                <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  {m.proTips}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                  {editorial.proTips}
                </p>
              </div>
            </div>
          </section>

          <details className="group rounded-xl border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-900">
            <summary className="cursor-pointer list-none px-5 py-4 marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>
                  <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {m.technicalSpecs}
                  </span>
                  <span className="mt-0.5 block text-sm text-stone-500 dark:text-stone-400">
                    {m.technicalSpecsBody}
                  </span>
                </span>
                <span
                  className="shrink-0 text-stone-400 transition group-open:rotate-180 dark:text-stone-500"
                  aria-hidden
                >
                  ▾
                </span>
              </span>
            </summary>
            <div className="border-t border-stone-200 px-5 pb-5 pt-2 dark:border-stone-700 sm:px-6 sm:pb-6">
              <MachineTechnicalSpecs
                performance={machine.specs.performance}
                labels={m}
                bare
              />
            </div>
          </details>

          {machine.faq && machine.faq.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {m.commonQuestions}
              </h2>
              <div className="mt-3 space-y-3">
                {machine.faq.map((item) => (
                  <details
                    key={item.question}
                    className="rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
                  >
                    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-stone-900 marker:content-none dark:text-stone-100 [&::-webkit-details-marker]:hidden">
                      {item.question}
                    </summary>
                    <p className="border-t border-stone-100 px-4 pb-4 pt-0 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:text-stone-300">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside key={`aside-${activeSlug}`} className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
            <p className={`text-3xl font-bold ${ratingColor(machine.rating.overall)}`}>
              {machine.rating.overall.toFixed(1)}
              <span className="text-lg text-stone-400 dark:text-stone-300">/10</span>
            </p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-300">{m.overallScore}</p>
            <div className="mt-6">
              <RatingDisplay rating={machine.rating} labels={dict.ratings} />
            </div>
          </div>

          <MachineDetailPrice machine={machine} locale={locale} labels={m} variant="card" />

          <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {m.specs}
            </h2>
            <div className="mt-3">
              <MachineQuickSpecs
                specs={machine.specs}
                labels={m}
                powerLabel={specsPowerLabel}
              />
            </div>
          </div>

          {similar.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900">
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {m.compareWith}
              </h2>
              <ul className="mt-2 space-y-1.5">
                {similar.map(
                  (other) =>
                    other && (
                      <li key={other.slug}>
                        <LocaleLink
                          href={`/lasers/${other.slug}`}
                          locale={locale}
                          className="text-sm text-amber-700 hover:underline dark:text-amber-400"
                        >
                          {other.name}
                        </LocaleLink>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/60">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              {m.newToLasers}
            </p>
            <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">
              {m.readSafetyBefore}
            </p>
            <LocaleLink
              href="/guides/laser-safety-basics"
              locale={locale}
              className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
            >
              {m.safetyLink}
            </LocaleLink>
          </div>

          <p className="text-xs text-stone-400 dark:text-stone-500">
            {m.updatedFootnote.replace(
              "{date}",
              formatReleaseDate(machine.lastUpdated, locale),
            )}
          </p>
        </aside>
      </div>
    </div>
  );
}
