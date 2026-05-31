import Image from "next/image";
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
  const alt = `${machine.name} laser engraver by ${machine.brand}`;

  return (
    <div
      className={`relative overflow-hidden bg-stone-100 ${className}`}
    >
      <Image
        src={machine.image}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}
