/**
 * Add missing power tiers + moduleSystem metadata (interchangeable vs dual-laser).
 * Run: node scripts/patch-module-systems.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const publicMachines = path.join(process.cwd(), "public", "machines");

function read(slug) {
  return JSON.parse(fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf-8"));
}
function write(slug, m) {
  fs.writeFileSync(path.join(machinesDir, `${slug}.json`), `${JSON.stringify(m, null, 2)}\n`);
}

function copyImages(from, to) {
  const srcDir = path.join(publicMachines, from);
  const dstDir = path.join(publicMachines, to);
  if (!fs.existsSync(srcDir) || fs.existsSync(dstDir)) return;
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
  }
}

const XTOOL_S1_MODULES = {
  style: "interchangeable",
  headline: "Interchangeable laser heads on the same S1 cabinet",
  description:
    "The xTool S1 is sold with different diode modules (10W, 20W, or 40W) or as a bare cabinet — heads swap with two screws and a plug. An optional 2W 1064 nm infrared module adds metal marking without a full fiber galvo. This is not a “hybrid” machine: you replace one head at a time.",
  options: [
    { power: "10W", laserKind: "diode", label: "10W diode", tierSlug: "xtool-s1-10w" },
    { power: "20W", laserKind: "diode", label: "20W diode", tierSlug: "xtool-s1-20w" },
    { power: "40W", laserKind: "diode", label: "40W diode", tierSlug: "xtool-s1-40w" },
    {
      power: "2W",
      laserKind: "infrared",
      label: "2W IR module (accessory)",
    },
  ],
};

const XTOOL_D1_PRO_MODULES = {
  style: "interchangeable",
  headline: "Swappable diode modules on D1 Pro frame",
  description:
    "xTool D1 Pro uses plug-in diode modules (5W–40W depending on era and listing). Buy the module power you need — same rail and software as other D1 Pro heads.",
  options: [
    { power: "5W", laserKind: "diode", label: "5W diode", tierSlug: "xtool-d1-pro-5w" },
    { power: "10W", laserKind: "diode", label: "10W diode", tierSlug: "xtool-d1-pro-10w" },
    { power: "20W", laserKind: "diode", label: "20W diode", tierSlug: "xtool-d1-pro-20w" },
    { power: "40W", laserKind: "diode", label: "40W module", tierSlug: "xtool-d1-pro-40w" },
  ],
};

function cloneTier(baseSlug, tier) {
  const base = read(baseSlug);
  const m = structuredClone(base);
  Object.assign(m, {
    id: tier.slug,
    slug: tier.slug,
    name: tier.name,
    powerRating: tier.power,
    modelLine: tier.line,
    tagline: tier.tagline ?? `${tier.power} ${base.tagline}`,
    tldr: tier.tldr,
    priceRange: { min: tier.min, max: tier.max, currency: "USD", note: `${tier.power} optical module` },
    specs: { ...base.specs, power: `${tier.power} diode` },
    rating: tier.rating ? { ...base.rating, ...tier.rating } : base.rating,
    similarModels: tier.similar ?? base.similarModels,
    lastUpdated: "2026-06-01",
  });
  delete m.catalogPrimary;
  copyImages(tier.imageFrom ?? baseSlug, tier.slug);
  const imgDir = path.join(publicMachines, tier.slug);
  if (fs.existsSync(imgDir)) {
    const file = fs.readdirSync(imgDir).find((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    if (file) {
      m.image = `/machines/${tier.slug}/${file}`;
      m.images = [{ src: m.image, alt: `${tier.name} laser engraver` }];
    }
  }
  write(tier.slug, m);
  console.log("+ tier", tier.slug);
}

function dualLaser(headline, description, fiberW, diodeW) {
  return {
    style: "dual-laser",
    headline,
    description,
    options: [
      { power: fiberW, laserKind: "fiber", label: `${fiberW} fiber` },
      { power: diodeW, laserKind: "diode", label: `${diodeW} diode` },
    ],
  };
}

// --- xTool S1 10W ---
copyImages("xtool-s1-20w", "xtool-s1-10w");
const s1_20 = read("xtool-s1-20w");
const s1_10 = structuredClone(s1_20);
Object.assign(s1_10, {
  id: "xtool-s1-10w",
  slug: "xtool-s1-10w",
  name: "xTool S1 10W",
  powerRating: "10W",
  catalogPrimary: false,
  tagline: "Entry enclosed S1 — engraving-first with swappable head ecosystem",
  tldr:
    "The 10W S1 is xTool's entry enclosed bundle: same Class-1 cabinet as 20W/40W, but the installed diode module limits cutting depth. You can upgrade later by swapping the laser head — verify you are buying the 10W SKU, not a bare machine without a module.",
  priceRange: { min: 999, max: 1199, currency: "USD", note: "10W module pre-installed" },
  specs: {
    ...s1_20.specs,
    power: "10W diode (enclosed)",
    performance: {
      ...s1_20.specs.performance,
      cutExample: {
        description: "3 mm basswood cut-out",
        size: "10 × 10 cm",
        time: "~9–14 min",
      },
      technical: {
        ...s1_20.specs.performance.technical,
        avgCutSpeed: "2–8 mm/s on 3 mm wood",
      },
    },
  },
  materials: {
    ...s1_20.materials,
    cut: ["Basswood up to ~4 mm (10W)", "Paper", "Fabric", "Thin leather"],
  },
  beginnerNotes:
    "Pick 10W if you mainly engrave and might upgrade the head later. Choose 20W or 40W factory configs if cutting thicker softwood is day-one priority.",
  similarModels: ["xtool-s1-20w", "xtool-s1-40w", "wecreat-vision"],
  rating: { ...s1_20.rating, overall: 8.3, capability: 7.5 },
  lastUpdated: "2026-06-01",
});
if (fs.existsSync(path.join(publicMachines, "xtool-s1-10w"))) {
  const img = fs.readdirSync(path.join(publicMachines, "xtool-s1-10w")).find((f) => /\.webp$/i.test(f));
  if (img) {
    s1_10.image = `/machines/xtool-s1-10w/${img}`;
    s1_10.images = [{ src: s1_10.image, alt: "xTool S1 10W laser engraver — xTool" }];
  }
}
write("xtool-s1-10w", s1_10);
console.log("+ xtool-s1-10w");

// moduleSystem on families
for (const slug of ["xtool-s1-10w", "xtool-s1-20w", "xtool-s1-40w"]) {
  const m = read(slug);
  m.moduleSystem = XTOOL_S1_MODULES;
  m.modelLine = "xtool-s1";
  write(slug, m);
}

const s1umb = read("xtool-s1");
s1umb.moduleSystem = XTOOL_S1_MODULES;
s1umb.tldr =
  "The xTool S1 is an enclosed Class-1 diode platform with interchangeable 10W, 20W, and 40W heads (plus optional 2W IR for metal). This overview page is deprecated — open a specific power tier for accurate specs.";
write("xtool-s1", s1umb);

for (const slug of ["xtool-d1-pro-5w", "xtool-d1-pro-10w", "xtool-d1-pro-20w", "xtool-d1-pro"]) {
  if (!fs.existsSync(path.join(machinesDir, `${slug}.json`))) continue;
  const m = read(slug);
  m.moduleSystem = XTOOL_D1_PRO_MODULES;
  write(slug, m);
}

const hybrids = [
  [
    "xtool-f1-ultra",
    dualLaser(
      "Fiber + diode in one desktop unit",
      "The F1 Ultra switches between a fiber source (metal) and a diode source (wood/acrylic) inside one chassis. You do not swap a 10W diode for a 40W diode — that is the xTool S1 model.",
      "20W",
      "20W",
    ),
  ],
  [
    "xtool-f1",
    dualLaser(
      "Compact dual-source engraver",
      "F1 combines 10W fiber marking with 10W diode engraving. Different product class from modular S1 heads.",
      "10W",
      "10W",
    ),
  ],
  [
    "xtool-f2-ultra",
    dualLaser(
      "High-power dual laser (MOPA fiber + diode)",
      "F2 Ultra pairs MOPA fiber for metal/color marking with a 40W-class diode for organics. Dual-source hybrid, not interchangeable wattage tiers.",
      "60W",
      "40W",
    ),
  ],
  [
    "laserpecker-5",
    dualLaser(
      "Portable fiber + diode",
      "LP5 packs fiber and diode for travel engraving. Hybrid dual-source — not the same as S1 head swapping.",
      "20W",
      "20W",
    ),
  ],
];

for (const [slug, config] of hybrids) {
  if (!fs.existsSync(path.join(machinesDir, `${slug}.json`))) continue;
  const m = read(slug);
  m.moduleSystem = config;
  write(slug, m);
  console.log("moduleSystem dual-laser:", slug);
}

const HYBRID_CAPS = {
  "xtool-f1-ultra": { laserCapabilities: ["fiber", "diode"], capabilityTags: ["fiber", "diode"] },
  "xtool-f1": { laserCapabilities: ["fiber", "diode"], capabilityTags: ["fiber", "diode"] },
  "xtool-f2-ultra": { laserCapabilities: ["fiber", "diode"], capabilityTags: ["fiber", "diode"] },
  "laserpecker-5": { laserCapabilities: ["fiber", "diode"], capabilityTags: ["fiber", "diode"] },
  "xtool-m1-ultra": { laserCapabilities: ["diode"], capabilityTags: ["diode", "blade"] },
};

const EXTRA_TIERS = [
  {
    slug: "algolaser-alpha-mk2-10w",
    line: "algolaser-alpha-mk2",
    power: "10W",
    name: "Algolaser Alpha MK2 10W",
    min: 499,
    max: 699,
    imageFrom: "algolaser-alpha-mk2-20w",
    tagline: "10W Entry Alpha MK2 — speed-focused open-frame diode",
    tldr: "The 10W Alpha MK2 (often sold as DIY kit or enclosed 10W SKU) is the engraving-first tier. Step up to 20W or 40W for faster fills and deeper cuts.",
    rating: { capability: 8.1, overall: 8.2 },
    similar: ["algolaser-alpha-mk2-20w", "algolaser-alpha-mk2-40w", "ortur-laser-master-3-20w"],
  },
  {
    slug: "xtool-d1-pro-40w",
    line: "xtool-d1-pro",
    power: "40W",
    name: "xTool D1 Pro 40W",
    min: 899,
    max: 1099,
    imageFrom: "xtool-d1-pro-20w",
    tagline: "40W Top D1 Pro module — strongest open-frame xTool diode",
    tldr: "The 40W D1 Pro module swaps onto the same frame as 5W–20W heads. Best cut headroom in the line; verify optical power on the listing.",
    rating: { capability: 8.5, overall: 8.4 },
    similar: ["xtool-d1-pro-20w", "sculpfun-s30-ultra-22w", "xtool-s1-40w"],
  },
];

for (const tier of EXTRA_TIERS) {
  if (fs.existsSync(path.join(machinesDir, `${tier.slug}.json`))) continue;
  cloneTier(tier.imageFrom, tier);
}

for (const slug of ["xtool-d1-pro-40w", "algolaser-alpha-mk2-10w"]) {
  if (!fs.existsSync(path.join(machinesDir, `${slug}.json`))) continue;
  const m = read(slug);
  if (slug.startsWith("xtool-d1")) m.moduleSystem = XTOOL_D1_PRO_MODULES;
  write(slug, m);
}

for (const [slug, caps] of Object.entries(HYBRID_CAPS)) {
  if (!fs.existsSync(path.join(machinesDir, `${slug}.json`))) continue;
  const m = read(slug);
  Object.assign(m, caps);
  write(slug, m);
  console.log("capabilities:", slug, caps.capabilityTags.join("+"));
}

console.log("Done.");
