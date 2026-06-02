/**
 * Plain <img> for machine product photos.
 * Avoids next/image optimizer cache mixing images between catalog cards and detail pages.
 */

interface MachinePhotoImgProps {
  src: string;
  alt: string;
  imageKey: string;
  priority?: boolean;
  qualityClassName?: string;
  sizes?: string;
}

export function MachinePhotoImg({
  src,
  alt,
  imageKey,
  priority = false,
  qualityClassName = "object-contain p-4",
  sizes,
}: MachinePhotoImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: stable src per machine
    <img
      key={imageKey}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      sizes={sizes}
      className={`absolute inset-0 h-full w-full ${qualityClassName}`}
    />
  );
}
