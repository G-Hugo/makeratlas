/**
 * Apply standardized benchmark sizes to all machines.
 * Run: node scripts/apply-benchmarks.mjs
 */

import fs from "fs";
import path from "path";
import { buildExamples, BENCHMARK_TIMES } from "./benchmark-config.mjs";

const machinesDir = path.join(process.cwd(), "content", "machines");

for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(machinesDir, file);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const slug = machine.slug;

  const examples = buildExamples(slug, machine.laserType);
  const perf = machine.specs.performance;

  machine.specs.performance = {
    precision: perf.precision,
    ...examples,
    technical: perf.technical || {
      spotSize: "—",
      maxSpeed: "—",
      avgEngraveSpeed: "—",
      avgCutSpeed: "—",
    },
  };

  if (!BENCHMARK_TIMES[slug]) {
    console.warn(`⚠ ${slug}: using default benchmark times`);
  }

  fs.writeFileSync(filePath, JSON.stringify(machine, null, 2) + "\n");
  console.log(`Updated ${slug}`);
}

console.log("Benchmarks applied.");
