import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Guide, GuideMeta, LaserType, Machine } from "@/types/machine";

const contentDir = path.join(process.cwd(), "content");

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getAllMachines(): Machine[] {
  const dir = path.join(contentDir, "machines");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJsonFile<Machine>(path.join(dir, file)))
    .filter((machine) => machine.status === "published")
    .sort((a, b) => b.rating.overall - a.rating.overall);
}

export function getMachineBySlug(slug: string): Machine | undefined {
  return getAllMachines().find((machine) => machine.slug === slug);
}

export function getAllGuidesMeta(): GuideMeta[] {
  const dir = path.join(contentDir, "guides");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return data as GuideMeta;
    })
    .filter((guide) => guide.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const dir = path.join(contentDir, "guides");
  const filePath = path.join(dir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...(data as GuideMeta),
    content,
  };
}

export function getLaserTypeCounts(): Record<string, number> {
  const machines = getAllMachines();
  return machines.reduce<Record<string, number>>((acc, machine) => {
    acc[machine.laserType] = (acc[machine.laserType] ?? 0) + 1;
    return acc;
  }, {});
}

export function getMachinesByLaserType(type: LaserType): Machine[] {
  return getAllMachines().filter((machine) => machine.laserType === type);
}

export const LASER_TYPE_INFO: Record<
  LaserType,
  { label: string; description: string; guideAnchor?: string }
> = {
  diode: {
    label: "Diode",
    description:
      "Blue-light semiconductor lasers. Best for wood, leather, and budget hobby work. Cannot cut clear acrylic or mark bare metal without spray.",
    guideAnchor: "diode-lasers--the-popular-entry-point",
  },
  co2: {
    label: "CO₂",
    description:
      "Gas-tube infrared lasers. The standard for cutting acrylic and wood. Requires ventilation. Cannot mark bare metal.",
    guideAnchor: "co-lasers--the-cutting-workhorse",
  },
  fiber: {
    label: "Fiber",
    description:
      "Metal-focused lasers for marking stainless, aluminum, and brass without chemical spray.",
    guideAnchor: "fiber-lasers--the-metal-specialist",
  },
  uv: {
    label: "UV",
    description:
      "Cold laser for plastics, glass, and fine industrial marking. Rare in hobby desktop machines.",
    guideAnchor: "uv-lasers--precision-on-delicate-materials",
  },
  hybrid: {
    label: "Hybrid",
    description:
      "Machines combining two laser types (e.g. fiber + diode) for metal and organic materials.",
    guideAnchor: "hybrid-machines--fiber--diode-in-one-box",
  },
};
