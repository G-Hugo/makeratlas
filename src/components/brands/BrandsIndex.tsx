"use client";

import { useMemo, useState } from "react";
import { BrandCard } from "@/components/brands/BrandCard";
import { PageHeader } from "@/components/pages/PageHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n-helpers";
import type { BrandProfile } from "@/types/brand";

interface BrandsIndexProps {
  brands: BrandProfile[];
  locale: Locale;
  dict: Dictionary;
}

export function BrandsIndex({ brands, locale, dict }: BrandsIndexProps) {
  const b = dict.brands;
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(q) ||
        brand.tagline.toLowerCase().includes(q) ||
        brand.slug.includes(q),
    );
  }, [brands, search]);

  return (
    <>
      <PageHeader
        title={b.title}
        description={interpolate(b.description, { count: brands.length })}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {interpolate(b.allBrandsCount, { count: brands.length })}
        </p>
        <label className="w-full sm:max-w-xs">
          <span className="sr-only">{b.searchPlaceholder}</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={b.searchPlaceholder}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-stone-500 dark:text-stone-400">{b.noResults}</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((brand) => (
            <li key={brand.slug}>
              <BrandCard brand={brand} locale={locale} dict={dict} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
