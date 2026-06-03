/**
 * Legacy: bulk-writes generic tier copy into JSON.
 *
 * Prefer runtime editorial via src/lib/power-tier-editorial.ts (per machine).
 * Run this only if you need static JSON for export — pass --dry-run to inspect.
 */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");

function parseWatts(m) {
  const t = m.powerRating ?? m.specs?.power ?? "";
  const match = String(t).match(/(\d+(?:\.\d+)?)\s*W/i);
  return match ? Number(match[1]) : null;
}

function getDiodeRole(w) {
  if (w == null) return "mixed";
  if (w <= 8) return "engrave-only";
  if (w <= 12) return "engrave-first";
  if (w <= 20) return "mixed";
  if (w <= 35) return "cut-strong";
  return "cut-flagship";
}

function getFiberRole(w) {
  if (w == null) return "marking-mid";
  if (w <= 30) return "marking-entry";
  if (w <= 50) return "marking-mid";
  return "marking-pro";
}

function copyForDiode(role, brand) {
  const b = brand || "This machine";
  const templates = {
    "engrave-only": {
      bestFor: ["Fine engraving", "Learning the hobby", "Gifts & coasters", "Budget start"],
      pros: [
        "Excellent for detailed engraving on wood, leather, and slate",
        "Lower module cost than higher-watt siblings on the same frame",
        "Less heat — often cleaner photo fills at conservative speeds",
        "Same workspace size as the rest of the line — room to grow skills",
        "Ideal if cutting thick wood is rare for you",
      ],
      cons: [
        "Slow on cut jobs — plan multiple passes and thin stock only",
        "Not the right SKU if Etsy-style cutting is your main income",
        "Open-frame safety and ventilation still required",
        "You may outgrow it quickly if daily 6 mm+ cuts matter",
        `Pick a higher-watt ${b} tier if cutting dominates your work`,
      ],
      beginnerNotes:
        "Choose this wattage when engraving (photos, logos, leather, slate) is most of your work. It can cut thin basswood, but job times climb fast. If you already know you need faster box cuts, skip to the 20W+ SKU in this line.",
      proTips:
        "Optimize for engraving: lower DPI on photos, higher scan speed on line art after test burns. Air assist still helps clarity. Compare benchmark times on the next tier before assuming you need more power.",
      mainObjective:
        "Detailed engraving on organics and coated metal — occasional thin cuts only",
      primaryUse:
        "Engraving-first desktop diode for makers who prioritize mark quality over cut speed",
    },
    "engrave-first": {
      bestFor: ["Engraving shops", "Photo & logo work", "Leather & wood gifts", "Learning before upgrading"],
      pros: [
        "Strong engraving quality for the price tier",
        "Handles coasters, signs, and leather reliably at moderate speeds",
        "Lower heat than 20W+ modules — forgiving for photo fills",
        "Good way to learn the line before paying for cut headroom",
        "Benchmark times show where 20W+ saves hours",
      ],
      cons: [
        "Cutting thicker basswood is slow vs 20W/40W tiers on the same frame",
        "Not ideal as a primary production cutter",
        "Same open-frame safety rules as siblings — glasses and vent",
        "Marketing may list higher combined watts — trust optical power on your module",
        "Upgrade path is clear: move up if cut volume pays for itself",
      ],
      beginnerNotes:
        "This is the engraving-sweet-spot SKU in the family. Buy it if beautiful marks matter more than fast 6–8 mm cuts. Side-business sellers doing mostly cut-outs should compare the next tier’s cut benchmark before ordering.",
      proTips:
        "Run material test grids at engraving speeds first. Add air assist for light cuts. If cut jobs exceed ~30% of your week, open the higher-watt profile on this site and compare times.",
      mainObjective:
        "High-quality hobby and light-business engraving with light, slow cutting",
      primaryUse:
        "Engraving-focused diode profile on a shared chassis — not the line’s cutting flagship",
    },
    mixed: {
      bestFor: ["Mixed engrave & cut", "Hobby side business", "Wood signs & boxes", "Etsy-style small runs"],
      pros: [
        "Balanced engrave and cut performance for typical hobby materials",
        "Meaningfully faster cuts than 10W tiers on the same frame",
        "Large enough work area for signs, boxes, and batch gifts",
        "Strong value vs premium enclosed machines if you accept open-frame setup",
        "Community-tested settings for 3–6 mm basswood",
      ],
      cons: [
        "Still a diode — clear acrylic and production acrylic want CO₂",
        "Open frame — safety glasses, vent, and supervision required",
        "Not as fast as 40W-class diodes in the same line for thick cuts",
        "Duty cycle and cooling limit marathon production days",
        "Verify you are not buying a lower-watt SKU by mistake",
      ],
      beginnerNotes:
        "This is the usual ‘do both’ wattage in the line: engraving for clients plus regular 3–6 mm wood cuts. Compare the 40W tier only if thick cuts or speed on large fills are daily requirements.",
      proTips:
        "Use air assist for cuts, lower scan speed for photo engraving. Multiple passes at moderate speed beat one aggressive pass. Check the flagship tier’s cut benchmark if you quote production times to customers.",
      mainObjective:
        "Everyday engraving plus reliable light cutting on wood, leather, and dark acrylic",
      primaryUse:
        "Versatile hobby and side-business diode — the line’s common ‘engrave + cut’ balance point",
    },
    "cut-strong": {
      bestFor: ["Faster cutting", "Thicker basswood", "Small-batch production", "Signs & panels"],
      pros: [
        "Clearly faster cut times than 10–20W tiers on the same chassis",
        "Better single-pass depth on typical hobby plywood and basswood",
        "Still capable of detailed engraving when speeds are tuned down",
        "Good upgrade within the line without jumping to CO₂",
        "Benchmark cut jobs show the real time savings vs lower modules",
      ],
      cons: [
        "More smoke and heat — ventilation and air assist are not optional",
        "Engraving very fine photo fills may need slower settings than engraving-first SKUs",
        "Higher module cost — only worth it if cuts pay back the difference",
        "Still cannot match CO₂ on clear acrylic production",
        "Combined-watt marketing — confirm optical power on the listing",
      ],
      beginnerNotes:
        "Pick this tier when cut jobs (boxes, panels, thick basswood) are a regular part of your week, not a once-a-month test. Engraving-only makers can save money on a lower-watt sibling.",
      proTips:
        "Tune cut passes with air assist and focus checks. For photo engraving, slow down vs your cut presets — this head is optimized for throughput on wood, not only finesse.",
      mainObjective:
        "Faster cutting and deeper hobby cuts while keeping solid engraving capability",
      primaryUse:
        "Cut-biased diode tier for makers who outgrew 10–20W job times but stay on the same frame",
    },
    "cut-flagship": {
      bestFor: ["Maximum diode cuts", "Speed-focused shops", "Thick soft woods", "High-volume hobby runs"],
      pros: [
        "Fastest cutting in the line — shortest benchmark times on reference jobs",
        "Best headroom for thick basswood and stacked passes on wood",
        "Still engraves well when you slow settings for detail work",
        "Top choice within the family before considering CO₂",
        "Large work area leveraged best at this power level",
      ],
      cons: [
        "Premium module price — overkill if you only engrave coasters",
        "More heat, smoke, and duty-cycle stress — cooling breaks matter",
        "40W-class marketing often cites combined power — verify optical output",
        "Fine photo engraving may need slower passes than a 10W dedicated engraver mindset",
        "Open-frame noise and safety unchanged — power does not replace vent",
      ],
      beginnerNotes:
        "This is the cutting flagship of the diode line. Buy it when job quotes depend on fast, repeatable cuts. If your work is 90% detailed engraving at leisure speeds, a 10W–20W sibling is simpler and cheaper.",
      proTips:
        "Treat engraving and cutting as separate profiles. Push cut speeds only after test squares on your material. Compare CO₂ only when clear acrylic or all-day production enters the picture.",
      mainObjective:
        "Maximum cut speed and depth in the line — engraving remains strong at tuned speeds",
      primaryUse:
        "Flagship high-power diode for cut-heavy hobby and light production on the same chassis",
    },
  };
  return templates[role] ?? templates.mixed;
}

function copyForFiber(role) {
  const templates = {
    "marking-entry": {
      bestFor: ["Jewelry marking", "Small tags", "Learning fiber", "Compact jobs"],
      pros: [
        "Fine marks on stainless, aluminum, and coated metals",
        "Lower cost entry to the fiber line",
        "Compact footprint for bench work",
        "Slower deep engraving vs higher-watt siblings — predictable for small parts",
        "Good for tags, tools, and trial runs",
      ],
      cons: [
        "Not for cutting wood or acrylic",
        "Slower on deep metal engraving vs 50W+ tiers",
        "Rotary and fixturing often extra",
        "Safety: never open housing while firing",
        "Upgrade within line if batch speed matters",
      ],
      beginnerNotes:
        "Fiber entry tier: choose it for small metal marks and learning. High-volume deep engraving or large panels — compare higher-watt tiers in the same line.",
      proTips:
        "Fix parts firmly; start with low power test squares on scrap metal. Rotary adds complexity — budget time to learn indexing.",
      mainObjective: "Entry fiber marking on small metal parts",
      primaryUse: "Desktop fiber marking for jewelry-scale and test jobs",
    },
    "marking-mid": {
      bestFor: ["Metal signage", "Tools & knives", "Batch marking", "Shop labels"],
      pros: [
        "Faster marks than entry fiber on the same line",
        "Reliable for daily metal engraving work",
        "Good balance of price and throughput for small shops",
        "Works with rotary accessories for rings and tumblers",
        "Stable for anodized and stainless jobs",
      ],
      cons: [
        "No organic material cutting",
        "Higher tier may still be faster on deep engraves",
        "Ventilation for dust and coatings",
        "Fixturing learning curve for cylinders",
        "Verify wattage on listing matches module",
      ],
      beginnerNotes:
        "Mid-line fiber: for regular metal work, not occasional tags. Compare flagship tier if deep engraves on large stainless are daily.",
      proTips:
        "Batch similar jobs to reduce setup. Use rotary only when quotes include cylinder work — it slows flat-stock days.",
      mainObjective: "Production-leaning fiber marking for small businesses",
      primaryUse: "Mid-power fiber for shops marking metal daily",
    },
    "marking-pro": {
      bestFor: ["Deep metal engraving", "High throughput", "Industrial-style batches", "Large mark areas"],
      pros: [
        "Fastest marking and deep engraving in the fiber line",
        "Best for shops quoting metal job times",
        "Handles larger fields and deeper passes vs entry tiers",
        "Top capability score within the family",
        "Still desktop-class — not a galvo production floor replacement",
      ],
      cons: [
        "Expensive vs entry fiber — only if speed pays back",
        "Overkill for occasional dog tags",
        "Power and cooling need respect on long jobs",
        "No wood/acrylic use case",
        "Training still required for rotary setups",
      ],
      beginnerNotes:
        "Flagship fiber wattage: buy when metal throughput defines your business. Hobbyists marking a few pieces per week should start lower in the line.",
      proTips:
        "Push speed only after depth tests on your metal alloy. Cooling and lens cleanliness matter more at this power level.",
      mainObjective: "Maximum fiber marking speed and depth in the line",
      primaryUse: "High-power fiber for metal-focused shops needing line-top throughput",
    },
  };
  return templates[role] ?? templates["marking-mid"];
}

function load() {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const fp = path.join(dir, f);
      return { fp, slug: f.replace(".json", ""), data: JSON.parse(fs.readFileSync(fp, "utf-8")) };
    })
    .filter((x) => x.data.status === "published" && x.data.modelLine);
}

function groupByLine(items) {
  const map = new Map();
  for (const item of items) {
    const line = item.data.modelLine;
    if (!map.has(line)) map.set(line, []);
    map.get(line).push(item);
  }
  return map;
}

function prosKey(m) {
  return JSON.stringify({ pros: m.pros, cons: m.cons });
}

function applyCopy(m, copy) {
  m.bestFor = copy.bestFor;
  m.pros = copy.pros;
  m.cons = copy.cons;
  if (copy.beginnerNotes) m.beginnerNotes = copy.beginnerNotes;
  if (copy.proTips) m.proTips = copy.proTips;
  if (copy.mainObjective) m.mainObjective = copy.mainObjective;
  if (copy.primaryUse) m.primaryUse = copy.primaryUse;
}

if (!process.argv.includes("--legacy-write")) {
  console.log(
    "Skipped — generic bulk write disabled.\n" +
      "Use: npx tsx scripts/sync-tier-editorial-to-json.ts\n" +
      "Detail pages use src/lib/power-tier-editorial.ts at runtime.",
  );
  process.exit(0);
}

const items = load();
const byLine = groupByLine(items);
let updated = 0;

for (const [, group] of byLine) {
  const visible = group.filter((g) => !g.data.catalogHidden);
  if (visible.length < 2) continue;

  const proseKeys = visible.map((g) => prosKey(g.data));
  const hasDuplicateProse = new Set(proseKeys).size < visible.length;

  for (const { fp, data } of visible) {
    const w = parseWatts(data);
    const isFiber = data.laserType === "fiber";
    const role = isFiber ? getFiberRole(w) : getDiodeRole(w);
    const copy = isFiber ? copyForFiber(role) : copyForDiode(role, data.brand);

    // Always refresh tier copy for multi-power lines (user asked for coherent roles)
    applyCopy(data, copy);

    // Tier-specific cut material hints for diodes
    if (!isFiber && w != null) {
      if (role === "engrave-only" || role === "engrave-first") {
        if (data.materials?.cut?.length) {
          data.materials.cut = data.materials.cut.map((c) =>
            c.replace(/up to 8 mm/i, "up to 4 mm").replace(/up to 6 mm/i, "up to 4 mm"),
          );
          if (!data.materials.cut.some((c) => /thin|light/i.test(c))) {
            data.materials.cut = [
              "Basswood (thin, multiple passes)",
              "Paper & card",
              "Fabric",
              ...(data.materials.cut.filter((c) => /acrylic/i.test(c)).length
                ? ["Black acrylic (thin only)"]
                : []),
            ];
          }
        }
      } else if (role === "cut-flagship" || role === "cut-strong") {
        const cuts = data.materials?.cut ?? [];
        if (cuts.length && !cuts.some((c) => /8 mm|10 mm|6 mm/i.test(c))) {
          data.materials.cut = [
            "Basswood (up to 8–10 mm, multiple passes)",
            "Dark acrylic (up to 5–6 mm)",
            "Paper",
            "Fabric",
          ];
        }
      }
    }

    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
    updated++;
  }
}

console.log(`Updated ${updated} machine profiles across ${[...byLine.values()].filter((g) => g.filter((x) => !x.data.catalogHidden).length >= 2).length} multi-power lines.`);
