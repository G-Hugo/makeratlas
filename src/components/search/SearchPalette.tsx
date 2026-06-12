"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { localizedPath } from "@/i18n/navigation";
import { interpolate } from "@/lib/i18n-helpers";
import type { SearchItem, SearchItemKind } from "@/lib/search-index";

interface SearchPaletteProps {
  items: SearchItem[];
  locale: Locale;
  dict: Dictionary;
}

const GROUP_ORDER: SearchItemKind[] = ["machine", "brand", "guide", "page"];
const GROUP_LIMIT = 6;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const KIND_ICON: Record<SearchItemKind, string> = {
  machine: "◆",
  brand: "●",
  guide: "▤",
  page: "→",
};

export function SearchPalette({ items, locale, dict }: SearchPaletteProps) {
  const s = dict.search;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const flatResults = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];

    const matches = items.filter((item) => {
      const haystack = normalize(`${item.label} ${item.sublabel ?? ""}`);
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });

    const grouped: SearchItem[] = [];
    for (const kind of GROUP_ORDER) {
      grouped.push(...matches.filter((m) => m.kind === kind).slice(0, GROUP_LIMIT));
    }
    return grouped;
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [flatResults.length]);

  function navigateTo(item: SearchItem) {
    setOpen(false);
    router.push(localizedPath(locale, item.href));
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[activeIndex]) {
      e.preventDefault();
      navigateTo(flatResults[activeIndex]);
    }
  }

  const groupLabels: Record<SearchItemKind, string> = {
    machine: s.groupMachines,
    brand: s.groupBrands,
    guide: s.groupGuides,
    page: s.groupPages,
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={s.open}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100 sm:px-3 sm:py-2"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3.5 3.5" strokeLinecap="round" />
        </svg>
        <kbd className="hidden rounded border border-stone-300 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500 dark:border-stone-600 dark:text-stone-400 lg:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <button
            type="button"
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-label="Close"
            tabIndex={-1}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900"
          >
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={s.placeholder}
              className="border-b border-stone-200 bg-transparent px-4 py-3.5 text-base text-stone-900 outline-none placeholder:text-stone-400 dark:border-stone-700 dark:text-stone-100 dark:placeholder:text-stone-500"
            />

            <div className="flex-1 overflow-y-auto p-2">
              {query.trim() === "" ? (
                <p className="px-3 py-6 text-center text-sm text-stone-500 dark:text-stone-400">
                  {s.hint}
                </p>
              ) : flatResults.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-stone-500 dark:text-stone-400">
                  {interpolate(s.noResults, { query: query.trim() })}
                </p>
              ) : (
                <ul>
                  {flatResults.map((item, index) => {
                    const isFirstOfKind =
                      index === 0 || flatResults[index - 1].kind !== item.kind;
                    return (
                      <li key={`${item.kind}-${item.href}`}>
                        {isFirstOfKind && (
                          <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                            {groupLabels[item.kind]}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => navigateTo(item)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                            index === activeIndex
                              ? "bg-amber-100 text-stone-900 dark:bg-amber-950/60 dark:text-stone-100"
                              : "text-stone-700 dark:text-stone-300"
                          }`}
                        >
                          <span aria-hidden className="shrink-0 text-xs text-stone-400">
                            {KIND_ICON[item.kind]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{item.label}</span>
                            {item.sublabel && (
                              <span className="block truncate text-xs text-stone-500 dark:text-stone-400">
                                {item.sublabel}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
