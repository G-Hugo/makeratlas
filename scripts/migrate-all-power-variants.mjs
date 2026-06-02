/**
 * Create power-tier profiles for every multi-SKU product line in the catalog.
 * Run: node scripts/migrate-all-power-variants.mjs
 * Then: node scripts/apply-catalog-metadata.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const publicMachines = path.join(process.cwd(), "public", "machines");

function readMachine(slug) {
  const p = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(p)) throw new Error(`missing base: ${slug}`);
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeMachine(slug, data) {
  fs.writeFileSync(path.join(machinesDir, `${slug}.json`), `${JSON.stringify(data, null, 2)}\n`);
}

function cloneVariant(base, overrides) {
  const m = structuredClone(base);
  const { specs, priceRange, rating, materials, ...rest } = overrides;
  Object.assign(m, rest);
  if (specs) {
    m.specs = {
      ...m.specs,
      ...specs,
      performance: specs.performance
        ? { ...m.specs.performance, ...specs.performance }
        : m.specs.performance,
    };
  }
  if (priceRange) m.priceRange = { ...m.priceRange, ...priceRange };
  if (rating) m.rating = { ...m.rating, ...rating };
  if (materials) m.materials = { ...m.materials, ...materials };
  return m;
}

function copyImageDir(fromSlug, toSlug) {
  const from = path.join(publicMachines, fromSlug);
  const to = path.join(publicMachines, toSlug);
  if (!fs.existsSync(from) || fs.existsSync(to)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    fs.copyFileSync(path.join(from, file), path.join(to, file));
  }
}

function imageFromSlug(slug, name) {
  const dir = path.join(publicMachines, slug);
  if (!fs.existsSync(dir)) return null;
  const file = fs.readdirSync(dir).find((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
  if (!file) return null;
  const src = `/machines/${slug}/${file}`;
  return { image: src, images: [{ src, alt: `${name} laser engraver` }] };
}

function tierNote(power) {
  return `${power} optical module — verify SKU before buying`;
}

/** @type {Array<{ line: string, umbrella: string, primary: string, base: string, tiers: Array<{ slug: string, power: string, name: string, min: number, max: number, capability?: number, cutNote?: string }> }>} */
const GROUPS = [
  {
    line: "longer-ray5",
    umbrella: "longer-ray5",
    primary: "longer-ray5-20w",
    base: "longer-ray5",
    tiers: [
      { slug: "longer-ray5-5w", power: "5W", name: "Longer Ray5 5W", min: 199, max: 299, capability: 7.2 },
      { slug: "longer-ray5-10w", power: "10W", name: "Longer Ray5 10W", min: 249, max: 379, capability: 7.6 },
      { slug: "longer-ray5-20w", power: "20W", name: "Longer Ray5 20W", min: 299, max: 449, capability: 8 },
      { slug: "longer-ray5-40w", power: "40W", name: "Longer Ray5 40W", min: 449, max: 649, capability: 8.4 },
    ],
  },
  {
    line: "longer-laser-b1",
    umbrella: "longer-laser-b1",
    primary: "longer-laser-b1-40w",
    base: "longer-laser-b1",
    tiers: [
      { slug: "longer-laser-b1-20w", power: "20W", name: "Longer Laser B1 20W", min: 499, max: 699, capability: 8.2 },
      { slug: "longer-laser-b1-30w", power: "30W", name: "Longer Laser B1 30W", min: 599, max: 799, capability: 8.4 },
      { slug: "longer-laser-b1-40w", power: "40W", name: "Longer Laser B1 40W", min: 699, max: 949, capability: 8.6 },
    ],
  },
  {
    line: "algolaser-alpha-mk2",
    umbrella: "algolaser-alpha-mk2",
    primary: "algolaser-alpha-mk2-40w",
    base: "algolaser-alpha-mk2",
    tiers: [
      { slug: "algolaser-alpha-mk2-20w", power: "20W", name: "Algolaser Alpha MK2 20W", min: 599, max: 849, capability: 8.3 },
      { slug: "algolaser-alpha-mk2-40w", power: "40W", name: "Algolaser Alpha MK2 40W", min: 799, max: 1099, capability: 8.7 },
    ],
  },
  {
    line: "sculpfun-s9",
    umbrella: "sculpfun-s9",
    primary: "sculpfun-s9-10w",
    base: "sculpfun-s9",
    tiers: [
      { slug: "sculpfun-s9-5w", power: "5W", name: "Sculpfun S9 5W", min: 199, max: 299, capability: 7.4 },
      { slug: "sculpfun-s9-10w", power: "10W", name: "Sculpfun S9 10W", min: 299, max: 449, capability: 7.8 },
    ],
  },
  {
    line: "sculpfun-icube-pro",
    umbrella: "sculpfun-icube-pro",
    primary: "sculpfun-icube-pro-5w",
    base: "sculpfun-icube-pro",
    tiers: [
      { slug: "sculpfun-icube-pro-5w", power: "5W", name: "Sculpfun iCube Pro 5W", min: 349, max: 499 },
      { slug: "sculpfun-icube-pro-10w", power: "10W", name: "Sculpfun iCube Pro Max 10W", min: 449, max: 649, capability: 8.2 },
    ],
  },
  {
    line: "ortur-laser-master-h10",
    umbrella: "ortur-laser-master-h10",
    primary: "ortur-laser-master-h10-20w",
    base: "ortur-laser-master-h10",
    tiers: [
      { slug: "ortur-laser-master-h10-10w", power: "10W", name: "Ortur Laser Master H10 10W", min: 399, max: 549, capability: 8 },
      { slug: "ortur-laser-master-h10-20w", power: "20W", name: "Ortur Laser Master H10 20W", min: 499, max: 699, capability: 8.4 },
      { slug: "ortur-laser-master-h10-40w", power: "40W", name: "Ortur Laser Master H10 40W", min: 649, max: 899, capability: 8.7 },
    ],
  },
  {
    line: "twotrees-tts-55",
    umbrella: "twotrees-tts-55",
    primary: "twotrees-tts-55-20w",
    base: "twotrees-tts-55",
    tiers: [
      { slug: "twotrees-tts-55-10w", power: "10W", name: "TwoTrees TTS-55 10W", min: 179, max: 279, capability: 7.2 },
      { slug: "twotrees-tts-55-20w", power: "20W", name: "TwoTrees TTS-55 20W", min: 249, max: 379, capability: 7.6 },
      { slug: "twotrees-tts-55-40w", power: "40W", name: "TwoTrees TTS-55 40W", min: 349, max: 499, capability: 8 },
    ],
  },
  {
    line: "two-trees-ts2",
    umbrella: null,
    primary: "two-trees-ts2-20w",
    base: "two-trees-ts2-20w",
    tiers: [
      { slug: "two-trees-ts2-20w", power: "20W", name: "TwoTrees TS2 20W", min: 299, max: 449 },
      { slug: "two-trees-ts2-40w", power: "40W", name: "TwoTrees TS2 40W", min: 399, max: 549, capability: 8.1 },
    ],
  },
  {
    line: "atomstack-a40-pro",
    umbrella: "atomstack-a40-pro",
    primary: "atomstack-a40-pro-40w",
    base: "atomstack-a40-pro",
    tiers: [
      { slug: "atomstack-a40-pro-20w", power: "20W", name: "Atomstack A40 Pro 20W", min: 349, max: 499, capability: 8 },
      { slug: "atomstack-a40-pro-40w", power: "40W", name: "Atomstack A40 Pro 40W", min: 399, max: 599, capability: 8.3 },
    ],
  },
  {
    line: "nubur-n4060",
    umbrella: "nubur-n4060",
    primary: "nubur-n4060-40w",
    base: "nubur-n4060",
    tiers: [
      { slug: "nubur-n4060-20w", power: "20W", name: "Nubur N4060 20W", min: 399, max: 549 },
      { slug: "nubur-n4060-40w", power: "40W", name: "Nubur N4060 40W", min: 499, max: 699 },
    ],
  },
  {
    line: "creality-falcon2",
    umbrella: null,
    primary: "creality-falcon2-22w",
    base: "creality-falcon2-12w",
    tiers: [
      { slug: "creality-falcon2-12w", power: "12W", name: "Creality Falcon2 12W", min: 349, max: 499 },
      { slug: "creality-falcon2-22w", power: "22W", name: "Creality Falcon2 22W", min: 449, max: 599, capability: 8.2 },
    ],
  },
  {
    line: "gweike-g2",
    umbrella: null,
    primary: "gweike-g2-20w",
    base: "gweike-g2-20w",
    tiers: [
      { slug: "gweike-g2-20w", power: "20W", name: "Gweike G2 20W Fiber", min: 1499, max: 2199 },
      { slug: "gweike-g2-30w", power: "30W", name: "Gweike G2 Pro 30W Fiber", min: 1999, max: 2799, capability: 8.5 },
      { slug: "gweike-g2-50w", power: "50W", name: "Gweike G2 Max 50W Fiber", min: 2499, max: 3499, capability: 8.8 },
    ],
  },
  {
    line: "gweike-g6-split",
    umbrella: null,
    primary: "gweike-g6-split-30w",
    base: "gweike-g6-split-30w",
    tiers: [
      { slug: "gweike-g6-split-30w", power: "30W", name: "Gweike G6 Split 30W", min: 2799, max: 3999 },
      { slug: "gweike-g6-split-50w", power: "50W", name: "Gweike G6 Split 50W", min: 3299, max: 4599, capability: 8.7 },
      { slug: "gweike-g6-split-70w", power: "70W", name: "Gweike G6 Split 70W", min: 3999, max: 5499, capability: 8.9 },
      { slug: "gweike-g6-split-100w", power: "100W", name: "Gweike G6 Split 100W", min: 4999, max: 6999, capability: 9.1 },
    ],
  },
  {
    line: "xtool-d1-pro",
    umbrella: "xtool-d1-pro",
    primary: "xtool-d1-pro-20w",
    base: "xtool-d1-pro",
    tiers: [
      { slug: "xtool-d1-pro-5w", power: "5W", name: "xTool D1 Pro 5W", min: 499, max: 699 },
      { slug: "xtool-d1-pro-10w", power: "10W", name: "xTool D1 Pro 10W", min: 599, max: 799 },
      { slug: "xtool-d1-pro-20w", power: "20W", name: "xTool D1 Pro 20W", min: 699, max: 899 },
    ],
  },
  {
    line: "atomstack-a5-pro",
    umbrella: "atomstack-a5-pro",
    primary: "atomstack-a5-pro-10w",
    base: "atomstack-a5-pro",
    tiers: [
      { slug: "atomstack-a5-pro-5w", power: "5W", name: "Atomstack A5 Pro 5W", min: 199, max: 299 },
      { slug: "atomstack-a5-pro-10w", power: "10W", name: "Atomstack A5 Pro 10W", min: 249, max: 349 },
      { slug: "atomstack-a5-pro-20w", power: "20W", name: "Atomstack A5 Pro 20W", min: 299, max: 399 },
    ],
  },
  {
    line: "comgrow-z1",
    umbrella: "comgrow-z1",
    primary: "comgrow-z1-10w",
    base: "comgrow-z1",
    tiers: [
      { slug: "comgrow-z1-5w", power: "5W", name: "Comgrow Z1 5W", min: 179, max: 249 },
      { slug: "comgrow-z1-10w", power: "10W", name: "Comgrow Z1 10W", min: 219, max: 299 },
      { slug: "comgrow-z1-20w", power: "20W", name: "Comgrow Z1 20W", min: 279, max: 379 },
    ],
  },
  {
    line: "creality-falcon2-pro",
    umbrella: "creality-falcon2-pro",
    primary: "creality-falcon2-pro-40w",
    base: "creality-falcon2-pro",
    tiers: [
      { slug: "creality-falcon2-pro-22w", power: "22W", name: "Creality Falcon2 Pro 22W", min: 699, max: 949, capability: 8.3 },
      { slug: "creality-falcon2-pro-40w", power: "40W", name: "Creality Falcon2 Pro 40W", min: 799, max: 1099, capability: 8.6 },
    ],
  },
  {
    line: "two-trees-tts-55-pro",
    umbrella: "two-trees-tts-55-pro",
    primary: "two-trees-tts-55-pro-20w",
    base: "two-trees-tts-55-pro",
    tiers: [
      { slug: "two-trees-tts-55-pro-10w", power: "10W", name: "TwoTrees TTS-55 Pro 10W", min: 249, max: 379 },
      { slug: "two-trees-tts-55-pro-20w", power: "20W", name: "TwoTrees TTS-55 Pro 20W", min: 299, max: 499 },
    ],
  },
  {
    line: "monport-gt",
    umbrella: null,
    primary: "monport-gt-30w-fiber",
    base: "monport-gt-30w-fiber",
    tiers: [
      { slug: "monport-gt-30w-fiber", power: "30W", name: "Monport GT 30W Fiber", min: 2599, max: 3799 },
      { slug: "monport-gt-50w-fiber", power: "50W", name: "Monport GT 50W Fiber", min: 3199, max: 4499, capability: 8.7 },
      { slug: "monport-gt-60w-fiber", power: "60W", name: "Monport GT 60W MOPA Fiber", min: 3799, max: 5199, capability: 8.8 },
      { slug: "monport-gt-100w-fiber", power: "100W", name: "Monport GT 100W Fiber", min: 4999, max: 6999, capability: 9 },
    ],
  },
];

/** Already migrated in migrate-catalog-availability.mjs — only ensure metadata */
const EXISTING_LINES = [
  { line: "sculpfun-s30-ultra", umbrella: "sculpfun-s30-ultra", primary: "sculpfun-s30-ultra-22w" },
  { line: "xtool-s1", umbrella: "xtool-s1", primary: "xtool-s1-20w" },
  { line: "ortur-laser-master-3", umbrella: "ortur-laser-master-3", primary: "ortur-laser-master-3-20w" },
];

function applyTier(base, tier, line) {
  const watts = tier.power.replace("W", "");
  const isUmbrellaSame = tier.slug === base.slug;
  const m = isUmbrellaSame
    ? base
    : cloneVariant(base, {
        id: tier.slug,
        slug: tier.slug,
        name: tier.name,
        powerRating: tier.power,
        modelLine: line,
        tagline: `${tier.power} ${base.tagline?.replace(/^\d+W\s*/i, "") || "diode laser"}`,
        tldr: `${tier.name} is the ${tier.power} SKU on the ${base.brand} ${line.replace(/-/g, " ")} line. ${base.tldr?.split(".")[0] || ""}. Verify optical power on the listing — do not assume combined-watt marketing.`,
        priceRange: {
          min: tier.min,
          max: tier.max,
          currency: "USD",
          note: tierNote(tier.power),
        },
        specs: {
          power:
            base.laserType === "fiber"
              ? `${tier.power} fiber`
              : base.laserType === "uv"
                ? `${tier.power} UV`
                : `${tier.power} diode`,
        },
        beginnerNotes: `Choose ${tier.power} if it matches your typical jobs. Compare cut depth and price against other tiers in this product line before ordering.`,
        lastUpdated: "2026-06-01",
        status: base.status || "published",
      });

  m.modelLine = line;
  m.powerRating = tier.power;
  if (m.laserType === "fiber") m.specs.power = `${tier.power} fiber`;
  else if (m.laserType === "uv") m.specs.power = `${tier.power} UV`;
  else if (m.laserType === "co2") m.specs.power = `${tier.power} CO₂`;
  else if (m.laserType === "hybrid") m.specs.power = m.specs.power || `${tier.power} hybrid`;
  else m.specs.power = `${tier.power} diode`;
  if (tier.capability) {
    m.rating = { ...m.rating, capability: tier.capability };
  }

  const imgs = imageFromSlug(tier.slug, tier.name) || imageFromSlug(base.slug, tier.name);
  if (imgs) Object.assign(m, imgs);

  return m;
}

const created = [];
const updated = [];

for (const group of GROUPS) {
  const base = readMachine(group.base);
  copyImageDir(group.base, group.tiers[0].slug);
  for (const tier of group.tiers) {
    copyImageDir(group.base, tier.slug);
    const out = applyTier(base, tier, group.line);
    const exists = fs.existsSync(path.join(machinesDir, `${tier.slug}.json`));
    writeMachine(tier.slug, out);
    (exists ? updated : created).push(tier.slug);
  }

  if (group.umbrella && group.umbrella !== group.primary && !group.tiers.some((t) => t.slug === group.umbrella)) {
    const umb = fs.existsSync(path.join(machinesDir, `${group.umbrella}.json`))
      ? readMachine(group.umbrella)
      : base;
    umb.modelLine = group.line;
    umb.catalogHidden = true;
    umb.status = umb.status === "archived" ? "published" : umb.status || "published";
    if (!umb.marketAvailability) {
      umb.marketAvailability = "discontinued";
      umb.marketAvailabilityNote =
        umb.marketAvailabilityNote ||
        `${umb.brand} sells this line as separate ${group.tiers.map((t) => t.power).join(", ")} SKUs — use the power-specific pages below.`;
    }
    writeMachine(group.umbrella, umb);
    updated.push(`${group.umbrella} (umbrella hidden)`);
  }
}

for (const { line, umbrella, primary } of EXISTING_LINES) {
  const umb = readMachine(umbrella);
  umb.modelLine = line;
  umb.catalogHidden = true;
  writeMachine(umbrella, umb);
  for (const file of fs.readdirSync(machinesDir)) {
    if (!file.endsWith(".json")) continue;
    const m = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf-8"));
    if (m.modelLine !== line || m.slug === umbrella) continue;
    if (m.slug === primary) m.catalogPrimary = true;
    else delete m.catalogPrimary;
    delete m.catalogHidden;
    writeMachine(m.slug, m);
  }
}

// powerRating on published singles
const POWER_FROM_SPECS =
  /(\d+(?:\.\d+)?)\s*W/i;

for (const file of fs.readdirSync(machinesDir)) {
  if (!file.endsWith(".json")) continue;
  const m = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf-8"));
  if (m.status !== "published" || m.powerRating || m.modelLine) continue;
  const spec = m.specs?.power || "";
  const single = spec.match(/^(\d+(?:\.\d+)?)\s*W/i);
  if (single) {
    const w = single[1].includes(".") ? `${single[1]}W` : `${parseInt(single[1], 10)}W`;
    m.powerRating = w;
    m.lastUpdated = "2026-06-01";
    writeMachine(m.slug, m);
    updated.push(`${m.slug} (+powerRating)`);
  }
}

// Single-SKU fiber lines — no modelLine (avoid false "one tier" groups)
for (const slug of ["commarker-b4-20w", "commarker-b6-mopa-30w", "laserpecker-5"]) {
  const m = readMachine(slug);
  delete m.modelLine;
  if (slug === "laserpecker-5") m.catalogPrimary = true;
  writeMachine(slug, m);
}

// commarker omni lines
{
  const omni1 = readMachine("commarker-omni-1-uv");
  omni1.modelLine = "commarker-omni-1";
  omni1.catalogPrimary = true;
  writeMachine("commarker-omni-1-uv", omni1);
  for (const slug of ["commarker-omni-x-uv", "commarker-omni-xe-uv"]) {
    const m = readMachine(slug);
    m.modelLine = "commarker-omni-x";
    if (slug === "commarker-omni-x-uv") {
      m.catalogPrimary = true;
      if (!m.powerRating) m.powerRating = "5W";
    } else delete m.catalogPrimary;
    writeMachine(slug, m);
  }
}

// Clarify single-power wording on special cases
for (const [slug, power, note] of [
  ["glowforge-pro", "45W", "45W CO₂ class"],
  ["htouroy-40w", "40W", "40W combined optical class (~10W typical)"],
  ["omtech-fc105-fiber", "1050W", "Industrial sheet cutter — 1000W–3000W class depending on configuration"],
]) {
  if (!fs.existsSync(path.join(machinesDir, `${slug}.json`))) continue;
  const m = readMachine(slug);
  if (power) {
    m.powerRating = power;
    m.specs.power = note || `${power} ${m.laserType === "co2" ? "CO₂" : m.laserType}`;
  }
  writeMachine(slug, m);
}

console.log("Created:", created.length, created.slice(0, 20).join(", "), created.length > 20 ? "..." : "");
console.log("Updated:", updated.length);
