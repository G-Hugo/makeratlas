/**
 * Full editorial clean: EN JSON + FR overlays (pros/cons/depth, materials, polish).
 * Respects hand-written FR when tierEditorialOverride + quality pros already in overlay.
 *
 * Run: npx tsx scripts/editorial-clean-pass.ts
 */
import fs from "fs";
import path from "path";
import { sortMachinesByPower } from "../src/lib/catalog-display";
import { dedupeBulletList } from "../src/lib/editorial-dedupe";
import {
  looksEnglishEditorial,
  polishFrenchEditorialList,
  polishFrenchEditorialText,
} from "../src/lib/editorial-fr-polish";
import { translateMaterialList } from "../src/lib/editorial-materials-fr";
import { readPublishedMachines } from "../src/lib/machines-data";
import {
  buildEditorialDepth,
  buildMachineTierEditorial,
  buildSingleMachineEditorial,
  hasBoilerplatePros,
} from "../src/lib/power-tier-editorial";
import type { Machine, MachineEditorialDepth, MachineMaterials } from "../src/types/machine";

const machinesDir = path.join(process.cwd(), "content", "machines");
const frDir = path.join(process.cwd(), "content", "translations", "fr", "machines");

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function stripName(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*W\b/i, "").trim();
}

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

function needsDepth(depth?: MachineEditorialDepth): boolean {
  const a = depth?.advantages?.trim() ?? "";
  const l = depth?.limitations?.trim() ?? "";
  return a.length < 80 || l.length < 80 || looksEnglishEditorial(a) || looksEnglishEditorial(l);
}

function needsProsRefresh(pros: string[] | undefined, machine: Machine): boolean {
  if (!pros?.length || pros.length < 3) return true;
  if (hasBoilerplatePros(pros)) return true;
  if (pros.some((p) => looksEnglishEditorial(p))) return true;
  if (machine.tagline && pros.includes(machine.tagline)) return true;
  return false;
}

function hasHandcraftedFr(
  overlay: Record<string, unknown>,
  en: Machine,
): boolean {
  if (!en.tierEditorialOverride) return false;
  const pros = overlay.pros as string[] | undefined;
  if (!pros?.length || pros.length < 3) return false;
  if (pros.some((p) => hasBoilerplatePros([p]))) return false;
  if (pros.some((p) => looksEnglishEditorial(p))) return false;
  if (/Châssis ouvert$/i.test(pros.join(" ")) || /qu'une Châssis/i.test(pros.join(" "))) {
    return false;
  }
  return true;
}

function finalizePros(
  pros: string[],
  fallback: string[],
  min = 3,
  extras: string[] = [],
): string[] {
  const pool = [...pros, ...fallback, ...extras].filter(
    (p) => p?.trim() && !hasBoilerplatePros([p]),
  );
  const out: string[] = [];
  for (const item of pool) {
    if (out.length >= min) break;
    const dup = out.some(
      (existing) =>
        existing.slice(0, 32) === item.slice(0, 32) || existing.toLowerCase() === item.toLowerCase(),
    );
    if (!dup) out.push(item);
  }
  if (out.length < min) {
    return dedupeBulletList(pool, Math.min(min, pool.length)).slice(0, 6);
  }
  return dedupeBulletList(out, min).slice(0, 6);
}

function enCopyNeedsFix(machine: Machine): boolean {
  const blob = [...(machine.pros ?? []), ...(machine.cons ?? [])].join(" ");
  return /châssis ouvert|Châssis ouvert|cette fiche|Open frame:/i.test(blob);
}

function extraProsForMachine(machine: Machine, locale: "en" | "fr"): string[] {
  const area = machine.specs?.workArea?.trim();
  if (locale === "fr") {
    return [
      area ? `Surface utile ${area} : validez vos formats avant achat` : "",
      `Logiciels de la fiche : essayez votre flux sur chutes avant production`,
    ].filter(Boolean);
  }
  return [
    area ? `Work area ${area} : confirm your typical job sizes fit the bed` : "",
    `Software on the profile : trial your workflow on scrap before production`,
  ].filter(Boolean);
}

function ensureCons(machine: Machine, locale: "en" | "fr", replace = false): string[] {
  const cons = replace ? [] : [...(machine.cons ?? [])];
  if (cons.length >= 3) {
    return locale === "fr" ? polishFrenchEditorialList(cons).slice(0, 6) : cons.slice(0, 6);
  }

  const extras =
    locale === "fr"
      ? machine.laserType === "co2"
        ? [
            "Évacuation vers l’extérieur indispensable pour la découpe régulière",
            "Durée de vie et coût de remplacement du tube à budgéter",
          ]
        : machine.laserType === "fiber"
          ? [
              "Ne découpe pas bois, cuir ni acrylique : marquage métal uniquement",
              "Extraction utile sur métaux avec spray ou revêtement",
            ]
          : [
              "Acrylique transparent et production épaisse : plutôt CO₂ qu’une diode seule",
              "Vérifiez la puissance optique sur l’annonce avant achat",
            ]
      : machine.laserType === "co2"
        ? [
            "Ventilation to the outside is mandatory for regular cutting, not an optional upgrade",
            "Tube life and replacement cost are part of the true ownership budget",
          ]
        : machine.laserType === "fiber"
          ? [
              "Does not cut wood, leather, or acrylic : metal marking workflows only",
              "Fume extraction still matters for coated metals and marking sprays",
            ]
          : [
              "Clear cast acrylic and thick production cutting still favor CO₂, not diode power alone",
              "Confirm optical wattage on the listing before you buy",
            ];

  for (const line of extras) {
    if (cons.length >= 3) break;
    if (!cons.some((c) => c.slice(0, 28) === line.slice(0, 28))) cons.push(line);
  }
  return locale === "fr" ? polishFrenchEditorialList(cons).slice(0, 6) : cons.slice(0, 6);
}

function applyFrMaterials(
  overlay: Record<string, unknown>,
  machine: Machine,
): void {
  const en = machine.materials;
  const fr = overlay.materials as MachineMaterials | undefined;
  overlay.materials = {
    engrave: translateMaterialList(fr?.engrave ?? en.engrave) ?? en.engrave,
    cut: translateMaterialList(fr?.cut ?? en.cut) ?? en.cut,
    cannot: translateMaterialList(fr?.cannot ?? en.cannot) ?? en.cannot,
  };
}

function polishOverlay(
  overlay: Record<string, unknown>,
  machine: Machine,
  preserveLists = false,
): void {
  for (const key of [
    "tagline",
    "tldr",
    "mainObjective",
    "primaryUse",
    "beginnerNotes",
    "proTips",
  ] as const) {
    const v = overlay[key];
    if (typeof v === "string" && v.trim()) {
      overlay[key] = polishFrenchEditorialText(v);
    }
  }
  if (!preserveLists) {
    if (Array.isArray(overlay.pros)) {
      const polished = polishFrenchEditorialList(overlay.pros as string[]).filter(
        (p) => !hasBoilerplatePros([p]),
      );
      overlay.pros = finalizePros(polished, polished, 3, extraProsForMachine(machine, "fr"));
    }
    if (Array.isArray(overlay.cons)) {
      overlay.cons = dedupeBulletList(polishFrenchEditorialList(overlay.cons as string[]), 2).slice(
        0,
        6,
      );
    }
  } else {
    if (Array.isArray(overlay.pros)) {
      overlay.pros = polishFrenchEditorialList(overlay.pros as string[]);
    }
    if (Array.isArray(overlay.cons)) {
      overlay.cons = polishFrenchEditorialList(overlay.cons as string[]);
    }
  }
  const depth = overlay.editorialDepth as MachineEditorialDepth | undefined;
  if (depth?.advantages) {
    overlay.editorialDepth = {
      advantages: polishFrenchEditorialText(depth.advantages),
      limitations: polishFrenchEditorialText(depth.limitations ?? ""),
    };
  }
  if (Array.isArray(overlay.bestFor)) {
    overlay.bestFor = polishFrenchEditorialList(overlay.bestFor as string[]);
  }
  const note = (overlay.priceRange as { note?: string } | undefined)?.note;
  if (note) {
    overlay.priceRange = {
      ...(overlay.priceRange as object),
      note: polishFrenchEditorialText(note),
    };
  }
}

function main() {
  const all = readPublishedMachines().filter((m) => !m.catalogHidden);
  const byLine = groupTiers(all);
  let enUpdated = 0;
  let frUpdated = 0;
  let frHandKept = 0;

  for (const machine of all) {
    const lineKey = machine.modelLine ?? machine.slug;
    const group = sortMachinesByPower(
      (byLine.get(lineKey) ?? [machine]).filter((m) => !m.catalogHidden),
    );
    const tiers = group.length >= 2 ? group : [machine];
    const isMulti = tiers.length >= 2;

    const enPath = path.join(machinesDir, `${machine.slug}.json`);
    const enData = readJson<Machine>(enPath);
    let enChanged = enCopyNeedsFix(enData);

    const depthEn = buildEditorialDepth(machine, tiers, "en");
    if (needsDepth(enData.editorialDepth)) {
      enData.editorialDepth = depthEn;
      enChanged = true;
    }

    const handLocked =
      enData.tierEditorialOverride === true &&
      !needsProsRefresh(enData.pros, enData) &&
      !enCopyNeedsFix(enData) &&
      (enData.pros?.length ?? 0) >= 3 &&
      (enData.cons?.length ?? 0) >= 3;

    if (!handLocked) {
      const copy = isMulti
        ? buildMachineTierEditorial(machine, tiers, "en")
        : buildSingleMachineEditorial(machine, "en");
      if (copy) {
        enData.bestFor = copy.bestFor;
        let pros = copy.pros.filter((p) => !hasBoilerplatePros([p]));
        while (pros.length < 4) {
          pros.push(
            `${machine.brand} ${stripName(machine.name)} : compare benchmarks and material limits on this profile before ordering.`,
          );
        }
        enData.pros = finalizePros(pros, copy.pros, 4, extraProsForMachine(machine, "en"));
        const cleanCons = copy.cons.filter((c) => !/châssis/i.test(c));
        enData.cons =
          cleanCons.length >= 3
            ? cleanCons.slice(0, 6)
            : ensureCons({ ...enData, cons: cleanCons }, "en", true);
        enData.beginnerNotes = copy.beginnerNotes;
        enData.proTips = copy.proTips;
        enData.primaryUse = copy.primaryUse;
        if (!enData.mainObjective?.trim() || looksEnglishEditorial(enData.mainObjective)) {
          enData.mainObjective = copy.mainObjective;
        }
        enChanged = true;
      }
    } else if ((enData.cons?.length ?? 0) < 3) {
      enData.cons = ensureCons(enData, "en");
      enChanged = true;
    }

    if ((enData.pros?.length ?? 0) < 3) enChanged = true;
    if ((enData.cons?.length ?? 0) < 3) enChanged = true;

    if (enCopyNeedsFix(enData)) {
      const copyFix = isMulti
        ? buildMachineTierEditorial(machine, tiers, "en")
        : buildSingleMachineEditorial(machine, "en");
      if (copyFix) {
        const cleanCons = copyFix.cons.filter((c) => !/châssis/i.test(c));
        enData.cons =
          cleanCons.length >= 3
            ? cleanCons.slice(0, 6)
            : ensureCons({ ...enData, cons: cleanCons }, "en", true);
        enData.pros = finalizePros(
          copyFix.pros,
          copyFix.pros,
          4,
          extraProsForMachine(machine, "en"),
        );
        enChanged = true;
      }
    }

    if (enChanged) {
      const copyFix = isMulti
        ? buildMachineTierEditorial(machine, tiers, "en")
        : buildSingleMachineEditorial(machine, "en");
      if (copyFix) {
        enData.pros = finalizePros(
          enData.pros ?? [],
          copyFix.pros,
          4,
          extraProsForMachine(machine, "en"),
        );
        enData.cons = ensureCons(
          { ...enData, cons: copyFix.cons.filter((c) => !/châssis/i.test(c)) },
          "en",
          true,
        );
      }
    }

    if (enChanged) {
      enData.tierEditorialOverride = true;
      writeJson(enPath, enData);
      enUpdated++;
    }

    const frPath = path.join(frDir, `${machine.slug}.json`);
    const frOverlay: Record<string, unknown> = fs.existsSync(frPath)
      ? readJson<Record<string, unknown>>(frPath)
      : {};

    let frChanged = false;
    const handcrafted = hasHandcraftedFr(frOverlay, enData);
    const depthFr = buildEditorialDepth(machine, tiers, "fr");
    if (needsDepth(frOverlay.editorialDepth as MachineEditorialDepth | undefined)) {
      frOverlay.editorialDepth = depthFr;
      frChanged = true;
    }

    const frCopy = isMulti
      ? buildMachineTierEditorial(machine, tiers, "fr")
      : buildSingleMachineEditorial(machine, "fr");

    if (handcrafted) {
      frHandKept++;
    }

    if (!handcrafted && frCopy) {
      const pros = frCopy.pros.filter((p) => !hasBoilerplatePros([p]));
      frOverlay.bestFor = frCopy.bestFor;
      frOverlay.pros = finalizePros(pros, frCopy.pros, 3, extraProsForMachine(machine, "fr"));
      frOverlay.cons = dedupeBulletList(frCopy.cons, 2).slice(0, 6);
      frOverlay.beginnerNotes = frCopy.beginnerNotes;
      frOverlay.proTips = frCopy.proTips;
      frOverlay.primaryUse = frCopy.primaryUse;
      frOverlay.mainObjective = frCopy.mainObjective;
      frChanged = true;
    } else if (frCopy) {
      for (const field of [
        "mainObjective",
        "primaryUse",
        "beginnerNotes",
        "proTips",
      ] as const) {
        const cur = frOverlay[field] as string | undefined;
        const next = frCopy[field];
        if (next?.trim() && looksEnglishEditorial(cur)) {
          frOverlay[field] = next;
          frChanged = true;
        }
      }
    }

    const beforeMaterials = JSON.stringify(frOverlay.materials ?? null);
    applyFrMaterials(frOverlay, enData);
    if (JSON.stringify(frOverlay.materials) !== beforeMaterials) frChanged = true;

    polishOverlay(frOverlay, machine, handcrafted);
    frChanged = true;

    if (frChanged) {
      fs.mkdirSync(frDir, { recursive: true });
      writeJson(frPath, frOverlay);
      frUpdated++;
    }
  }

  console.log(`Profiles processed: ${all.length}`);
  console.log(`EN JSON updated: ${enUpdated}`);
  console.log(`FR overlays written: ${frUpdated}`);
  console.log(`FR hand-crafted pros kept: ${frHandKept}`);
}

main();
