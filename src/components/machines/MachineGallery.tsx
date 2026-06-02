"use client";

import { useState } from "react";
import Image from "next/image";
import type { MachinePhoto } from "@/types/machine";

interface MachineGalleryProps {
  photos: MachinePhoto[];
  name: string;
}

export function MachineGallery({ photos, name }: MachineGalleryProps) {
  const [active, setActive] = useState(0);
  const current = photos[active] ?? photos[0];

  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-200 bg-white">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority={active === 0}
          quality={90}
          sizes="(max-width: 1024px) min(100vw, 900px), 900px"
          className="object-contain p-4"
        />
      </div>

      {current.caption && (
        <p className="text-center text-sm text-stone-500">{current.caption}</p>
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
                  ? "border-amber-500 ring-2 ring-amber-200"
                  : "border-stone-200 opacity-80 hover:border-stone-300 hover:opacity-100"
              }`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                quality={75}
                sizes="96px"
                className="object-contain bg-white p-1"
              />
            </button>
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <p className="text-xs text-stone-400">
          {photos.length} manufacturer photos · {active + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}
