import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { InfoCallout, InfoProse } from "@/components/pages/InfoPageLayout";

export function AboutContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.aboutContent;

  return (
    <>
      <InfoProse>
        <h2>{c.whyTitle}</h2>
        <p>{c.whyBody}</p>

        <h2>{c.principlesTitle}</h2>
        <ul>
          {c.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{c.whoTitle}</h2>
        <p>{c.whoBody}</p>

        <h2>{c.coverageTitle}</h2>
        <p>{c.coverageBody}</p>
      </InfoProse>

      <InfoCallout variant="amber">
        <p className="font-semibold">{c.ctaTitle}</p>
        <p className="mt-2">{c.ctaBody}</p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>
            <LocaleLink href="/guides/laser-buying-guide-2026" locale={locale}>
              {c.ctaBuying}
            </LocaleLink>
          </li>
          <li>
            <LocaleLink href="/guides/understanding-laser-types" locale={locale}>
              {c.ctaTypes}
            </LocaleLink>
          </li>
          <li>
            <LocaleLink href="/lasers" locale={locale}>
              {c.ctaCatalog}
            </LocaleLink>
          </li>
        </ul>
      </InfoCallout>
    </>
  );
}
