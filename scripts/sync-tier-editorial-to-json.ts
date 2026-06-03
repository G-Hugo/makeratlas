/**
 * Sync machine-aware tier editorial into JSON (EN + FR overlays).
 * Run: npx tsx scripts/sync-tier-editorial-to-json.ts
 */
import fs from "fs";
import path from "path";
import { sortMachinesByPower } from "../src/lib/catalog-display";
import { localizeMachine } from "../src/lib/machine-locale";
import { readPublishedMachines } from "../src/lib/machines-data";
import { buildMachineTierEditorial } from "../src/lib/power-tier-editorial";
import type { Machine } from "../src/types/machine";

const root = process.cwd();
const machinesDir = path.join(root, "content", "machines");
const frDir = path.join(root, "content", "translations", "fr", "machines");

function groupTiers(all: Machine[]): Map<string, Machine[]> {
  const byLine = new Map<string, Machine[]>();
  for (const m of all) {
    if (!m.modelLine) continue;
    const list = byLine.get(m.modelLine) ?? [];
    list.push(m);
    byLine.set(m.modelLine, list);
  }
  return byLine;
}

function main() {
  const all = readPublishedMachines();
  const byLine = groupTiers(all);
  let enUpdated = 0;
  let frUpdated = 0;

  for (const [, group] of byLine) {
    const tiers = sortMachinesByPower(group.filter((m) => !m.catalogHidden));
    if (tiers.length < 2) continue;

    for (const machine of tiers) {
      const enCopy = buildMachineTierEditorial(machine, tiers, "en");
      if (!enCopy) continue;

      const enPath = path.join(machinesDir, `${machine.slug}.json`);
      const enData = JSON.parse(fs.readFileSync(enPath, "utf-8")) as Machine & {
        tierEditorialOverride?: boolean;
      };
      enData.bestFor = enCopy.bestFor;
      enData.pros = enCopy.pros;
      enData.cons = enCopy.cons;
      enData.beginnerNotes = enCopy.beginnerNotes;
      enData.proTips = enCopy.proTips;
      enData.primaryUse = enCopy.primaryUse;
      enData.tierEditorialOverride = false;
      fs.writeFileSync(enPath, `${JSON.stringify(enData, null, 2)}\n`);
      enUpdated++;

      const frMachine = localizeMachine(machine, "fr");
      const frCopy = buildMachineTierEditorial(frMachine, tiers, "fr");
      if (!frCopy) continue;

      const frPath = path.join(frDir, `${machine.slug}.json`);
      const frOverlay: Record<string, unknown> = fs.existsSync(frPath)
        ? JSON.parse(fs.readFileSync(frPath, "utf-8"))
        : {};
      frOverlay.bestFor = frCopy.bestFor;
      frOverlay.pros = frCopy.pros;
      frOverlay.cons = frCopy.cons;
      frOverlay.beginnerNotes = frCopy.beginnerNotes;
      frOverlay.proTips = frCopy.proTips;
      frOverlay.primaryUse = frCopy.primaryUse;
      fs.mkdirSync(frDir, { recursive: true });
      fs.writeFileSync(frPath, `${JSON.stringify(frOverlay, null, 2)}\n`);
      frUpdated++;
    }
  }

  console.log(`Synced EN machine JSON: ${enUpdated} profiles`);
  console.log(`Synced FR translation overlays: ${frUpdated} profiles`);
  console.log(`Multi-power lines: ${byLine.size}`);
}

main();
