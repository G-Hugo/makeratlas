import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { LocaleLink } from "@/components/layout/LocaleLink";
import { InfoCallout, InfoProse } from "@/components/pages/InfoPageLayout";
import { interpolate } from "@/lib/i18n-helpers";
import { USD_TO_EUR_RATE } from "@/lib/pricing";

export function MethodologyContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.methodologyContent;

  return (
    <>
      <InfoProse>
        <h2>{c.profileTitle}</h2>
        <ul>
          {c.profileItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>{c.powerTitle}</h2>
        <p>{c.powerBody}</p>

        <h2>{c.pricesTitle}</h2>
        <p>{interpolate(c.pricesBody, { rate: String(USD_TO_EUR_RATE) })}</p>

        <h2>{c.benchmarkTitle}</h2>
        <p>{c.benchmarkBody}</p>

        <h2>{c.precisionTitle}</h2>
        <p>{c.precisionBody}</p>

        <h2>{c.ratingsTitle}</h2>
        <p>{c.ratingsBody}</p>

        <h2>{c.updatesTitle}</h2>
        <p>{c.updatesBody}</p>

        <h2>{c.correctionsTitle}</h2>
        <p>
          {c.correctionsBody}{" "}
          <LocaleLink href="/transparency" locale={locale}>
            {dict.footer.transparency}
          </LocaleLink>
          .
        </p>
      </InfoProse>

      <InfoCallout variant="sky">
        <p>{c.disclaimer}</p>
      </InfoCallout>
    </>
  );
}
