import fs from "fs";
import path from "path";
import type { Machine } from "@/types/machine";

const machinesDir = path.join(process.cwd(), "content", "machines");

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

/** Published machines from JSON source (English, no locale overlay). */
export function readPublishedMachines(): Machine[] {
  if (!fs.existsSync(machinesDir)) return [];

  return fs
    .readdirSync(machinesDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<Machine>(path.join(machinesDir, file)))
    .filter((machine) => machine.status === "published")
    .sort((a, b) => b.rating.overall - a.rating.overall);
}

export function readMachineBySlug(slug: string): Machine | undefined {
  const filePath = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const machine = readJsonFile<Machine>(filePath);
  return machine.status === "published" ? machine : undefined;
}
