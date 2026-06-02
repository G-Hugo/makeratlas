import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { LocaleLink } from "@/components/layout/LocaleLink";

export interface InfoRelatedLink {
  href: string;
  label: string;
  description?: string;
}

interface InfoPageLayoutProps {
  locale: Locale;
  dict: Dictionary;
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  related?: InfoRelatedLink[];
}

export function InfoPageLayout({
  locale,
  dict,
  eyebrow,
  title,
  subtitle,
  children,
  related,
}: InfoPageLayoutProps) {
  const p = dict.infoPage;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-8 text-sm text-stone-500">
        <LocaleLink href="/" locale={locale} className="hover:text-amber-700">
          {p.breadcrumbHome}
        </LocaleLink>
        <span className="mx-2">/</span>
        <span className="text-stone-800">{title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        <article>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              {eyebrow}
            </p>
          )}
          <h1
            className={`font-bold tracking-tight text-stone-900 ${eyebrow ? "mt-2" : ""} text-3xl sm:text-4xl`}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">{subtitle}</p>
          {children}
        </article>

        {related && related.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-stone-900">{p.relatedTitle}</h2>
              <ul className="mt-4 space-y-3">
                {related.map((link) => (
                  <li key={link.href}>
                    <LocaleLink
                      href={link.href}
                      locale={locale}
                      className="block rounded-lg border border-transparent px-2 py-1.5 transition hover:border-amber-200 hover:bg-amber-50"
                    >
                      <span className="text-sm font-medium text-amber-800">{link.label}</span>
                      {link.description && (
                        <span className="mt-0.5 block text-xs text-stone-500">
                          {link.description}
                        </span>
                      )}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export function InfoProse({ children }: { children: ReactNode }) {
  return (
    <div className="prose prose-stone mt-10 max-w-none prose-headings:scroll-mt-24 prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline">
      {children}
    </div>
  );
}

export function InfoCallout({
  variant = "neutral",
  children,
}: {
  variant?: "neutral" | "amber" | "sky";
  children: ReactNode;
}) {
  const styles = {
    neutral: "border-stone-200 bg-stone-50 text-stone-800",
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    sky: "border-sky-200 bg-sky-50 text-sky-950",
  };
  return (
    <div className={`mt-8 rounded-xl border p-5 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}

/** Shared related links for trust / legal cluster */
export function trustRelatedLinks(dict: Dictionary): InfoRelatedLink[] {
  return [
    {
      href: "/methodology",
      label: dict.footer.methodology,
      description: dict.infoPage.relatedMethodology,
    },
    {
      href: "/transparency",
      label: dict.footer.transparency,
      description: dict.infoPage.relatedTransparency,
    },
    {
      href: "/about",
      label: dict.footer.about,
      description: dict.infoPage.relatedAbout,
    },
  ];
}

export function legalRelatedLinks(dict: Dictionary): InfoRelatedLink[] {
  return [
    {
      href: "/legal",
      label: dict.footer.legalNotice,
      description: dict.infoPage.relatedLegal,
    },
    {
      href: "/privacy",
      label: dict.footer.privacy,
      description: dict.infoPage.relatedPrivacy,
    },
    {
      href: "/cookies",
      label: dict.footer.cookies,
      description: dict.infoPage.relatedCookies,
    },
  ];
}
