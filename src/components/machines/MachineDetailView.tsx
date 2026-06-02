"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RatingDisplay } from "@/components/machines/RatingDisplay";
import { MachineGallery } from "@/components/machines/MachineGallery";
import {
  PerformanceHighlights,
  TechnicalSpecs,
} from "@/components/machines/PerformanceHighlights";
import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import { laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { getCatalogDisplayName, formatMachinePowerBubble } from "@/lib/catalog-display";
import { formatMachineLaserLabel } from "@/lib/laser-capabilities";
import { getMachinePhotos } from "@/lib/machine-images";
import { ModuleSystemNotice } from "@/components/machines/ModuleSystemNotice";
import { PowerTierNav } from "@/components/machines/PowerTierNav";
import { ContentFreshness } from "@/components/content/ContentFreshness";
import { formatReleaseDate } from "@/lib/utils";
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
  const displayTitle = multiTier
    ? getCatalogDisplayName(machine, tiers.length)
    : machine.name;
  const similar = similarBySlug[machine.slug] ?? [];
  const photos = useMemo(() => getMachinePhotos(machine), [machine]);
  const powerLabel = formatMachinePowerBubble(machine, locale);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-stone-500">
        <LocaleLink href="/lasers" locale={locale} className="hover:text-amber-700">
          {m.breadcrumbLasers}
        </LocaleLink>
        <span className="mx-2">/</span>
        <LocaleLink
          href={`/lasers/type/${machine.laserType}`}
          locale={locale}
          className="hover:text-amber-700"
        >
          {laserTypeLabelLocalized(machine.laserType, dict)}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{displayTitle}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MachineGallery key={machine.slug} photos={photos} name={machine.name} />

          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-amber-700">
            {machine.brand} · {formatMachineLaserLabel(machine, locale)}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
            {displayTitle}
          </h1>
          <p className="mt-2 text-lg text-stone-600">{machine.tagline}</p>
          <ContentFreshness
            lastUpdated={machine.lastUpdated}
            locale={locale}
            dict={dict.freshness}
            className="mt-3"
          />
          {showContentNotice && (
            <p className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
              {m.contentNotice}
            </p>
          )}
          {machine.releaseDate && (
            <p className="mt-2 text-sm text-stone-500">
              {m.released} {formatReleaseDate(machine.releaseDate, locale)}
            </p>
          )}

          {multiTier && (
            <div className="mt-6">
              <PowerTierNav
                tiers={tiers}
                activeSlug={activeSlug}
                locale={locale}
                labels={m}
                onSelectTier={handleSelectTier}
              />
            </div>
          )}

          <ModuleSystemNotice
            machine={machine}
            powerTierCount={tiers.length}
            locale={locale}
            dict={dict}
            labels={m}
          />

          <div className="mt-8">
            <PerformanceHighlights
              performance={machine.specs.performance}
              mainObjective={machine.mainObjective}
              labels={m}
              variant={multiTier ? "compact" : "hero"}
            />
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              {m.tldr}
            </h2>
            <p className="mt-2 text-stone-800">{machine.tldr}</p>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">{m.whatFor}</h2>
            <p className="mt-3 text-stone-700">{machine.primaryUse}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">{m.bestFor}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {machine.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-stone-900">{m.materials}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-emerald-700">{m.engraves}</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.engrave.map((mat) => (
                    <li key={mat}>· {mat}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-blue-700">{m.cuts}</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.cut.length > 0 ? (
                    machine.materials.cut.map((mat) => <li key={mat}>· {mat}</li>)
                  ) : (
                    <li>· {m.limitedCutting}</li>
                  )}
                </ul>
              </div>
              <div className="rounded-lg border border-stone-200 p-4">
                <h3 className="text-sm font-semibold text-red-700">{m.cannotDo}</h3>
                <ul className="mt-2 space-y-1 text-sm text-stone-700">
                  {machine.materials.cannot.map((mat) => (
                    <li key={mat}>· {mat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-emerald-800">{m.pros}</h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                {machine.pros.map((pro) => (
                  <li key={pro} className="flex gap-2 text-sm">
                    <span className="text-emerald-600">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">{m.cons}</h2>
              <ul className="mt-3 space-y-2 text-stone-700">
                {machine.cons.map((con) => (
                  <li key={con} className="flex gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-10 rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold text-stone-900">{m.beginnerNotes}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {machine.beginnerNotes}
            </p>
          </section>

          <section className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-lg font-bold text-stone-900">{m.proTips}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {machine.proTips}
            </p>
          </section>

          <TechnicalSpecs performance={machine.specs.performance} labels={m} />

          {machine.faq && machine.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-stone-900">{m.commonQuestions}</h2>
              <div className="mt-4 space-y-4">
                {machine.faq.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-lg border border-stone-200 bg-white p-5"
                  >
                    <h3 className="font-semibold text-stone-900">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-700">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-amber-600">
              {machine.rating.overall.toFixed(1)}
              <span className="text-lg text-stone-400">/10</span>
            </p>
            <p className="mt-1 text-sm text-stone-500">{m.overallScore}</p>
            <div className="mt-6">
              <RatingDisplay rating={machine.rating} labels={dict.ratings} />
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold text-stone-900">{m.specs}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {machine.releaseDate && (
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">{m.released}</dt>
                  <dd className="text-right font-medium text-stone-900">
                    {formatReleaseDate(machine.releaseDate, locale)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-stone-500">{m.power}</dt>
                <dd className="text-right font-medium text-stone-900">{powerLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-stone-500">{m.spotSize}</dt>
                <dd className="text-right font-medium text-stone-900">
                  {machine.specs.performance.technical.spotSize}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">{m.motionPrecision}</dt>
                <dd className="text-right font-medium text-stone-900">
                  {machine.specs.performance.precision}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">{m.workArea}</dt>
                <dd className="text-right font-medium text-stone-900">
                  {machine.specs.workArea}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">{m.sampleEngrave}</dt>
                <dd className="mt-1 text-right font-medium text-stone-900">
                  {machine.specs.performance.engraveExample.time}
                </dd>
                <dd className="text-right text-xs text-stone-500">
                  {machine.specs.performance.engraveExample.size}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">{m.sampleCut}</dt>
                <dd className="mt-1 text-right font-medium text-stone-900">
                  {machine.specs.performance.cutExample.time}
                </dd>
                <dd className="text-right text-xs text-stone-500">
                  {machine.specs.performance.cutExample.size !== "—"
                    ? machine.specs.performance.cutExample.size
                    : machine.specs.performance.cutExample.time}
                </dd>
              </div>
              {machine.specs.software && (
                <div>
                  <dt className="text-stone-500">{m.software}</dt>
                  <dd className="mt-1 text-right font-medium text-stone-900">
                    {machine.specs.software.join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {similar.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="font-semibold text-stone-900">{m.compareWith}</h2>
              <ul className="mt-3 space-y-2">
                {similar.map(
                  (other) =>
                    other && (
                      <li key={other.slug}>
                        <LocaleLink
                          href={`/lasers/${other.slug}`}
                          locale={locale}
                          className="text-sm text-amber-700 hover:underline"
                        >
                          {other.name}
                        </LocaleLink>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-stone-200 bg-amber-50 p-5">
            <p className="text-sm font-medium text-amber-900">{m.newToLasers}</p>
            <p className="mt-1 text-xs text-stone-600">{m.readSafetyBefore}</p>
            <LocaleLink
              href="/guides/laser-safety-basics"
              locale={locale}
              className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline"
            >
              {m.safetyLink}
            </LocaleLink>
          </div>

          <p className="text-xs text-stone-400">
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
