"use client";

import { useMemo, useState } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { ComparePickerModal } from "@/components/compare/ComparePickerModal";
import { MachineImage } from "@/components/machines/MachineImage";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import {
  MAX_COMPARE_MACHINES,
  MIN_COMPARE_MACHINES,
  buildMachineCompareSections,
} from "@/lib/machine-compare";
import { ratingColor } from "@/lib/utils";
import type { Machine } from "@/types/machine";

const LABEL_COL = "minmax(8.5rem, 10rem)";
const FILLED_COL = "minmax(12rem, 1fr)";
const EMPTY_COL = "minmax(2.75rem, 3.25rem)";
const SETUP_SLOT_COL = "minmax(0, 1fr)";

interface MachineVersusPanelProps {
  machines: Machine[];
  selected: Machine[];
  locale: Locale;
  dict: Dictionary;
  onChange: (slugs: string[]) => void;
  onShare?: () => void;
  shareCopied?: boolean;
}

function CellContent({ text, items }: { text: string; items?: string[] }) {
  if (items && items.length > 0) {
    return (
      <ul className="space-y-1 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  const parts = text.split("\n").filter(Boolean);
  if (parts.length <= 1) {
    return <span className="text-sm leading-relaxed">{text || "—"}</span>;
  }

  return (
    <div className="space-y-1 text-sm leading-relaxed">
      <p className="font-medium text-stone-900 dark:text-stone-100">{parts[0]}</p>
      {parts.slice(1).map((line) => (
        <p key={line} className="text-stone-600 dark:text-stone-400">
          {line}
        </p>
      ))}
    </div>
  );
}

function compareSlotColumns(slots: (Machine | null)[]) {
  return slots.map((s) => (s ? FILLED_COL : EMPTY_COL)).join(" ");
}

function specsGridColumns(slots: (Machine | null)[]) {
  return `${LABEL_COL} ${compareSlotColumns(slots)}`;
}

function setupSlotColumns() {
  return `repeat(${MAX_COMPARE_MACHINES}, ${SETUP_SLOT_COL})`;
}

function VersusEmptyState({
  dict,
  machines,
  selectedSlugs,
  onQuickAdd,
}: {
  dict: Dictionary;
  machines: Machine[];
  selectedSlugs: Set<string>;
  onQuickAdd: (slug: string) => void;
}) {
  const c = dict.compare;

  const quickPicks = useMemo(
    () =>
      [...machines]
        .filter((m) => !selectedSlugs.has(m.slug))
        .sort((a, b) => b.rating.overall - a.rating.overall)
        .slice(0, 6),
    [machines, selectedSlugs],
  );

  const previewSections = [c.sectionOverview, c.sectionScores, c.sectionPricing, c.sectionVerdict];

  return (
    <div className="border-t border-stone-200 bg-gradient-to-br from-stone-50 via-amber-50/40 to-stone-50 px-4 py-10 dark:border-stone-800 dark:from-stone-950 dark:via-amber-950/20 dark:to-stone-950 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          {interpolate(c.browseSelectedBar, { count: selectedSlugs.size, max: MAX_COMPARE_MACHINES })}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">
          {c.versusEmptyTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
          {selectedSlugs.size === 1 ? c.versusOneMore : c.versusEmptyBody}
        </p>
      </div>

      <div
        className="mx-auto mt-8 max-w-3xl rounded-xl border border-stone-200/80 bg-white/70 p-4 shadow-sm dark:border-stone-700 dark:bg-stone-900/60"
        aria-hidden
      >
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-stone-300 dark:bg-stone-600" />
          <div className="h-2 flex-1 rounded-full bg-stone-200 dark:bg-stone-700" />
          <div className="h-2 flex-1 rounded-full bg-stone-200 dark:bg-stone-700" />
        </div>
        <div className="space-y-2.5">
          {previewSections.map((title) => (
            <div key={title}>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-800/70 dark:text-amber-300/70">
                {title}
              </p>
              <div className="grid grid-cols-[5rem_1fr_1fr] gap-2">
                <div className="h-7 rounded-md bg-stone-100 dark:bg-stone-800" />
                <div className="h-7 rounded-md bg-stone-50 dark:bg-stone-800/60" />
                <div className="h-7 rounded-md bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900/40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {quickPicks.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {c.versusQuickPicks}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {quickPicks.map((m) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => onQuickAdd(m.slug)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-amber-700"
              >
                {m.name}
                <span className={`ml-1.5 text-xs ${ratingColor(m.rating.overall)}`}>
                  {m.rating.overall.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SetupEmptySlot({
  index,
  dict,
  onOpen,
}: {
  index: number;
  dict: Dictionary;
  onOpen: () => void;
}) {
  const c = dict.compare;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[15rem] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-gradient-to-b from-white to-stone-50 px-4 py-8 text-center transition hover:border-amber-400 hover:from-amber-50/50 hover:to-amber-50/20 hover:shadow-md dark:border-stone-600 dark:from-stone-900 dark:to-stone-950 dark:hover:border-amber-600 dark:hover:from-amber-950/30"
      aria-label={c.addMachine}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl font-light text-amber-800 transition group-hover:scale-105 dark:bg-amber-950 dark:text-amber-300">
        +
      </span>
      <span className="mt-4 text-sm font-semibold text-stone-800 dark:text-stone-200">
        {c.addMachine}
      </span>
      <span className="mt-1 text-xs text-stone-500 dark:text-stone-400">
        {index + 1} / {MAX_COMPARE_MACHINES}
      </span>
    </button>
  );
}

function CompareEmptySlot({ dict, onOpen }: { dict: Dictionary; onOpen: () => void }) {
  const c = dict.compare;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full min-h-[11rem] w-full flex-col items-center justify-center gap-1 bg-stone-50/40 px-1 py-4 transition hover:bg-amber-50/50 dark:bg-stone-950/30 dark:hover:bg-amber-950/20"
      aria-label={c.addMachine}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-stone-300 text-sm text-stone-400 dark:border-stone-600">
        +
      </span>
    </button>
  );
}

function SetupSlotCard({
  machine,
  locale,
  dict,
  onRemove,
  onChange,
}: {
  machine: Machine;
  locale: Locale;
  dict: Dictionary;
  onRemove: () => void;
  onChange: () => void;
}) {
  const c = dict.compare;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-stone-500 shadow ring-1 ring-stone-200 hover:text-rose-600 dark:bg-stone-900 dark:ring-stone-700"
        aria-label={c.removeMachine}
      >
        ×
      </button>
      <LocaleLink href={`/lasers/${machine.slug}`} locale={locale} className="block">
        <MachineImage machine={machine} className="aspect-[4/3] w-full" sizes="240px" />
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-0.5 p-3">
        <p className={`text-xl font-bold leading-none ${ratingColor(machine.rating.overall)}`}>
          {machine.rating.overall.toFixed(1)}
        </p>
        <LocaleLink
          href={`/lasers/${machine.slug}`}
          locale={locale}
          className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
        >
          {machine.name}
        </LocaleLink>
        <p className="text-[11px] text-stone-500 dark:text-stone-400">
          {machine.brand} · {laserTypeLabelLocalized(machine.laserType, dict)}
        </p>
        <button
          type="button"
          onClick={onChange}
          className="mt-1 text-left text-[11px] font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {c.changeMachine}
        </button>
      </div>
    </div>
  );
}

function CompareHeaderSlot({
  machine,
  locale,
  dict,
  onRemove,
  onChange,
}: {
  machine: Machine;
  locale: Locale;
  dict: Dictionary;
  onRemove: () => void;
  onChange: () => void;
}) {
  const c = dict.compare;

  return (
    <div className="relative flex h-full min-h-[11rem] flex-col bg-stone-50 dark:bg-stone-950">
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-sm text-stone-500 shadow ring-1 ring-stone-200 hover:text-rose-600 dark:bg-stone-900 dark:ring-stone-700"
        aria-label={c.removeMachine}
      >
        ×
      </button>
      <LocaleLink href={`/lasers/${machine.slug}`} locale={locale} className="block">
        <MachineImage
          machine={machine}
          className="aspect-[4/3] w-full border-b border-stone-200 dark:border-stone-800"
          sizes="220px"
        />
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        <p className={`text-lg font-bold leading-none ${ratingColor(machine.rating.overall)}`}>
          {machine.rating.overall.toFixed(1)}
        </p>
        <LocaleLink
          href={`/lasers/${machine.slug}`}
          locale={locale}
          className="line-clamp-2 text-xs font-semibold leading-snug text-stone-900 hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
        >
          {machine.name}
        </LocaleLink>
        <p className="text-[10px] text-stone-500 dark:text-stone-400">
          {machine.brand}
        </p>
        <button
          type="button"
          onClick={onChange}
          className="mt-auto pt-1 text-left text-[10px] font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          {c.changeMachine}
        </button>
      </div>
    </div>
  );
}

export function MachineVersusPanel({
  machines,
  selected,
  locale,
  dict,
  onChange,
  onShare,
  shareCopied,
}: MachineVersusPanelProps) {
  const c = dict.compare;
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const slots = useMemo(
    () => Array.from({ length: MAX_COMPARE_MACHINES }, (_, i) => selected[i] ?? null),
    [selected],
  );

  const activeMachines = useMemo(
    () => slots.filter((m): m is Machine => m !== null),
    [slots],
  );

  const isCompareReady = activeMachines.length >= MIN_COMPARE_MACHINES;

  const slugToActiveIndex = useMemo(
    () => new Map(activeMachines.map((m, i) => [m.slug, i])),
    [activeMachines],
  );

  const selectedSlugs = useMemo(() => new Set(selected.map((m) => m.slug)), [selected]);

  const sections = useMemo(
    () =>
      isCompareReady ? buildMachineCompareSections(activeMachines, locale, dict) : [],
    [isCompareReady, activeMachines, locale, dict],
  );

  const gridColumns = isCompareReady ? specsGridColumns(slots) : setupSlotColumns();

  function closePicker() {
    setActiveSlot(null);
    setQuery("");
  }

  function addMachine(slug: string) {
    if (selected.length >= MAX_COMPARE_MACHINES) return;
    onChange([...selected.map((m) => m.slug), slug]);
    closePicker();
  }

  function removeAt(index: number) {
    onChange(selected.filter((_, i) => i !== index).map((m) => m.slug));
    closePicker();
  }

  function replaceAt(index: number, slug: string) {
    const slugs = selected.map((m) => m.slug);
    slugs[index] = slug;
    onChange(slugs);
    closePicker();
  }

  function handlePick(slug: string) {
    if (activeSlot === null) return;
    if (slots[activeSlot]) replaceAt(activeSlot, slug);
    else addMachine(slug);
  }

  function openSlot(index: number) {
    setActiveSlot(index);
    setQuery("");
  }

  const replacingMachine = activeSlot !== null ? slots[activeSlot] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-4 dark:border-stone-800 sm:px-6">
        <div className="text-sm text-stone-600 dark:text-stone-400">
          <p>{c.pickerHint}</p>
          <p className="mt-1 text-xs text-stone-500">
            {interpolate(c.pickerCatalogCount, { count: machines.length })}
          </p>
        </div>
        {onShare && isCompareReady && (
          <button
            type="button"
            onClick={onShare}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-800 dark:border-stone-600 dark:text-stone-200 dark:hover:border-amber-600"
          >
            {shareCopied ? c.shareCopied : c.shareLink}
          </button>
        )}
      </div>

      {!isCompareReady ? (
        <>
          <div className="px-4 py-4 sm:px-6">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: gridColumns }}
            >
              {slots.map((machine, index) => (
                <div key={machine?.slug ?? `slot-${index}`} className="min-w-0">
                  {machine ? (
                    <SetupSlotCard
                      machine={machine}
                      locale={locale}
                      dict={dict}
                      onRemove={() => removeAt(index)}
                      onChange={() => openSlot(index)}
                    />
                  ) : (
                    <SetupEmptySlot index={index} dict={dict} onOpen={() => openSlot(index)} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <VersusEmptyState
            dict={dict}
            machines={machines}
            selectedSlugs={selectedSlugs}
            onQuickAdd={addMachine}
          />
        </>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div
              className="min-w-[36rem]"
              style={{ display: "grid", gridTemplateColumns: gridColumns }}
            >
              {/* Header row — aligned with spec columns via shared grid + label spacer */}
              <div
                className="sticky left-0 z-20 border-b border-r border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950"
                aria-hidden
              />

              {slots.map((machine, index) => (
                <div
                  key={machine?.slug ?? `header-${index}`}
                  className={`min-w-0 border-b border-stone-200 dark:border-stone-800 ${
                    index > 0 ? "border-l" : ""
                  }`}
                >
                  {machine ? (
                    <CompareHeaderSlot
                      machine={machine}
                      locale={locale}
                      dict={dict}
                      onRemove={() => removeAt(index)}
                      onChange={() => openSlot(index)}
                    />
                  ) : (
                    <CompareEmptySlot dict={dict} onOpen={() => openSlot(index)} />
                  )}
                </div>
              ))}

              <div
                className="border-b border-stone-200 bg-stone-50 px-4 py-2.5 dark:border-stone-800 dark:bg-stone-950"
                style={{ gridColumn: "1 / -1" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  {c.versusSpecsHeading}
                </p>
              </div>

              {sections.map((section) => (
                <div key={section.id} className="contents">
                  <div
                    className="border-y border-amber-200/80 bg-amber-50/90 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    {section.title}
                  </div>

                  {section.rows.map((row) => (
                    <div key={row.id} className="contents">
                      <div className="sticky left-0 z-10 border-b border-r border-stone-100 bg-white px-3 py-4 text-sm font-medium text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                        {row.label}
                      </div>

                      {slots.map((machine, slotIndex) => {
                        if (!machine) {
                          return (
                            <div
                              key={`${row.id}-empty-${slotIndex}`}
                              className={`border-b border-stone-100 bg-stone-50/30 dark:border-stone-800 dark:bg-stone-950/20 ${
                                slotIndex > 0 ? "border-l" : ""
                              }`}
                              aria-hidden
                            />
                          );
                        }

                        const activeIdx = slugToActiveIndex.get(machine.slug)!;
                        const cell = row.cells[activeIdx];
                        const isWinner = row.winnerIndexes.includes(activeIdx);

                        return (
                          <div
                            key={`${row.id}-${machine.slug}`}
                            className={`border-b border-stone-100 px-3 py-4 align-top dark:border-stone-800 ${
                              slotIndex > 0 ? "border-l" : ""
                            } ${
                              isWinner
                                ? "bg-emerald-50/90 ring-1 ring-inset ring-emerald-200/80 dark:bg-emerald-950/30 dark:ring-emerald-900/50"
                                : "bg-white dark:bg-stone-900"
                            }`}
                          >
                            {isWinner && (
                              <span className="mb-1.5 inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                {c.winnerBadge}
                              </span>
                            )}
                            <CellContent text={cell.text} items={cell.items} />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="border-t border-stone-200 px-4 py-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
            {c.winnerDisclaimer}
          </p>
        </>
      )}

      <ComparePickerModal
        open={activeSlot !== null}
        machines={machines}
        selectedSlugs={selectedSlugs}
        query={query}
        setQuery={setQuery}
        dict={dict}
        replacing={replacingMachine}
        onPick={handlePick}
        onClose={closePicker}
      />
    </div>
  );
}
