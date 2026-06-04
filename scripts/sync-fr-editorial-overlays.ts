/**
 * Refresh French overlays: pros, cons, editorialDepth, bestFor (full arrays, French copy).
 * Run: npx tsx scripts/sync-fr-editorial-overlays.ts
 */
import fs from "fs";
import path from "path";
import { sortMachinesByPower } from "../src/lib/catalog-display";
import { readPublishedMachines } from "../src/lib/machines-data";
import { dedupeBulletList } from "../src/lib/editorial-dedupe";
import {
  buildEditorialDepth,
  buildMachineTierEditorial,
  buildSingleMachineEditorial,
  hasBoilerplatePros,
} from "../src/lib/power-tier-editorial";
import type { Machine } from "../src/types/machine";

const frDir = path.join(process.cwd(), "content", "translations", "fr", "machines");

const EN_RESIDUE =
  /\b(the |and |with |for |your |without |before buying|Open-frame layout|Swappable head|Same enclosed|Best value in|Higher modules|Verify the \d+W SKU|Maker Atlas|module ·|\d+W module ·|Everyday |High-quality |Treat engraving|Use air assist|Run material test|Optimize for|Compare benchmark|Side business|Photo & logo|Engraving-focused|Flagship high-power)\b/i;

const BROKEN = /MYMEMORY WARNING/i;

function looksEnglish(s: string): boolean {
  if (!s?.trim()) return true;
  if (BROKEN.test(s)) return true;
  return EN_RESIDUE.test(s);
}

function needsTextSync(value: string | undefined): boolean {
  return !value?.trim() || looksEnglish(value);
}

function needsProsSync(overlay: Record<string, unknown>, machine: Machine): boolean {
  const pros = overlay.pros as string[] | undefined;
  if (!pros?.length) return true;
  if (pros.length < (machine.pros?.length ?? 0)) return true;
  return pros.some(looksEnglish) || pros.some((p) => hasBoilerplatePros([p]));
}

const BEST_FOR_FR: Record<string, string[]> = {
  "engrave-only": ["Gravure fine", "Photo & logo", "Cadeaux & ardoise", "Première machine"],
  "engrave-first": ["Atelier gravure", "Cuir & bois cadeau", "Apprendre la gamme", "Détail prioritaire"],
  mixed: ["Gravure + découpe", "Petite activité", "Enseignes & boîtes", "Petites séries"],
  "cut-strong": ["Découpe plus rapide", "Bois plus épais", "Panneaux", "Montée depuis 10W"],
  "cut-flagship": ["Découpe max. de la gamme", "Atelier vitesse", "Bois épais", "Semaines découpe"],
  "fiber-entry": ["Bijoux & plaques", "Petites pièces métal", "Apprendre la fibre", "Marquage bureau"],
  "fiber-mid": ["Marquage métal quotidien", "Outils & couteaux", "Étiquettes atelier", "Lots"],
  "fiber-pro": ["Gravure métal profonde", "Débit élevé", "Devis prod.", "Grandes surfaces"],
};

function groupTiers(all: Machine[]): Map<string, Machine[]> {
  const byLine = new Map<string, Machine[]>();
  for (const m of all) {
    const key = m.modelLine ?? m.slug;
    const list = byLine.get(key) ?? [];
    list.push(m);
    byLine.set(key, list);
  }
  return byLine;
}

function frenchBestFor(en: Machine): string[] {
  const role = en.bestFor?.length ? en.bestFor : [];
  if (role.length >= 4) {
    return role.map((tag) => {
      const lower = tag.toLowerCase();
      if (lower.includes("mixed engrave")) return "Gravure + découpe";
      if (lower.includes("hobby") || lower.includes("business")) return "Petite activité";
      if (lower.includes("sign")) return "Enseignes & boîtes";
      if (lower.includes("gift") || lower.includes("batch")) return "Petites séries";
      if (lower.includes("engrav")) return "Gravure";
      if (lower.includes("cut")) return "Découpe";
      return tag;
    });
  }
  return BEST_FOR_FR.mixed;
}

function main() {
  const all = readPublishedMachines().filter((m) => !m.catalogHidden);
  const byLine = groupTiers(all);
  let updated = 0;

  fs.mkdirSync(frDir, { recursive: true });

  for (const machine of all) {
    const lineKey = machine.modelLine ?? machine.slug;
    const group = sortMachinesByPower(
      (byLine.get(lineKey) ?? [machine]).filter((m) => !m.catalogHidden),
    );
    const tiers = group.length >= 2 ? group : [machine];
    const isMulti = tiers.length >= 2;

    const copy = isMulti
      ? buildMachineTierEditorial(machine, tiers, "fr")
      : buildSingleMachineEditorial(machine, "fr");

    const depth = buildEditorialDepth(machine, tiers, "fr");

    const existingPath = path.join(frDir, `${machine.slug}.json`);
    const overlay: Record<string, unknown> = fs.existsSync(existingPath)
      ? JSON.parse(fs.readFileSync(existingPath, "utf-8").replace(/^\uFEFF/, ""))
      : {};

    if (copy && needsProsSync(overlay, machine)) {
      let pros = copy.pros.filter((p) => !hasBoilerplatePros([p]));
      while (pros.length < 3) pros.push(copy.pros[pros.length] ?? copy.pros[0]);
      overlay.pros = dedupeBulletList(pros, 3).slice(0, 6);
      overlay.cons = dedupeBulletList(copy.cons, 2).slice(0, 6);
    }

    if (copy) {
      for (const field of [
        "mainObjective",
        "primaryUse",
        "beginnerNotes",
        "proTips",
      ] as const) {
        const current = overlay[field] as string | undefined;
        const next = copy[field];
        if (next?.trim() && needsTextSync(current)) overlay[field] = next;
      }
      if (copy.primaryUse?.trim() && needsTextSync(overlay.primaryUse as string | undefined)) {
        overlay.primaryUse = copy.primaryUse;
      }
    }

    if (!overlay.bestFor || (overlay.bestFor as string[]).some(looksEnglish)) {
      overlay.bestFor = frenchBestFor(machine);
    }

    const depthFr = overlay.editorialDepth as { advantages?: string; limitations?: string } | undefined;
    if (
      !depthFr?.advantages ||
      depthFr.advantages.length < 80 ||
      looksEnglish(depthFr.advantages) ||
      looksEnglish(depthFr.limitations ?? "")
    ) {
      overlay.editorialDepth = depth;
    }

    if (Array.isArray(overlay.pros)) {
      overlay.pros = dedupeBulletList(overlay.pros as string[], 3).slice(0, 6);
    }
    if (Array.isArray(overlay.cons)) {
      overlay.cons = dedupeBulletList(overlay.cons as string[], 2).slice(0, 6);
    }
    if (
      copy?.primaryUse?.trim() &&
      (needsTextSync(overlay.primaryUse as string | undefined) ||
        /\d+W module\s*·/i.test(String(overlay.primaryUse ?? "")))
    ) {
      overlay.primaryUse = copy.primaryUse;
    }

    fs.writeFileSync(existingPath, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
    updated++;
  }

  console.log(`Synced French pros/cons/depth overlays: ${updated} profiles`);
}

main();
