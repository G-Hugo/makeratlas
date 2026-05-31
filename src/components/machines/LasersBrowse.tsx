"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MachineCard } from "@/components/machines/MachineCard";
import type { LaserType, Machine } from "@/types/machine";
import { laserTypeLabel } from "@/lib/utils";

interface LasersBrowseProps {
  machines: Machine[];
  initialType?: LaserType | "all";
  title?: string;
  description?: string;
}

export function LasersBrowse({
  machines,
  initialType = "all",
  title = "Laser engravers",
  description,
}: LasersBrowseProps) {
  const [typeFilter, setTypeFilter] = useState<LaserType | "all">(initialType);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"rating" | "price-asc" | "price-desc">(
    "rating",
  );

  const types = useMemo(() => {
    const set = new Set(machines.map((m) => m.laserType));
    return Array.from(set).sort();
  }, [machines]);

  const filtered = useMemo(() => {
    let result = machines.filter((m) => {
      const typeMatch = typeFilter === "all" || m.laserType === typeFilter;
      const priceMatch = m.priceRange.min <= maxPrice;
      const searchMatch =
        search.trim() === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.brand.toLowerCase().includes(search.toLowerCase()) ||
        m.bestFor.some((b) => b.toLowerCase().includes(search.toLowerCase()));
      return typeMatch && priceMatch && searchMatch;
    });

    result = [...result].sort((a, b) => {
      if (sort === "rating") return b.rating.overall - a.rating.overall;
      if (sort === "price-asc") return a.priceRange.min - b.priceRange.min;
      return b.priceRange.min - a.priceRange.min;
    });

    return result;
  }, [machines, typeFilter, maxPrice, search, sort]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
      {description && (
        <p className="mt-3 max-w-2xl text-stone-600">{description}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/lasers"
          className={`rounded-full px-3 py-1 text-sm font-medium transition ${
            typeFilter === "all"
              ? "bg-amber-500 text-white"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          All ({machines.length})
        </Link>
        {types.map((type) => (
          <Link
            key={type}
            href={`/lasers/type/${type}`}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              typeFilter === type
                ? "bg-amber-500 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {laserTypeLabel(type)} (
            {machines.filter((m) => m.laserType === type).length})
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-stone-200 bg-white p-4">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">Search</span>
          <input
            type="search"
            placeholder="Name, brand, use case…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">Sort by</span>
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "rating" | "price-asc" | "price-desc")
            }
            className="rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="rating">Highest rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">
            Max price: ${maxPrice.toLocaleString()}
          </span>
          <input
            type="range"
            min={200}
            max={6000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-48"
          />
        </label>
      </div>

      <p className="mt-4 text-sm text-stone-500">
        Showing {filtered.length} of {machines.length} machines
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-stone-500">
          No machines match your filters. Try raising the budget or clearing search.
        </p>
      )}
    </div>
  );
}
