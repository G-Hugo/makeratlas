/**
 * Split multi-power listings into separate profiles.
 * Discontinued machines: run scripts/republish-discontinued.mjs (keeps them published with a notice).
 * Run: node scripts/migrate-catalog-availability.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const ARCHIVE_SLUGS = new Set([
  "xtool-d1-pro",
  "xtool-p2",
  "glowforge-pro",
  "atomstack-a5-pro",
  "atomstack-a20-pro",
  "atezr-p2",
  "comgrow-z1",
  "hawk-20",
  "htouroy-40w",
  "nubur-n4060",
  // Replaced by power-specific profiles
  "sculpfun-s30-ultra",
  "xtool-s1",
  "ortur-laser-master-3",
]);

const SIMILAR_REPLACEMENTS = {
  "xtool-d1-pro": "xtool-s1-20w",
  "sculpfun-s30-ultra": "sculpfun-s30-ultra-22w",
  "xtool-s1": "xtool-s1-20w",
  "ortur-laser-master-3": "ortur-laser-master-3-20w",
  "glowforge-pro": "glowforge-aura",
  "xtool-p2": "xtool-p2s",
  "atomstack-a5-pro": "atomstack-a40-pro",
  "atomstack-a20-pro": "atomstack-a40-pro",
};

function readMachine(slug) {
  return JSON.parse(fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf-8"));
}

function writeMachine(slug, data) {
  fs.writeFileSync(
    path.join(machinesDir, `${slug}.json`),
    `${JSON.stringify(data, null, 2)}\n`,
  );
}

function cloneVariant(base, overrides) {
  const m = structuredClone(base);
  const { specs, priceRange, rating, materials, ...rest } = overrides;
  Object.assign(m, rest);
  if (specs) m.specs = { ...m.specs, ...specs, performance: { ...m.specs.performance, ...specs?.performance } };
  if (priceRange) m.priceRange = { ...m.priceRange, ...priceRange };
  if (rating) m.rating = { ...m.rating, ...rating };
  if (materials) m.materials = { ...m.materials, ...materials };
  return m;
}

function copyImageDir(fromSlug, toSlug) {
  const from = path.join(process.cwd(), "public", "machines", fromSlug);
  const to = path.join(process.cwd(), "public", "machines", toSlug);
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    fs.copyFileSync(path.join(from, file), path.join(to, file));
  }
}

function imageFields(slug, altName) {
  const dir = path.join(process.cwd(), "public", "machines", slug);
  if (!fs.existsSync(dir)) return { image: `/machines/${slug}.svg`, images: [] };
  const file = fs.readdirSync(dir).find((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
  if (!file) return { image: `/machines/${slug}.svg`, images: [] };
  const src = `/machines/${slug}/${file}`;
  return {
    image: src,
    images: [{ src, alt: `${altName} laser engraver` }],
  };
}

// --- Split Sculpfun S30 Ultra ---
copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-10w");
copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-20w");
copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-22w");

const s30 = readMachine("sculpfun-s30-ultra");
const s30Base = {
  modelLine: "sculpfun-s30-ultra",
  category: s30.category,
  laserType: s30.laserType,
  brand: s30.brand,
  status: "published",
  lastUpdated: "2026-06-01",
};

writeMachine(
  "sculpfun-s30-ultra-10w",
  cloneVariant(s30, {
    ...s30Base,
    id: "sculpfun-s30-ultra-10w",
    slug: "sculpfun-s30-ultra-10w",
    powerRating: "10W",
    name: "Sculpfun S30 Ultra 10W",
    tagline: "Entry S30 Ultra frame — engraving-first, light cutting",
    tldr: "The 10W S30 Ultra uses the same rigid frame as higher-power models but targets makers who mainly engrave wood, leather, and slate. Expect slower cuts and thinner material limits than the 20W or 22W versions.",
    priceRange: { min: 380, max: 520, currency: "USD", note: "10W module — still sold as a distinct SKU" },
    specs: {
      power: "10W diode",
      performance: {
        ...s30.specs.performance,
        cutExample: {
          description: "Simple square cut-out from 3 mm basswood",
          size: "10 × 10 cm (4 × 4 in)",
          time: "~8–12 min",
        },
      },
    },
    materials: {
      ...s30.materials,
      cut: ["Basswood up to ~5 mm (10W, multiple passes)", "Paper", "Fabric", "Thin leather"],
    },
    cons: [
      ...s30.cons.filter((c) => !c.includes("20W")),
      "10W limits cutting vs 20W/22W siblings — verify SKU before buying",
    ],
    beginnerNotes:
      "Pick the 10W only if engraving is 90% of your work. If you might cut 6–8 mm wood later, buy the 20W or 22W variant instead.",
    similarModels: ["sculpfun-s30-ultra-20w", "ortur-laser-master-3-20w", "creality-falcon2-pro"],
    rating: { ...s30.rating, overall: 8.1, capability: 7.6 },
    ...imageFields("sculpfun-s30-ultra-22w", "Sculpfun S30 Ultra 10W"),
  }),
);

writeMachine(
  "sculpfun-s30-ultra-20w",
  cloneVariant(s30, {
    ...s30Base,
    id: "sculpfun-s30-ultra-20w",
    slug: "sculpfun-s30-ultra-20w",
    powerRating: "20W",
    name: "Sculpfun S30 Ultra 20W",
    tagline: "Mid-tier S30 Ultra — strong diode cutting without CO₂ pricing",
    tldr: "The 20W S30 Ultra is the balanced pick in the line: compressed beam cutting on thin wood, large community settings library, and the same stiff frame as the 22W refresh.",
    priceRange: { min: 450, max: 650, currency: "USD", note: "20W optical module" },
    specs: { power: "20W diode" },
    similarModels: ["sculpfun-s30-ultra-22w", "ortur-laser-master-3-20w", "creality-falcon2-pro"],
    ...imageFields("sculpfun-s30-ultra-22w", "Sculpfun S30 Ultra 20W"),
  }),
);

copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-10w");
copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-20w");
copyImageDir("sculpfun-s30-ultra", "sculpfun-s30-ultra-22w");
writeMachine(
  "sculpfun-s30-ultra-22w",
  cloneVariant(s30, {
    ...s30Base,
    id: "sculpfun-s30-ultra-22w",
    slug: "sculpfun-s30-ultra-22w",
    powerRating: "22W",
    name: "Sculpfun S30 Ultra 22W",
    tagline: "Current S30 Ultra flagship — maximum Sculpfun diode power",
    tldr: "The 22W S30 Ultra is what Sculpfun sells today as the top open-frame Ultra config (often bundled with LightBurn). Best cut headroom in the family; do not confuse with older 10W or 20W listings.",
    priceRange: { min: 520, max: 780, currency: "USD", note: "22W module — common LightBurn bundle" },
    specs: {
      power: "22W diode",
      performance: {
        ...s30.specs.performance,
        avgCutSpeed: "6–16 mm/s on 3–8 mm wood",
      },
    },
    materials: {
      ...s30.materials,
      cut: ["Basswood up to ~10 mm (22W, multiple passes)", "Black acrylic (thin)", "Paper", "Fabric"],
    },
    similarModels: ["sculpfun-s30-ultra-20w", "ortur-laser-master-3-20w", "creality-falcon2-pro"],
    rating: { ...s30.rating, overall: 8.5, capability: 8.4 },
    ...imageFields("sculpfun-s30-ultra-22w", "Sculpfun S30 Ultra 22W"),
  }),
);

copyImageDir("xtool-s1", "xtool-s1-40w");

// --- Split xTool S1 ---
const s1 = readMachine("xtool-s1");
const s1Base = { modelLine: "xtool-s1", brand: "xTool", laserType: "diode", status: "published", lastUpdated: "2026-06-01" };

writeMachine(
  "xtool-s1-20w",
  cloneVariant(s1, {
    ...s1Base,
    id: "xtool-s1-20w",
    slug: "xtool-s1-20w",
    powerRating: "20W",
    name: "xTool S1 20W",
    tagline: "Enclosed 20W diode — safer home engraving with moderate cutting",
    tldr: "The 20W S1 is the value pick in xTool's enclosed diode line: same cabinet and filters as the 40W, but less cut depth on thick wood. Buy this if safety matters and you mostly engrave.",
    priceRange: { min: 1199, max: 1399, currency: "USD", note: "20W enclosed SKU" },
    specs: {
      power: "20W diode (enclosed)",
      performance: {
        ...s1.specs.performance,
        cutExample: { description: "3 mm basswood cut-out", size: "10 × 10 cm", time: "~6–9 min" },
      },
    },
    materials: {
      ...s1.materials,
      cut: ["Basswood up to ~6 mm (20W)", "Black acrylic (thin)", "Paper", "Fabric"],
    },
    cons: s1.cons.filter((c) => !c.toLowerCase().includes("d1 pro")),
    beginnerNotes:
      "Choose the 20W S1 if you want an enclosed xTool on a tighter budget. Step up to 40W only if you regularly cut thicker softwood.",
    similarModels: ["xtool-s1-40w", "wecreat-vision", "creality-falcon2-pro"],
    rating: { ...s1.rating, overall: 8.6, capability: 8 },
    ...imageFields("xtool-s1", "xTool S1 20W"),
  }),
);

writeMachine(
  "xtool-s1-40w",
  cloneVariant(s1, {
    ...s1Base,
    id: "xtool-s1-40w",
    slug: "xtool-s1-40w",
    powerRating: "40W",
    name: "xTool S1 40W",
    tagline: "Enclosed 40W diode — top home cutting in xTool's cabinet line",
    tldr: "The 40W S1 is xTool's high-power enclosed diode. Still not CO₂, but the extra optical power helps on thicker basswood versus the 20W cabinet.",
    priceRange: { min: 1499, max: 1699, currency: "USD", note: "40W enclosed SKU" },
    specs: { power: "40W diode (enclosed)" },
    cons: [
      ...s1.cons.filter((c) => !c.toLowerCase().includes("d1 pro")),
      "40W diode marketing — confirm optical power on the exact SKU you order",
    ],
    similarModels: ["xtool-s1-20w", "xtool-p2s", "wecreat-vision"],
    rating: { ...s1.rating, overall: 8.9, capability: 8.4 },
    ...imageFields("xtool-s1-40w", "xTool S1 40W"),
  }),
);

// --- Split Ortur LM3 ---
const lm3 = readMachine("ortur-laser-master-3");
const lm3Base = { modelLine: "ortur-laser-master-3", brand: "Ortur", laserType: "diode", status: "published", lastUpdated: "2026-06-01" };

writeMachine(
  "ortur-laser-master-3-10w",
  cloneVariant(lm3, {
    ...lm3Base,
    id: "ortur-laser-master-3-10w",
    slug: "ortur-laser-master-3-10w",
    powerRating: "10W",
    name: "Ortur Laser Master 3 10W",
    tagline: "Budget LM3 — engraving-focused open-frame diode",
    tldr: "The 10W Laser Master 3 is Ortur's lower-power SKU on the same frame. Ideal for learning and engraving; cutters should choose the 20W version.",
    priceRange: { min: 350, max: 480, currency: "USD", note: "10W module" },
    specs: { power: "10W diode" },
    similarModels: ["ortur-laser-master-3-20w", "sculpfun-s30-ultra-10w", "atomstack-a40-pro"],
    rating: { ...lm3.rating, overall: 7.9, capability: 7.5 },
    ...imageFields("ortur-laser-master-3", "Ortur Laser Master 3 10W"),
  }),
);

writeMachine(
  "ortur-laser-master-3-20w",
  cloneVariant(lm3, {
    ...lm3Base,
    id: "ortur-laser-master-3-20w",
    slug: "ortur-laser-master-3-20w",
    powerRating: "20W",
    name: "Ortur Laser Master 3 20W",
    tagline: "Community-favorite open-frame diode — best LM3 value",
    tldr: "The 20W LM3 is the configuration most buyers mean when they say 'Laser Master 3'. Strong engraving, light cutting, huge community — verify you are not accidentally ordering the 10W SKU.",
    priceRange: { min: 480, max: 680, currency: "USD", note: "20W module — most common SKU" },
    specs: { power: "20W diode" },
    similarModels: ["sculpfun-s30-ultra-22w", "creality-falcon2-pro", "xtool-s1-20w"],
    rating: { ...lm3.rating, overall: 8.3 },
    ...imageFields("ortur-laser-master-3", "Ortur Laser Master 3 20W"),
  }),
);

// --- Clarify single-SKU Longer profiles ---
for (const slug of ["longer-ray5", "longer-laser-b1"]) {
  const m = readMachine(slug);
  const power = slug.includes("ray5") ? "20W" : "20W";
  m.name = slug.includes("ray5") ? "Longer Ray5 20W" : "Longer Laser B1 20W";
  m.powerRating = power;
  m.modelLine = slug.replace(/-20w$/, "");
  m.specs.power = `${power} diode`;
  m.priceRange.note = `${power} SKU — other wattages are separate Longer listings`;
  if (slug === "longer-ray5") {
    m.tldr =
      "Longer's compact Ray5 20W diode engraver — verify you are buying the 20W SKU, not the 5W, 10W, or 40W Ray5 listings.";
  } else {
    m.tldr =
      "Longer's large-format B1 20W diode — this profile is the 20W SKU only; Longer also sells 30W and 40W B1 machines separately.";
  }
  m.lastUpdated = "2026-06-01";
  writeMachine(slug, m);
}

// --- Archive ---
for (const slug of ARCHIVE_SLUGS) {
  const file = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(file)) continue;
  const m = readMachine(slug);
  m.status = "archived";
  m.lastUpdated = "2026-06-01";
  writeMachine(slug, m);
}

// --- Fix similarModels across catalog ---
const published = new Set();
for (const file of fs.readdirSync(machinesDir)) {
  if (!file.endsWith(".json")) continue;
  const m = readMachine(file.replace(".json", ""));
  if (m.status === "published") published.add(m.slug);
}

for (const file of fs.readdirSync(machinesDir)) {
  if (!file.endsWith(".json")) continue;
  const m = readMachine(file.replace(".json", ""));
  if (m.status !== "published" || !m.similarModels?.length) continue;
  const next = [];
  const seen = new Set();
  for (const ref of m.similarModels) {
    const target = SIMILAR_REPLACEMENTS[ref] ?? ref;
    if (!published.has(target) || seen.has(target) || target === m.slug) continue;
    seen.add(target);
    next.push(target);
  }
  if (JSON.stringify(next) !== JSON.stringify(m.similarModels)) {
    m.similarModels = next;
    writeMachine(m.slug, m);
  }
}

console.log("Catalog migration done.");
console.log("Archived:", [...ARCHIVE_SLUGS].join(", "));
console.log(
  "New variants:",
  [
    "sculpfun-s30-ultra-10w",
    "sculpfun-s30-ultra-20w",
    "sculpfun-s30-ultra-22w",
    "xtool-s1-20w",
    "xtool-s1-40w",
    "ortur-laser-master-3-10w",
    "ortur-laser-master-3-20w",
  ].join(", "),
);
