/**
 * Full editorial pass: editorialDepth + consistent pros/cons on every published profile.
 * Respects tierEditorialOverride (depth-only refresh when pros are already hand-written).
 *
 * Run: npx tsx scripts/editorial-full-catalog-pass.ts
 */
import fs from "fs";
import path from "path";
import { sortMachinesByPower } from "../src/lib/catalog-display";
import { readPublishedMachines } from "../src/lib/machines-data";
import {
  buildEditorialDepth,
  buildMachineTierEditorial,
  buildSingleMachineEditorial,
  hasBoilerplatePros,
} from "../src/lib/power-tier-editorial";
import type { Machine, MachineEditorialDepth } from "../src/types/machine";

const machinesDir = path.join(process.cwd(), "content", "machines");
const frDir = path.join(process.cwd(), "content", "translations", "fr", "machines");

function readJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
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
  return a.length < 80 || l.length < 80;
}

function needsProsRefresh(machine: Machine): boolean {
  const pros = machine.pros ?? [];
  if (pros.length < 3) return true;
  if (hasBoilerplatePros(pros)) return true;
  if (machine.tagline && pros.includes(machine.tagline)) return true;
  return false;
}

function ensureCons(machine: Machine): string[] {
  const cons = [...(machine.cons ?? [])];
  if (cons.length >= 3) return cons;
  const extras =
    machine.laserType === "co2"
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
    if (!cons.some((c) => c.slice(0, 30) === line.slice(0, 30))) cons.push(line);
  }
  return cons.slice(0, 6);
}

function main() {
  const all = readPublishedMachines().filter((m) => !m.catalogHidden);
  const byLine = groupTiers(all);
  let enUpdated = 0;
  let frUpdated = 0;
  let depthOnly = 0;
  let fullRefresh = 0;

  for (const machine of all) {
    const lineKey = machine.modelLine ?? machine.slug;
    const group = sortMachinesByPower(
      (byLine.get(lineKey) ?? [machine]).filter((m) => !m.catalogHidden),
    );
    const tiers = group.length >= 2 ? group : [machine];
    const isMulti = tiers.length >= 2;

    const enPath = path.join(machinesDir, `${machine.slug}.json`);
    const enData = readJson<Machine>(enPath);
    let changed = false;

    const depthEn = buildEditorialDepth(machine, tiers, "en");
    if (needsDepth(enData.editorialDepth)) {
      enData.editorialDepth = depthEn;
      changed = true;
    }

    const handLocked =
      enData.tierEditorialOverride === true && !needsProsRefresh(enData);

    if (!handLocked || hasBoilerplatePros(enData.pros ?? [])) {
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
        enData.pros = pros.slice(0, 6);
        enData.cons = ensureCons({ ...enData, cons: copy.cons });
        enData.beginnerNotes = copy.beginnerNotes;
        enData.proTips = copy.proTips;
        enData.primaryUse = copy.primaryUse;
        if (!enData.mainObjective?.trim()) enData.mainObjective = copy.mainObjective;
        enData.tierEditorialOverride = true;
        changed = true;
        fullRefresh++;
      }
    } else if (enData.cons.length < 3) {
      enData.cons = ensureCons(enData);
      changed = true;
    }

    if (handLocked && needsDepth(enData.editorialDepth)) depthOnly++;
    if (changed) {
      enData.tierEditorialOverride = true;
      fs.writeFileSync(enPath, `${JSON.stringify(enData, null, 2)}\n`);
      enUpdated++;
    }

    const depthFr = buildEditorialDepth(machine, tiers, "fr");
    const frPath = path.join(frDir, `${machine.slug}.json`);
    const frOverlay: Record<string, unknown> = fs.existsSync(frPath)
      ? readJson<Record<string, unknown>>(frPath)
      : {};

    let frChanged = false;
    if (needsDepth(frOverlay.editorialDepth as MachineEditorialDepth | undefined)) {
      frOverlay.editorialDepth = depthFr;
      frChanged = true;
    }

    if (!handLocked || hasBoilerplatePros((frOverlay.pros as string[]) ?? [])) {
      const frCopy = isMulti
        ? buildMachineTierEditorial(machine, tiers, "fr")
        : buildSingleMachineEditorial(machine, "fr");
      if (frCopy) {
        frOverlay.bestFor = frCopy.bestFor;
        frOverlay.pros = frCopy.pros;
        frOverlay.cons = frCopy.cons;
        frOverlay.beginnerNotes = frCopy.beginnerNotes;
        frOverlay.proTips = frCopy.proTips;
        frOverlay.primaryUse = frCopy.primaryUse;
        frChanged = true;
      }
    }

    if (frChanged) {
      fs.mkdirSync(frDir, { recursive: true });
      fs.writeFileSync(frPath, `${JSON.stringify(frOverlay, null, 2)}\n`);
      frUpdated++;
    }
  }

  console.log(`Published profiles processed: ${all.length}`);
  console.log(`EN JSON updated: ${enUpdated}`);
  console.log(`FR overlays updated: ${frUpdated}`);
  console.log(`Hand-locked (depth only): ${depthOnly}`);
  console.log(`Full pros/cons refresh: ${fullRefresh}`);
}

main();
