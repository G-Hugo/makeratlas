import type { Dictionary } from "@/i18n/dictionaries/types";
import { siteLegal } from "@/lib/site-legal";
import { InfoProse } from "@/components/pages/InfoPageLayout";

type LegalPage = "notice" | "privacy" | "cookies";

export function LegalContent({
  page,
  dict,
}: {
  page: LegalPage;
  dict: Dictionary;
}) {
  const c = dict.legal[page];
  const vars: Record<string, string> = {
    site: siteLegal.publisherName,
    publisher: siteLegal.publisherLegalName,
    email: siteLegal.contactEmail,
    url: siteLegal.siteUrl,
    address: siteLegal.postalAddress,
    host: siteLegal.hostName,
    hostAddress: siteLegal.hostAddress,
    country: siteLegal.country,
    date: siteLegal.policyLastUpdated,
  };

  const interpolate = (text: string) =>
    text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);

  return (
    <InfoProse>
      <p className="!mt-0 text-sm text-stone-500">
        {interpolate(dict.legal.lastUpdatedLabel)}
      </p>
      {c.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p}>{interpolate(p)}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{interpolate(item)}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </InfoProse>
  );
}
