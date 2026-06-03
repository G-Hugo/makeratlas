import { getCatalogCardHero } from "@/lib/machine-images";
import { MachinePhotoImg } from "@/components/machines/MachinePhotoImg";
import type { Machine } from "@/types/machine";

interface MachineImageProps {
  machine: Pick<Machine, "name" | "brand" | "slug" | "image" | "images" | "laserType">;
  /** Explicit hero URL : must match catalog card and detail page slide 1. */
  heroSrc?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
  /** Override img fit/padding (catalog cards). */
  qualityClassName?: string;
  /** Force img remount / bust browser cache when hero processing changes. */
  imageKey?: string;
}

export function MachineImage({
  machine,
  heroSrc,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 400px",
  qualityClassName,
  imageKey,
}: MachineImageProps) {
  const src = heroSrc ?? getCatalogCardHero(machine);
  const alt = `${machine.name} laser engraver by ${machine.brand}`;

  if (!src) return null;

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-stone-900 ${className}`}>
      <MachinePhotoImg
        src={src}
        alt={alt}
        imageKey={imageKey ?? `${machine.slug}:${src}`}
        priority={priority}
        sizes={sizes}
        qualityClassName={
          qualityClassName ??
          "object-contain p-4 transition duration-300 group-hover:scale-[1.01]"
        }
      />
    </div>
  );
}
