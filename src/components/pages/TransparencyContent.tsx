import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { siteLegal } from "@/lib/site-legal";
import { InfoCallout, InfoProse } from "@/components/pages/InfoPageLayout";

export function TransparencyContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.transparencyContent;

  return (
    <>
      <InfoProse>
        <h2>{c.affiliateTitle}</h2>
        <p>{c.affiliateBody}</p>

        <h2>{c.independenceTitle}</h2>
        <ul>
          {c.independenceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{c.refuseTitle}</h2>
        <ul>
          {c.refuseItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{c.correctionsTitle}</h2>
        <p>
          {c.correctionsBody}{" "}
          <a href={`mailto:${siteLegal.contactEmail}`} className="text-amber-700">
            {siteLegal.contactEmail}
          </a>
          .
        </p>

        <h2>{c.safetyTitle}</h2>
        <p>
          {c.safetyBody}{" "}
          <LocaleLink href="/guides/laser-safety-basics" locale={locale}>
            {dict.footer.safety}
          </LocaleLink>
          .
        </p>
      </InfoProse>

      <InfoCallout variant="neutral">
        <p className="font-medium">{c.legalHintTitle}</p>
        <p className="mt-2">
          {c.legalHintBody}{" "}
          <LocaleLink href="/legal" locale={locale}>
            {dict.footer.legalNotice}
          </LocaleLink>
          ,{" "}
          <LocaleLink href="/privacy" locale={locale}>
            {dict.footer.privacy}
          </LocaleLink>
          .
        </p>
      </InfoCallout>
    </>
  );
}
