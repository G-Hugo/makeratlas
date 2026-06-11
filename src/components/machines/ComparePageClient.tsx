"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MachineVersusPanel } from "@/components/compare/MachineVersusPanel";
import { CompareBrowseTable } from "@/components/machines/CompareBrowseTable";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { parseCompareIdsParam, serializeCompareIds } from "@/lib/machine-compare";
import type { Machine } from "@/types/machine";

interface ComparePageClientProps {
  machines: Machine[];
  locale: Locale;
  dict: Dictionary;
}

type CompareMode = "versus" | "browse";

export function ComparePageClient({ machines, locale, dict }: ComparePageClientProps) {
  const c = dict.compare;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<CompareMode>("versus");
  const [shareCopied, setShareCopied] = useState(false);

  const machineBySlug = useMemo(
    () => new Map(machines.map((m) => [m.slug, m])),
    [machines],
  );

  const selectedSlugs = useMemo(
    () => parseCompareIdsParam(searchParams.get("ids")),
    [searchParams],
  );

  const selectedMachines = useMemo(
    () =>
      selectedSlugs
        .map((slug) => machineBySlug.get(slug))
        .filter((m): m is Machine => Boolean(m)),
    [selectedSlugs, machineBySlug],
  );

  const syncUrl = useCallback(
    (slugs: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slugs.length === 0) {
        params.delete("ids");
      } else {
        params.set("ids", serializeCompareIds(slugs));
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  function handleSelectionChange(slugs: string[]) {
    syncUrl(slugs);
    setShareCopied(false);
  }

  async function handleShare() {
    const params = new URLSearchParams(searchParams.toString());
    const qs = params.toString();
    const url = `${window.location.origin}${pathname}${qs ? `?${qs}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-lg border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-950">
        <button
          type="button"
          onClick={() => setMode("versus")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            mode === "versus"
              ? "bg-white text-stone-900 shadow dark:bg-stone-900 dark:text-stone-100"
              : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
          }`}
        >
          {c.tabVersus}
        </button>
        <button
          type="button"
          onClick={() => setMode("browse")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            mode === "browse"
              ? "bg-white text-stone-900 shadow dark:bg-stone-900 dark:text-stone-100"
              : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
          }`}
        >
          {c.tabBrowse}
        </button>
      </div>

      {mode === "versus" ? (
        <MachineVersusPanel
          machines={machines}
          selected={selectedMachines}
          locale={locale}
          dict={dict}
          onChange={handleSelectionChange}
          onShare={handleShare}
          shareCopied={shareCopied}
        />
      ) : (
        <CompareBrowseTable
          machines={machines}
          locale={locale}
          dict={dict}
          selectedSlugs={selectedSlugs}
          onSelectionChange={handleSelectionChange}
          onCompareNow={() => {
            setMode("versus");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
