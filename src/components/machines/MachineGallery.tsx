"use client";

import { useState } from "react";
import { MachinePhotoImg } from "@/components/machines/MachinePhotoImg";
import type { MachinePhoto } from "@/types/machine";

interface MachineGalleryProps {
  photos: MachinePhoto[];
  name: string;
  /** Stable key prefix so gallery remounts cleanly per machine. */
  machineKey: string;
}

export function MachineGallery({ photos, name, machineKey }: MachineGalleryProps) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900">
        <MachinePhotoImg
          src={current.src}
          alt={current.alt}
          imageKey={`${machineKey}:${current.src}`}
          priority={active === 0}
          sizes="(max-width: 1024px) min(100vw, 900px), 900px"
        />
      </div>

      {current.caption && (
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">{current.caption}</p>
      )}

      {photos.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label={`${name} product photos`}
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Photo ${index + 1} of ${photos.length}`}
              onClick={() => setActive(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === active
                  ? "border-amber-500 ring-2 ring-amber-200 dark:ring-amber-900"
                  : "border-stone-200 opacity-80 hover:border-stone-300 hover:opacity-100 dark:border-stone-700 dark:hover:border-stone-500"
              }`}
            >
              <MachinePhotoImg
                src={photo.src}
                alt=""
                imageKey={`${machineKey}:thumb:${index}:${photo.src}`}
                qualityClassName="object-contain bg-white p-1 dark:bg-stone-900"
              />
            </button>
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs text-stone-400 dark:text-stone-500">
          {photos.length} manufacturer photos · {active + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}
