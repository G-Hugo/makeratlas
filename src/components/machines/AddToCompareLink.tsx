"use client";

import { LocaleLink } from "@/components/layout/LocaleLink";
import type { Locale } from "@/i18n/config";
import { buildCompareHref } from "@/lib/compare-session";

interface AddToCompareLinkProps {
  machineSlug: string;
  locale: Locale;
  children: React.ReactNode;
  className?: string;
}

export function AddToCompareLink({
  machineSlug,
  locale,
  children,
  className,
}: AddToCompareLinkProps) {
  return (
    <LocaleLink href={buildCompareHref(machineSlug)} locale={locale} className={className}>
      {children}
    </LocaleLink>
  );
}
