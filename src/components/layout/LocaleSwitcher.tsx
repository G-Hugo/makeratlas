"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { stripLocaleFromPathname } from "@/i18n/navigation";
import { localizedPath } from "@/i18n/navigation";

interface LocaleSwitcherProps {
  locale: Locale;
  labels: Dictionary["localeSwitcher"];
}

export function LocaleSwitcher({ locale, labels }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? "/";
  const pathWithoutLocale = stripLocaleFromPathname(pathname);

  return (
    <div
      className="flex items-center rounded-md border border-stone-200 bg-stone-50 p-0.5 text-xs font-medium dark:border-stone-700 dark:bg-stone-900"
      role="group"
      aria-label="Language"
    >
      {locales.map((loc) => {
        const active = loc === locale;
        return (
          <Link
            key={loc}
            href={localizedPath(loc, pathWithoutLocale)}
            className={`rounded px-2.5 py-1.5 transition ${
              active
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-100"
                : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }`}
            aria-current={active ? "true" : undefined}
          >
            {labels[loc]}
          </Link>
        );
      })}
    </div>
  );
}
