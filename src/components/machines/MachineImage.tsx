import Image from "next/image";
import { getPrimaryImage } from "@/lib/machine-images";
import type { Machine } from "@/types/machine";

interface MachineImageProps {
  machine: Pick<Machine, "name" | "brand" | "slug" | "image" | "laserType">;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function MachineImage({
  machine,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 400px",
}: MachineImageProps) {
  const src = getPrimaryImage(machine);
  const alt = `${machine.name} laser engraver by ${machine.brand}`;

  if (!src) return null;

  return (
    <div
      className={`relative overflow-hidden bg-white ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={90}
        sizes={sizes}
        className="object-contain p-4 transition duration-300 group-hover:scale-[1.01]"
      />
    </div>
  );
}
