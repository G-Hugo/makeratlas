import { BrandLogo } from "@/components/brands/BrandLogo";

interface BrandPageHeroProps {
  name: string;
  eyebrow: string;
  tagline: string;
  logoSrc?: string;
}

export function BrandPageHero({ name, eyebrow, tagline, logoSrc }: BrandPageHeroProps) {
  return (
    <header className="mb-10 overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white via-amber-50/40 to-stone-100 p-6 sm:p-8 dark:border-stone-800 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-950">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <BrandLogo name={name} src={logoSrc} size="hero" priority />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-5xl">
            {name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
            {tagline}
          </p>
        </div>
      </div>
    </header>
  );
}
