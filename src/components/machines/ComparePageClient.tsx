"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Machine, LaserType } from "@/types/machine";
import { formatPrice, laserTypeLabel } from "@/lib/utils";

interface ComparePageClientProps {
  machines: Machine[];
}

function exampleSummary(example: { time: string; size: string }) {
  if (example.size === "—") return example.time;
  return `${example.time} (${example.size})`;
}

export function ComparePageClient({ machines }: ComparePageClientProps) {
  const [typeFilter, setTypeFilter] = useState<LaserType | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(6000);

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const typeMatch = typeFilter === "all" || m.laserType === typeFilter;
      const priceMatch = m.priceRange.min <= maxPrice;
      return typeMatch && priceMatch;
    });
  }, [machines, typeFilter, maxPrice]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-stone-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">Laser type</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LaserType | "all")}
            className="rounded-md border border-stone-300 px-3 py-2"
          >
            <option value="all">All types</option>
            <option value="diode">Diode</option>
            <option value="co2">CO₂</option>
            <option value="fiber">Fiber</option>
            <option value="hybrid">Hybrid</option>
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

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-stone-700">Machine</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Main objective</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Precision</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Sample engrave</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Sample cut</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Price</th>
              <th className="px-4 py-3 font-semibold text-stone-700">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((machine) => (
              <tr
                key={machine.id}
                className="border-b border-stone-100 hover:bg-amber-50/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/lasers/${machine.slug}`}
                    className="font-medium text-amber-700 hover:underline"
                  >
                    {machine.name}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {machine.brand} · {laserTypeLabel(machine.laserType)}
                  </p>
                </td>
                <td className="max-w-[160px] px-4 py-3 text-xs text-stone-700">
                  {machine.mainObjective}
                </td>
                <td className="px-4 py-3 font-medium">
                  {machine.specs.performance.precision}
                </td>
                <td className="max-w-[140px] px-4 py-3 text-xs text-stone-700">
                  {exampleSummary(machine.specs.performance.engraveExample)}
                </td>
                <td className="max-w-[140px] px-4 py-3 text-xs text-stone-700">
                  {exampleSummary(machine.specs.performance.cutExample)}
                </td>
                <td className="px-4 py-3">
                  {formatPrice(machine.priceRange.min, machine.priceRange.max)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {machine.rating.overall.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-stone-500">
          No machines match your filters. Try raising the price limit.
        </p>
      )}
    </div>
  );
}
