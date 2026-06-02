"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { MachineCard } from "@/components/machines/MachineCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CatalogEntry } from "@/lib/catalog-types";
import { parsePowerWatts } from "@/lib/catalog-display";
import {
  LASER_TYPES_ORDER,
  machineMatchesLaserType,
} from "@/lib/laser-capabilities";
import { interpolate, laserTypeLabelLocalized } from "@/lib/i18n-helpers";
import { getMachineWorkFocus, type MachineWorkFocus } from "@/lib/machine-work-focus";
import type { LaserType } from "@/types/machine";

interface LasersBrowseProps {
  entries: CatalogEntry[];
  locale: Locale;
  dict: Dictionary;
  initialType?: LaserType | "all";
  title?: string;
  description?: string;
}

function countForType(entries: CatalogEntry[], type: LaserType): number {
  return entries.filter((e) => machineMatchesLaserType(e.primary, type)).length;
}

export function LasersBrowse({
  entries,
  locale,
  dict,
  initialType = "all",
  title,
  description,
}: LasersBrowseProps) {
  const l = dict.lasers;
  const pathname = usePathname();
  const routeType = pathname?.match(/\/lasers\/type\/([^/]+)$/)?.[1] as
    | LaserType
    | undefined;

  const activeType: LaserType | "all" =
    routeType && LASER_TYPES_ORDER.includes(routeType) ? routeType : initialType;

  const [search, setSearch] = useState("");
  const [workFocus, setWorkFocus] = useState<MachineWorkFocus | "all">("all");
  const [powerBand, setPowerBand] = useState<"all" | "low" | "mid" | "high">("all");
  const [sort, setSort] = useState<"rating" | "power" | "newest" | "name">("rating");

  useEffect(() => {
    setSearch("");
    setWorkFocus("all");
    setPowerBand("all");
    setSort("rating");
  }, [activeType]);

  const typeCounts = useMemo(() => {
    const counts: Record<LaserType, number> = {
      diode: 0,
      co2: 0,
      fiber: 0,
      uv: 0,
      hybrid: 0,
    };
    for (const type of LASER_TYPES_ORDER) {
      counts[type] = countForType(entries, type);
    }
    return counts;
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries.filter((e) => {
      const m = e.primary;
      const typeMatch =
        activeType === "all" || machineMatchesLaserType(m, activeType);
      const focusMatch =
        workFocus === "all" || getMachineWorkFocus(m) === workFocus;
      const watts = parsePowerWatts(m) ?? 0;
      const powerMatch =
        powerBand === "all" ||
        (powerBand === "low" && watts > 0 && watts <= 10) ||
        (powerBand === "mid" && watts >= 11 && watts <= 39) ||
        (powerBand === "high" && watts >= 40);
      const searchMatch =
        search.trim() === "" ||
        e.displayName.toLowerCase().includes(search.toLowerCase()) ||
        m.brand.toLowerCase().includes(search.toLowerCase()) ||
        m.bestFor.some((b) => b.toLowerCase().includes(search.toLowerCase()));
      return typeMatch && focusMatch && powerMatch && searchMatch;
    });

    result = [...result].sort((a, b) => {
      if (sort === "name") return a.displayName.localeCompare(b.displayName);
      if (sort === "power") {
        const pa = parsePowerWatts(a.primary) ?? 0;
        const pb = parsePowerWatts(b.primary) ?? 0;
        if (pb !== pa) return pb - pa;
        return b.primary.rating.overall - a.primary.rating.overall;
      }
      if (sort === "newest") {
        const da = a.primary.releaseDate ?? "";
        const db = b.primary.releaseDate ?? "";
        return db.localeCompare(da);
      }
      return b.primary.rating.overall - a.primary.rating.overall;
    });

    return result;
  }, [entries, activeType, search, workFocus, powerBand, sort]);

  const inTypePool =
    activeType === "all" ? entries.length : countForType(entries, activeType);

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900">{title ?? l.browseTitle}</h1>
      {description && <p className="mt-3 max-w-2xl text-stone-600">{description}</p>}

      <nav className="mt-6 flex flex-wrap gap-2" aria-label={l.filterByType}>
        <LocaleLink
          href="/lasers"
          locale={locale}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            activeType === "all"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          {l.allCount} ({entries.length})
        </LocaleLink>
        {LASER_TYPES_ORDER.map((type) => {
          const count = typeCounts[type];
          const isActive = activeType === type;
          return (
            <LocaleLink
              key={type}
              href={`/lasers/type/${type}`}
              locale={locale}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-amber-500 text-white shadow-sm"
                  : count === 0
                    ? "pointer-events-none bg-stone-50 text-stone-400"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {laserTypeLabelLocalized(type, dict)} ({count})
            </LocaleLink>
          );
        })}
      </nav>

      {activeType === "hybrid" && (
        <p className="mt-3 text-sm text-stone-600">{l.hybridNote}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-stone-200 bg-white p-4">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">{l.searchLabel}</span>
          <input
            type="search"
            placeholder={l.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">{l.sortLabel}</span>
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "rating" | "power" | "newest" | "name")
            }
            className="rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="rating">{l.sortHighestRated}</option>
            <option value="power">{l.sortPower}</option>
            <option value="newest">{l.sortNewest}</option>
            <option value="name">{l.sortName}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">{l.workFocusLabel}</span>
          <select
            value={workFocus}
            onChange={(e) => setWorkFocus(e.target.value as MachineWorkFocus | "all")}
            className="rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="all">{l.allTypes}</option>
            <option value="engrave">{dict.workFocus.engrave}</option>
            <option value="cut">{dict.workFocus.cut}</option>
            <option value="both">{dict.workFocus.both}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">{l.powerBandLabel}</span>
          <select
            value={powerBand}
            onChange={(e) =>
              setPowerBand(e.target.value as "all" | "low" | "mid" | "high")
            }
            className="rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="all">{l.powerBandAll}</option>
            <option value="low">{l.powerBandLow}</option>
            <option value="mid">{l.powerBandMid}</option>
            <option value="high">{l.powerBandHigh}</option>
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        {l.showing} {filtered.length} / {inTypePool}{" "}
        {activeType === "all"
          ? l.lines
          : interpolate(l.linesOfType, {
              type: laserTypeLabelLocalized(activeType, dict).toLowerCase(),
            })}
        {search || workFocus !== "all" || powerBand !== "all" || sort !== "rating"
          ? ` ${l.filteredSuffix}`
          : ""}
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((entry) => (
          <MachineCard key={entry.primary.id} entry={entry} locale={locale} dict={dict} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-stone-500">{l.noResults}</p>
      )}
    </div>
  );
}
