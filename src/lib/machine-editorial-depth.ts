import type { Locale } from "@/i18n/config";
import { noEmDash } from "@/lib/copy-style";
import { getMachineStandoutFeatures } from "@/lib/machine-standout-features";
import { machineIsEnclosed } from "@/lib/machine-accessories";
import type { Machine, MachineEditorialDepth } from "@/types/machine";

type EditorialSlice = Pick<Machine, "pros" | "cons" | "beginnerNotes">;

function sentenceJoin(parts: string[], locale: Locale): string {
  const clean = parts.map((p) => p.trim().replace(/\s+/g, " ")).filter(Boolean);
  if (clean.length === 0) return "";
  return clean.join(locale === "fr" ? " " : " ");
}

function expandBullet(bullet: string, locale: Locale): string {
  const b = bullet.trim();
  if (b.length >= 120) return b.endsWith(".") ? b : `${b}.`;
  if (locale === "fr") {
    return `En pratique : ${b.charAt(0).toLowerCase()}${b.slice(1)}${b.endsWith(".") ? "" : "."}`;
  }
  return `In practice: ${b.charAt(0).toLowerCase()}${b.slice(1)}${b.endsWith(".") ? "" : "."}`;
}

function buildAdvantages(
  machine: Machine,
  editorial: EditorialSlice,
  locale: Locale,
): string {
  const standouts = getMachineStandoutFeatures(machine, locale);
  const parts: string[] = [];

  if (machine.tldr?.trim()) {
    parts.push(
      locale === "fr"
        ? `${machine.tldr.trim()} Voici ce que cela change concrètement au quotidien.`
        : `${machine.tldr.trim()} Here is what that means day to day.`,
    );
  }

  for (const feature of standouts.slice(0, 2)) {
    parts.push(feature.body);
  }

  const pros = editorial.pros?.slice(0, 3) ?? [];
  for (const pro of pros) {
    if (parts.some((p) => p.includes(pro.slice(0, 40)))) continue;
    parts.push(expandBullet(pro, locale));
  }

  if (parts.length < 2 && machine.beginnerNotes?.trim()) {
    const note = machine.beginnerNotes.trim();
    parts.push(note.length > 280 ? `${note.slice(0, 277)}…` : note);
  }

  return sentenceJoin(parts.slice(0, 4), locale);
}

function buildLimitations(
  machine: Machine,
  editorial: EditorialSlice,
  locale: Locale,
): string {
  const parts: string[] = [];
  const enclosed = machineIsEnclosed(machine);

  if (!enclosed && machine.laserType === "diode") {
    parts.push(
      locale === "fr"
        ? "Sans enceinte d’usine, la sécurité et la ventilation reposent sur vous : lunettes adaptées, extraction, et règles claires autour de la machine."
        : "Without a factory enclosure, safety and ventilation are on you: proper glasses, exhaust, and clear rules around the machine.",
    );
  }

  if (machine.laserType === "co2") {
    parts.push(
      locale === "fr"
        ? "Un CO₂ demande une vraie stratégie d’évacuation (souvent vers l’extérieur) et l’entretien du tube : ce n’est pas un appareil « brancher et oublier » comme une petite diode."
        : "CO₂ needs a real exhaust strategy (often outdoors) and tube maintenance : not a plug-and-forget appliance like a small diode.",
    );
  }

  const cons = editorial.cons?.slice(0, 4) ?? [];
  for (const con of cons) {
    if (parts.some((p) => p.includes(con.slice(0, 35)))) continue;
    parts.push(expandBullet(con, locale));
  }

  if (parts.length === 0 && editorial.cons?.[0]) {
    parts.push(expandBullet(editorial.cons[0], locale));
  }

  return sentenceJoin(parts.slice(0, 4), locale);
}

export function getMachineEditorialDepth(
  machine: Machine,
  locale: Locale,
  editorial: EditorialSlice,
): MachineEditorialDepth | null {
  if (machine.editorialDepth?.advantages?.trim() && machine.editorialDepth?.limitations?.trim()) {
    return {
      advantages: noEmDash(machine.editorialDepth.advantages),
      limitations: noEmDash(machine.editorialDepth.limitations),
    };
  }

  const advantages = buildAdvantages(machine, editorial, locale);
  const limitations = buildLimitations(machine, editorial, locale);

  if (!advantages.trim() && !limitations.trim()) return null;

  return {
    advantages: noEmDash(advantages.trim()),
    limitations: noEmDash(limitations.trim()),
  };
}
