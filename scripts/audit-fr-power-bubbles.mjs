import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

// Words that must not appear in FR bubbles (exclude valid FR: diode, visible, module, laser as part of "laser infrarouge")
const EN_RESIDUE =
  /\b(fiber|hybrid|glass|tube|enclosed|compressed|blade|cutting|force|optical|consumer|verify|sku|typical|class|claimed|platform|depending|industrial|sheet|cutter|primary|actual|combined|rated|auxiliary|optional|marking|infrared|dual source|double source)\b/i;

const HAS_TYPE =
  /co₂|co2|diode|fibre|\buv\b|infrarouge|\bir\b|hybride|1064|visible/i;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, ""));
}

// Mirror src/lib/power-display.ts (keep in sync)
function stripInternalPowerNotes(value) {
  let s = value;
  s = s.replace(/\([^)]+\)/g, (paren) => {
    const inner = paren.slice(1, -1);
    if (
      /consumer|verify|typical|sku|claimed|optical|class|classe|rated|approx|configuration|depending on|actual|typical entry|platform|module optional|optional\)|Pro model/i.test(
        inner,
      )
    ) {
      if (/compress/i.test(inner) && !/optical|class|verify|consumer/i.test(inner)) {
        return " (compressed)";
      }
      return "";
    }
    return paren;
  });
  s = s
    .replace(/\s*—\s*verify\s+sku[^,;)]*/gi, "")
    .replace(/\bconsumer[- ]?rated\b/gi, "")
    .replace(/\bverify\s+sku\b/gi, "")
    .replace(/\btypical\s+sku\b/gi, "")
    .replace(/\boptical\s+class\b/gi, "")
    .replace(/\bclass\b/gi, "")
    .replace(/\bdepending on module\b/gi, "")
    .replace(/\bdiode options\b/gi, "diode")
    .replace(/\s+options\b/gi, "")
    .replace(/\bindustrial sheet cutter\b/gi, "");
  return s.replace(/\s{2,}/g, " ").replace(/\(\s*\)/g, "").trim();
}

function translatePowerSpecsFr(value) {
  let s = stripInternalPowerNotes(value);
  const replacements = [
    [/\bblade cutting force\b/gi, "lame de découpe"],
    [/\bcutting force\b/gi, "force de coupe"],
    [/\bfiber marking\b/gi, "marquage fibre"],
    [/\binfrared auxiliary\b/gi, "IR auxiliaire"],
    [/\binfrared laser\b/gi, "laser infrarouge"],
    [/\bIR auxiliary\b/gi, "IR auxiliaire"],
    [/\bdual source\b/gi, "deux sources"],
    [/\bdouble source\b/gi, "deux sources"],
    [/\bglass tube\b/gi, "tube en verre"],
    [/\bdiode laser\b/gi, "diode"],
    [/\bCO₂ laser\b/gi, "CO₂"],
    [/\bMOPA fiber\b/gi, "fibre MOPA"],
    [/\bfiber\b/g, "fibre"],
    [/\bfiber\b/gi, "fibre"],
    [/\bCO2\b/g, "CO₂"],
    [/\binfrared\b/gi, "infrarouge"],
    [/\bhybrid\b/gi, "hybride"],
    [/\bcompressed\b/gi, "compressé"],
    [/\benclosed\b/gi, "fermée"],
    [/\bauxiliary\b/gi, "auxiliaire"],
    [/\boptional\b/gi, "en option"],
    [/\bcombined\b/gi, "combiné"],
    [/\boptical\b/gi, "optique"],
    [/\bmarking\b/gi, "marquage"],
    [/\bvisible\b/gi, "visible"],
    [/\bor\b/gi, "ou"],
    [/\band\b/gi, "et"],
    [/\blaser\b/gi, ""],
  ];
  for (const [pattern, replacement] of replacements) {
    s = s.replace(pattern, replacement);
  }
  return s.replace(/\s{2,}/g, " ").replace(/\(\s*\)/g, "").trim();
}

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function inferSuffix(m) {
  const p = (m.specs?.power || "").toLowerCase();
  const t = m.laserType;
  if (p.includes("+")) return null;
  if (p.includes("co₂") || p.includes("co2") || t === "co2") return "CO₂";
  if (p.includes("fibre") || p.includes("fiber") || t === "fiber") return "fibre";
  if (p.includes("uv") || t === "uv") return "UV";
  if (p.includes("infrared") || p.includes("infrarouge") || p.includes("1064")) return "IR";
  if (p.includes("diode") || t === "diode") return "diode";
  if (t === "hybrid") return "hybride";
  return null;
}

function formatBubble(m) {
  const specsPower = m.specs.power;
  if (specsPower.includes("+")) return translatePowerSpecsFr(specsPower);
  const w = parseWatts(m);
  const suf = inferSuffix(m);
  if (w && suf) return translatePowerSpecsFr(`${w}W ${suf}`);
  const tr = translatePowerSpecsFr(specsPower);
  if (HAS_TYPE.test(tr)) return tr;
  if (w && suf) return translatePowerSpecsFr(`${w}W ${suf}`);
  return tr;
}

const issues = [];
for (const file of fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"))) {
  const m = readJson(path.join(machinesDir, file));
  if (m.status !== "published") continue;
  const label = formatBubble(m);
  if (EN_RESIDUE.test(label)) {
    issues.push({ slug: m.slug, label, power: m.specs.power });
  }
  if (!m.specs.power.includes("+") && parseWatts(m) && !HAS_TYPE.test(label)) {
    issues.push({ slug: m.slug, label, power: m.specs.power, missingType: true });
  }
}

console.log(`FR power bubble issues: ${issues.length}`);
for (const i of issues) {
  console.log(`  ${i.slug}: "${i.label}" <= "${i.power}"${i.missingType ? " (missing type)" : ""}`);
}
process.exit(issues.length > 0 ? 1 : 0);
