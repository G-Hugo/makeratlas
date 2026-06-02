import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localizedPath } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  locale: Locale;
  href: string;
};

export function LocaleLink({ locale, href, ...props }: LocaleLinkProps) {
  return <Link href={localizedPath(locale, href)} {...props} />;
}
