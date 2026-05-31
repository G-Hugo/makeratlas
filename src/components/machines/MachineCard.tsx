import Link from "next/link";
import type { Machine } from "@/types/machine";
import { MachineImage } from "@/components/machines/MachineImage";
import { PerformanceHighlights } from "@/components/machines/PerformanceHighlights";
import { formatPrice, laserTypeLabel, ratingColor } from "@/lib/utils";

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  return (
    <Link
      href={`/lasers/${machine.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md"
    >
      <MachineImage
        machine={machine}
        className="aspect-[16/10] w-full"
        sizes="(max-width: 640px) 100vw, 33vw"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              {machine.brand} · {laserTypeLabel(machine.laserType)}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-stone-900 group-hover:text-amber-800">
              {machine.name}
            </h3>
          </div>
          <span
            className={`shrink-0 text-lg font-bold ${ratingColor(machine.rating.overall)}`}
          >
            {machine.rating.overall.toFixed(1)}
          </span>
        </div>

        <PerformanceHighlights
          performance={machine.specs.performance}
          mainObjective={machine.mainObjective}
          variant="card"
        />

        <p className="mt-4 line-clamp-2 text-sm text-stone-600">{machine.tldr}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {machine.bestFor.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-3 text-sm font-medium text-stone-900">
          {formatPrice(machine.priceRange.min, machine.priceRange.max)}
        </p>
      </div>
    </Link>
  );
}
