type BrandLogoSize = "hero" | "card";

interface BrandLogoProps {
  name: string;
  src?: string;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
}

const sizeConfig: Record<BrandLogoSize, { box: string; image: string; text: string }> = {
  hero: {
    box: "h-32 w-48 sm:h-40 sm:w-60",
    image: "max-h-28 max-w-[13rem] sm:max-h-36 sm:max-w-[16rem]",
    text: "text-3xl sm:text-4xl",
  },
  card: {
    box: "h-14 w-24",
    image: "max-h-10 max-w-[5.5rem]",
    text: "text-lg",
  },
};

export function BrandLogo({
  name,
  src,
  size = "hero",
  className = "",
  priority = false,
}: BrandLogoProps) {
  const cfg = sizeConfig[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-stone-300/70 dark:bg-white dark:shadow-md ${cfg.box} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- local brand assets may be SVG or PNG
        <img
          src={src}
          alt={`${name} logo`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`h-auto w-auto object-contain ${cfg.image}`}
        />
      ) : (
        <span className={`truncate px-1 font-bold tracking-tight text-stone-800 ${cfg.text}`}>
          {name}
        </span>
      )}
    </div>
  );
}
