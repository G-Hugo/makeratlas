import type { Locale } from "@/i18n/config";
import { BEST_OF_YEAR } from "@/lib/best-of";
import { formatMachinePowerBubble } from "@/lib/power-display";
import { formatMoney } from "@/lib/pricing";
import type { Machine } from "@/types/machine";

/** Google shows roughly 155-160 characters of a meta description. */
const DESCRIPTION_MAX = 158;

function clip(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : cut.length).replace(/[,;:.\s]+$/, "")}…`;
}

function workArea(machine: Machine): string {
  return machine.specs.workArea.replace(/\s*\(.*?\)\s*/g, "").trim();
}

function startingPrice(machine: Machine, locale: Locale): string {
  return formatMoney(machine.priceRange.min, locale === "fr" ? "EUR" : "USD");
}

/** "xTool F2 vs xTool F1" reads as "xTool F2 vs F1", matching how people search. */
export function duelNames(a: Machine, b: Machine): [string, string] {
  if (a.brand === b.brand && b.name.startsWith(`${b.brand} `)) {
    return [a.name, b.name.slice(b.brand.length + 1)];
  }
  return [a.name, b.name];
}

function keyFacts(machine: Machine, locale: Locale): string {
  const power = formatMachinePowerBubble(machine, locale);
  const area = workArea(machine);
  const hasArea = area && area !== "—";
  if (locale === "fr") {
    const price = machine.discontinued ? "plus vendue neuve" : `dès ${startingPrice(machine, locale)}`;
    return [power, hasArea ? `zone de ${area}` : null, price].filter(Boolean).join(", ");
  }
  const price = machine.discontinued ? "no longer sold new" : `from ${startingPrice(machine, locale)}`;
  return [power, hasArea ? `${area} work area` : null, price].filter(Boolean).join(", ");
}

export function machineMetaTitle(machine: Machine, locale: Locale): string {
  return locale === "fr"
    ? `${machine.name} : avis ${BEST_OF_YEAR}, prix et caractéristiques`
    : `${machine.name} Review ${BEST_OF_YEAR}: Specs, Price, Verdict`;
}

export function machineMetaDescription(machine: Machine, locale: Locale): string {
  return clip(`${keyFacts(machine, locale)}. ${machine.tldr}`);
}

export function duelMetaTitle(a: Machine, b: Machine, locale: Locale): string {
  const [na, nb] = duelNames(a, b);
  const full =
    locale === "fr"
      ? `${na} ou ${nb} (${BEST_OF_YEAR}) : laquelle choisir ?`
      : `${na} vs ${nb} (${BEST_OF_YEAR}): Which Should You Buy?`;
  // Long model names: keep the names and year, drop the question Google would cut off.
  if (full.length <= 60) return full;
  return locale === "fr" ? `${na} ou ${nb} (${BEST_OF_YEAR})` : `${na} vs ${nb} (${BEST_OF_YEAR})`;
}

/** Power and price only: both machines have to fit in one snippet. */
function duelFacts(machine: Machine, locale: Locale): string {
  const power = formatMachinePowerBubble(machine, locale);
  if (locale === "fr") {
    return `${power}, ${machine.discontinued ? "plus vendue neuve" : `dès ${startingPrice(machine, locale)}`}`;
  }
  return `${power}, ${machine.discontinued ? "no longer sold new" : `from ${startingPrice(machine, locale)}`}`;
}

function score(machine: Machine, locale: Locale): string {
  const value = machine.rating.overall.toFixed(1);
  return locale === "fr" ? value.replace(".", ",") : value;
}

export function duelMetaDescription(a: Machine, b: Machine, locale: Locale): string {
  const [na, nb] = duelNames(a, b);
  const [sa, sb] = [score(a, locale), score(b, locale)];
  const scored = !a.announced && !b.announced;
  if (locale === "fr") {
    const scores = scored ? `Nous les notons ${sa} et ${sb}/10. ` : "";
    return clip(
      `${na} ou ${nb} ? ${scores}${na} : ${duelFacts(a, locale)}. ${nb} : ${duelFacts(b, locale)}. Vitesse, matériaux et verdict.`,
    );
  }
  const scores = scored ? `We score them ${sa} and ${sb}/10. ` : "";
  return clip(
    `${na} or ${nb}? ${scores}${na}: ${duelFacts(a, locale)}. ${nb}: ${duelFacts(b, locale)}. Speed, materials and verdict.`,
  );
}
