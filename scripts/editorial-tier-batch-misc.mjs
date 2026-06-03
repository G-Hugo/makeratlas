/**
 * Tier editorial: Acmer, Ortur, Sculpfun, TwoTrees, xTool D1, Creality A1, ComMarker UV.
 * Run: node scripts/editorial-tier-batch-misc.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = "content/machines";

export const PACKS = {
  "acmer-p1-10w": {
    pros: [
      "Cheapest Acmer P1 tier for engraving-first hobby work",
      "Full-size open frame with LightBurn path",
      "Good starter before P2 or enclosed P3",
    ],
    cons: [
      "Limited cut depth versus P1 20W",
      "Open-frame safety and exhaust on you",
      "Verify optical 10W on marketplace listings",
    ],
    editorialDepth: {
      advantages: "P1 10W is Acmer's entry point when marks matter more than thick cutting.",
      limitations: "Paid cutting shops should open P1 20W or compare P3 enclosed.",
    },
  },
  "acmer-p1-20w": {
    pros: [
      "Balanced P1 tier for mixed engraving and thin wood cutting",
      "Strong value in the buying guide budget row",
      "Upgrade path to P2 or P3 on the same brand",
    ],
    cons: [
      "Open frame: glasses and ventilation required",
      "Clear acrylic still wants CO₂",
      "33W P2 adds speed if cutting dominates",
    ],
    editorialDepth: {
      advantages: "P1 20W is the Acmer SKU most budget buyers should compare to Ray5 and A5 Pro 20W.",
      limitations: "Frame and community trail Ortur. Enclosed apartment: compare Acmer P3.",
    },
  },
  "acmer-s2-pro-36w": {
    pros: [
      "Mid-high Acmer open frame between P2 and flagship watts",
      "Compressed diode class for faster panel work",
      "Large bed for sign layouts on a budget",
    ],
    cons: [
      "48W tier adds more headroom for cut-heavy weeks",
      "Open-frame rules apply",
      "Diode acrylic limits unchanged",
    ],
    editorialDepth: {
      advantages: "S2 Pro 36W suits makers who want Acmer speed without the top SKU price.",
      limitations: "Compare S30 Ultra 22W and LM3 20W on bundle quality before checkout.",
    },
  },
  "acmer-s2-pro-48w": {
    pros: [
      "Top Acmer open-frame wattage for wood-heavy batches",
      "Fastest option in the S2 Pro line for hobby production",
      "Still below CO₂ if ventilation is the blocker",
    ],
    cons: [
      "Fine photo engraving may need slower tuning",
      "Not for clear acrylic sign shops",
      "Open-frame smoke not contained",
    ],
    editorialDepth: {
      advantages: "S2 Pro 48W targets throughput-focused Acmer buyers on a large open chassis.",
      limitations: "Enclosed or CO₂ paths remain better for apartment sign work.",
    },
  },
  "ortur-lm2-s2-5w": {
    pros: [
      "Lowest Ortur price point in the catalog",
      "Classic LM2 community for first laser tests",
      "Enough bed for coasters and small gifts",
    ],
    cons: [
      "Outclassed by LM3 and H20 for most new buyers",
      "Minimal cutting ability",
      "Open-frame safety entirely on you",
    ],
    editorialDepth: {
      advantages: "LM2 5W only makes sense on steep discount for pure learning.",
      limitations: "Buying guide steers paying customers to newer Ortur tiers.",
    },
  },
  "ortur-lm2-s2-10w": {
    pros: [
      "Budget Ortur 10W for engraving-first projects",
      "Huge historical forum content for troubleshooting",
      "Stepping stone before LM3 20W",
    ],
    cons: [
      "Older frame versus Laser Master 3",
      "Thin cutting only",
      "Consider LM3 10W for stiffer chassis",
    ],
    editorialDepth: {
      advantages: "LM2 10W remains viable when priced well below LM3 equivalents.",
      limitations: "Most 2026 buyers should compare LM3 or H20 first.",
    },
  },
  "ortur-laser-master-3-10w": {
    pros: [
      "Engraving-first LM3 with the same bed as 20W",
      "Safer learning path before paying for cut watts",
      "Ortur ecosystem with upgrade to 20W module",
    ],
    cons: [
      "Not for shops cutting thick stock daily",
      "Open-frame exhaust required",
      "20W tier is the guide's default pick",
    ],
    editorialDepth: {
      advantages: "LM3 10W fits detail-heavy gifts on Ortur's best-selling frame.",
      limitations: "Mixed businesses should start on the 20W profile.",
    },
  },
  "ortur-laser-master-h10-10w": {
    pros: [
      "Entry H10 tier on Ortur's newer integrated chassis",
      "Engraving-focused with cleaner industrial styling than LM2",
      "Modular line supports higher watt upgrades",
    ],
    cons: [
      "Less community content than LM3",
      "Limited cutting depth",
      "Verify H10 SKU versus LM3 listings",
    ],
    editorialDepth: {
      advantages: "H10 10W for buyers who prefer the H-series frame for gift engraving.",
      limitations: "Compare LM3 10W value before choosing H10 family.",
    },
  },
  "ortur-laser-master-h10-20w": {
    pros: [
      "Balanced H10 20W for mixed hobby work",
      "Integrated Ortur frame with modular upgrade story",
      "Alternative aesthetic to classic LM3 open design",
    ],
    cons: [
      "LM3 20W still wins community depth for most buyers",
      "40W H10 adds cut speed if needed",
      "Open-frame ventilation mandatory",
    ],
    editorialDepth: {
      advantages: "H10 20W suits Ortur fans who want the H chassis without H20 modular complexity.",
      limitations: "Side-by-side LM3 20W pricing and support before committing.",
    },
  },
  "ortur-laser-master-h10-40w": {
    pros: [
      "Fastest H10 head for cut-biased makers",
      "Good when you like H-series build but need LM3-class speed",
      "Modular Ortur path without jumping to CO₂",
    ],
    cons: [
      "Photo finesse may need slower passes",
      "Diode acrylic limits remain",
      "Open-frame safety not optional",
    ],
    editorialDepth: {
      advantages: "H10 40W for cut-heavy weeks on the H10 platform.",
      limitations: "Compare H20 40W modular and Falcon2 Pro 40W bundles.",
    },
  },
  "ortur-h20-10w": {
    pros: [
      "Entry H20 module on modular Ortur platform",
      "Engraving-first with upgrade to 20W or 40W heads",
      "Integrated frame versus classic LM aesthetics",
    ],
    cons: [
      "20W H20 tier is the usual sweet spot",
      "Bundle confusion on optical modules",
      "Open-frame rules apply",
    ],
    editorialDepth: {
      advantages: "H20 10W when you want the modular platform but rarely cut thick stock.",
      limitations: "Most buyers should read H20 20W first.",
    },
  },
  "ortur-h20-40w": {
    pros: [
      "Top H20 cutting head for wood-heavy schedules",
      "Modular upgrades without replacing the whole machine",
      "Ortur ecosystem for makers who plan watt steps",
    ],
    cons: [
      "LM3 40W comparisons matter on price",
      "Clear acrylic production wants CO₂",
      "Open-frame exhaust and glasses required",
    ],
    editorialDepth: {
      advantages: "H20 40W when you are committed to the H20 platform and need maximum diode cutting.",
      limitations: "Verify which optical module ships in the bundle.",
    },
  },
  "sculpfun-s9-5w": {
    pros: [
      "Lowest S9 entry for engraving tests",
      "Massive Sculpfun community knowledge",
      "Full bed at budget pricing",
    ],
    cons: [
      "S9 10W is usually the better buy new",
      "Almost no production cutting",
      "Open-frame safety on you",
    ],
    editorialDepth: {
      advantages: "S9 5W only on deep discount for learning.",
      limitations: "New buyers: compare S9 10W and S30 Ultra promos.",
    },
  },
  "sculpfun-s9-10w": {
    pros: [
      "Canonical S9 configuration in buying guide",
      "Best engraving-per-dollar in Sculpfun open line",
      "LightBurn recipes widely shared",
    ],
    cons: [
      "Slow cuts versus 20W class",
      "S30 Ultra often worth the small price jump",
      "Open-frame ventilation required",
    ],
    editorialDepth: {
      advantages: "S9 10W is the engraving-business budget pick when S30 pricing is high.",
      limitations: "Cut-heavy quotes need LM3 or S30 class machines.",
    },
  },
  "sculpfun-s30-ultra-10w": {
    pros: [
      "Engraving-first Ultra tier on current Sculpfun frame",
      "Cheaper entry into S30 Ultra hardware generation",
      "Upgrade story to 22W within same line",
    ],
    cons: [
      "22W is the flagship cut tier most buyers want",
      "Open-frame safety rules",
      "Not for thick production cutting",
    ],
    editorialDepth: {
      advantages: "Ultra 10W when you want Sculpfun's newest frame for gifts, not panels.",
      limitations: "Cutting businesses should open Ultra 22W profile.",
    },
  },
  "sculpfun-s30-ultra-20w": {
    pros: [
      "Mid Ultra tier between 10W engraving and 22W flagship",
      "Current Sculpfun frame with solid community",
      "Good if 22W bundles are out of stock",
    ],
    cons: [
      "22W adds meaningful cut speed for similar money",
      "Open frame: exhaust and glasses",
      "Clear acrylic wants CO₂",
    ],
    editorialDepth: {
      advantages: "Ultra 20W is a compromise SKU: compare pricing against 22W before buying.",
      limitations: "Most production-minded buyers should target 22W.",
    },
  },
  "sculpfun-icube-pro-5w": {
    pros: [
      "Compact enclosed-leaning Sculpfun form factor at low watts",
      "Interesting for small apartments and desk gifts",
      "Sculpfun ecosystem entry",
    ],
    cons: [
      "Limited power for cutting or speed",
      "Verify enclosure and filter bundle",
      "10W tier adds practical headroom",
    ],
    editorialDepth: {
      advantages: "iCube Pro 5W for space-constrained engraving experiments.",
      limitations: "Compare S9 10W value unless compact size is mandatory.",
    },
  },
  "sculpfun-icube-pro-10w": {
    pros: [
      "More capable iCube tier for home gift engraving",
      "Smaller footprint than S30 open frames",
      "Sculpfun support and mods growing",
    ],
    cons: [
      "Bed size limits sign work",
      "Open or partial enclosure varies by SKU",
      "S30 Ultra often better $/watt",
    ],
    editorialDepth: {
      advantages: "iCube Pro 10W when desk size matters more than maximum bed.",
      limitations: "Sign makers need larger open-frame or CO₂ paths.",
    },
  },
  "two-trees-ts2-20w": {
    pros: [
      "TwoTrees 20W open frame often aggressive on specs per dollar",
      "Good for hobbyists chasing bundle deals",
      "LightBurn compatible for mixed engrave and cut",
    ],
    cons: [
      "Support and community thinner than Ortur or Sculpfun",
      "Verify optical power and frame revision",
      "40W tier adds cut headroom",
    ],
    editorialDepth: {
      advantages: "TS2 20W when sale price beats name-brand equivalents and you accept less hand-holding.",
      limitations: "Production shops favor LM3 or S30 for troubleshooting depth.",
    },
  },
  "two-trees-ts2-40w": {
    pros: [
      "Top TS2 wattage for faster wood cutting",
      "Specs-heavy marketing: validate real-world tests",
      "Budget alternative to Falcon2 Pro 40W",
    ],
    cons: [
      "Build quality varies by batch",
      "Open-frame safety not optional",
      "Diode acrylic limits unchanged",
    ],
    editorialDepth: {
      advantages: "TS2 40W for cut-focused buyers who prioritize price over brand community.",
      limitations: "Read owner reviews on belt tension and focus repeatability before buying.",
    },
  },
  "twotrees-tts-55-10w": {
    pros: [
      "Entry TTS-55 tier on TwoTrees large-format line",
      "Engraving-first on a wide bed chassis",
      "Budget path into 55-class frames",
    ],
    cons: [
      "Higher watt tiers add real cutting speed",
      "Assembly and calibration demand patience",
      "Open-frame exhaust required",
    ],
    editorialDepth: {
      advantages: "TTS-55 10W when you need bed size for layouts but not daily thick cuts.",
      limitations: "Compare Ortur value if community support matters.",
    },
  },
  "twotrees-tts-55-20w": {
    pros: [
      "Balanced TTS-55 20W for wide-bed mixed work",
      "Interesting for large panel layouts on a budget",
      "Often bundled with extension kits",
    ],
    cons: [
      "Brand support trails major lines",
      "40W tier for cut-heavy production",
      "Verify shipped module wattage",
    ],
    editorialDepth: {
      advantages: "TTS-55 20W for makers who need physical width more than enclosure.",
      limitations: "Treat assembly quality as part of total cost of ownership.",
    },
  },
  "twotrees-tts-55-40w": {
    pros: [
      "Highest TTS-55 throughput for wood panels",
      "Large bed plus high optical class on sale weekends",
      "Alternative to CO₂ when only organics pay bills",
    ],
    cons: [
      "Frame maintenance critical at 40W",
      "Not for cast acrylic shops",
      "Community recipes still growing",
    ],
    editorialDepth: {
      advantages: "TTS-55 40W when wide format and cut speed beat brand loyalty.",
      limitations: "Enclosed apartment makers should not chase 40W open frames alone.",
    },
  },
  "two-trees-tts-55-pro-10w": {
    pros: [
      "Pro-line TTS-55 with upgraded components versus base 55",
      "10W engraving tier on wide chassis",
      "Check Pro bundle for air assist and bed size",
    ],
    cons: [
      "20W Pro usually better value for mixed work",
      "Open-frame safety on you",
      "Verify Pro versus non-Pro listing",
    ],
    editorialDepth: {
      advantages: "TTS-55 Pro 10W for wide layouts with engraving-heavy jobs.",
      limitations: "Mixed businesses should compare Pro 20W pricing.",
    },
  },
  "two-trees-tts-55-pro-20w": {
    pros: [
      "Sweet-spot Pro 55 tier for large-bed 20W work",
      "Often marketed with air assist in Pro packs",
      "Good for hobby sign panels on a budget",
    ],
    cons: [
      "40W Pro adds speed for cut-heavy weeks",
      "Support ecosystem smaller than Ortur",
      "Clear acrylic needs CO₂",
    ],
    editorialDepth: {
      advantages: "TTS-55 Pro 20W when Pro hardware extras justify price over base 55 20W.",
      limitations: "Confirm optical watts and rail quality in owner reviews.",
    },
  },
  "xtool-d1-pro-5w": {
    pros: [
      "Entry xTool D1 Pro for brand ecosystem on a budget",
      "Riser-friendly frame for tumblers on some setups",
      "xTool Creative Space onboarding",
    ],
    cons: [
      "Slow for any real cutting",
      "Open-frame versus enclosed S1",
      "10W tier is minimum for most shops",
    ],
    editorialDepth: {
      advantages: "D1 Pro 5W when you want xTool software habits cheaply.",
      limitations: "Most buyers should start at D1 Pro 10W or S1 enclosed.",
    },
  },
  "xtool-d1-pro-10w": {
    pros: [
      "Popular D1 Pro engraving tier with xTool support",
      "Modular riser ecosystem for cylinders",
      "Stepping stone before D1 Pro 20W or S1",
    ],
    cons: [
      "Cutting still limited to thin stock",
      "Open-frame safety and smoke on you",
      "S1 enclosed worth compare at sale time",
    ],
    editorialDepth: {
      advantages: "D1 Pro 10W for xTool fans focused on gifts and marks.",
      limitations: "Cutting revenue pushes you to 20W or enclosed lines.",
    },
  },
  "xtool-d1-pro-20w": {
    pros: [
      "Top open-frame xTool diode before S1 enclosure",
      "Strong software and accessory store integration",
      "20W cutting credible for hobby side businesses",
    ],
    cons: [
      "Open frame: not apartment-safe by default",
      "S1 20W adds enclosure at higher price",
      "CO₂ still needed for clear acrylic",
    ],
    editorialDepth: {
      advantages: "D1 Pro 20W when you want xTool ecosystem without S1 pricing.",
      limitations: "Families with kids/pets should price S1 20W before committing.",
    },
  },
  "xtool-d1-pro-40w": {
    pros: [
      "Fastest D1 Pro head for cut-biased xTool buyers",
      "Same riser and accessory path as lower tiers",
      "Highest open-frame xTool throughput",
    ],
    cons: [
      "Fine engraving may need slower settings",
      "Still diode material limits",
      "S1 40W adds enclosure if safety matters",
    ],
    editorialDepth: {
      advantages: "D1 Pro 40W for xTool loyalists who need speed without S1 budget.",
      limitations: "Compare S1 40W total cost when smoke containment matters.",
    },
  },
  "creality-falcon-a1-10w": {
    pros: [
      "Entry enclosed Falcon A1 for safer home engraving",
      "Lower price than A1 Pro dual-source",
      "Creality laser app for beginners",
    ],
    cons: [
      "Smaller bed than open Falcon2 lines",
      "10W limits cutting depth",
      "A1 Pro adds IR for more materials",
    ],
    editorialDepth: {
      advantages: "Falcon A1 10W when enclosure safety beats raw watts.",
      limitations: "Mixed cut businesses should compare A1 Pro 20W.",
    },
  },
  "commarker-omni-x-uv": {
    pros: [
      "Desktop UV laser for plastics and marked substrates UV can treat",
      "Compact bench unit versus fiber galvo footprint",
      "Different workflow from diode or CO₂ gift machines",
    ],
    cons: [
      "Not a wood/acrylic cutter for Etsy signs",
      "Material compatibility is narrow: test before quoting",
      "Consumables and maintenance unlike diode hobby lasers",
    ],
    editorialDepth: {
      advantages: "Omni X UV fits buyers who already know they need UV marking, not general hobby cutting.",
      limitations: "Do not buy as your first 'laser engraver' for wood signs. Verify substrate list with vendor.",
    },
  },
  "commarker-omni-xe-uv": {
    pros: [
      "Expanded UV platform in ComMarker Omni line",
      "For shops adding UV marking alongside other tools",
      "Bench-scale versus industrial UV lines",
    ],
    cons: [
      "Not interchangeable with diode/CO₂ buyer expectations",
      "Throughput lower than fiber for metal at scale",
      "Training curve on UV-safe materials",
    ],
    editorialDepth: {
      advantages: "Omni XE UV when UV is a deliberate second machine, not a diode replacement.",
      limitations: "Hobby wood/acrylic makers should stay on diode or CO₂ profiles.",
    },
  },
};

function applyPacks() {
  let updated = 0;
  for (const [slug, pack] of Object.entries(PACKS)) {
    const filePath = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(filePath)) continue;
    const m = JSON.parse(fs.readFileSync(filePath, "utf8"));
    m.pros = pack.pros;
    if (pack.cons) m.cons = pack.cons;
    if (pack.editorialDepth) m.editorialDepth = pack.editorialDepth;
    m.tierEditorialOverride = true;
    fs.writeFileSync(filePath, `${JSON.stringify(m, null, 2)}\n`, "utf8");
    updated++;
  }
  console.log(`Updated ${updated} misc tier profiles.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) applyPacks();
