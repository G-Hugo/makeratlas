/**
 * Hand editorial for Longer / Creality / Atomstack / Comgrow / Algolaser tier SKUs.
 * Run: node scripts/editorial-tier-batch-brand.mjs
 */
import fs from "fs";
import path from "path";

const dir = "content/machines";

/** slug -> { pros, cons?, editorialDepth? } — always sets tierEditorialOverride */
const PACKS = {
  "longer-ray5-5w": {
    pros: [
      "Lowest Ray5 price for learning LightBurn on a compact desk machine",
      "Fixed-focus simplicity suits coasters, tags, and first engraving tests",
      "Small footprint for dorms and apartments with window exhaust",
      "Logical first step before Ray5 10W or 20W if cutting grows later",
    ],
    cons: [
      "Slow on filled photos and any basswood thicker than ~3 mm",
      "Open-frame safety and ventilation are entirely on you",
      "Verify you are buying the 5W SKU, not a higher-watt listing",
    ],
    editorialDepth: {
      advantages:
        "Ray5 5W is a classroom machine: cheap enough to test whether laser work fits your hobby before you invest in speed. It engraves wood, leather, and slate credibly when you accept long job times.",
      limitations:
        "Side businesses quoting cut-out keychains or thick wood should skip straight to Ray5 20W. Cast acrylic and bare metal are out of scope. Combined-watt marketing on marketplaces is misleading: confirm optical power on the invoice.",
    },
  },
  "longer-ray5-10w": {
    pros: [
      "Engraving-first Ray5 tier with better photo fills than 5W",
      "Still compact and affordable versus Ortur LM3 class machines",
      "Good second machine for makers who want a backup engraver",
      "Upgrade path to 20W or 40W on the same Ray5 family page",
    ],
    cons: [
      "Cutting stays limited to thin basswood and paper-class stock",
      "Open frame: plan glasses, exhaust, and supervision rules",
      "Not the SKU if paid cutting work is already on your calendar",
    ],
    editorialDepth: {
      advantages:
        "Choose 10W when your jobs are mostly marks and gifts, not panel cutting. You keep Ray5's simple desk format while gaining noticeably cleaner fills than the 5W module.",
      limitations:
        "Shops cutting 6 mm+ basswood daily should open the 20W profile. Clear acrylic production still requires CO₂. SKU confusion between Ray5 wattages is common on reseller sites.",
    },
  },
  "longer-ray5-20w": {
    pros: [
      "Default Ray5 pick for mixed engraving and light wood cutting",
      "Often discounted under Ortur LM3 20W during sales seasons",
      "375 mm bed fits signs and gift batches without a huge desk",
      "LightBurn compatible once you outgrow Longer Laser Tool",
      "Strong budget alternative in the buying guide mid row",
    ],
    cons: [
      "Open-frame safety and exhaust are non-negotiable",
      "Stiffer frames like A40 Pro or LM3 feel more planted at speed",
      "Verify optical 20W on the listing, not combined-watt headlines",
    ],
    editorialDepth: {
      advantages:
        "Ray5 20W is the wattage most buyers mean when they search 'Longer laser'. It balances Etsy-style engraving with moderate basswood cuts when air assist and ventilation are sorted.",
      limitations:
        "Production acrylic signs or thick hardwood still push you to CO₂ or Ray5 40W. Community depth is smaller than Ortur or Sculpfun. Photo purists may prefer slower passes on the 10W tier.",
    },
  },
  "longer-ray5-40w": {
    pros: [
      "Top Ray5 head for faster cuts on wood and dark acrylic",
      "Best choice in the line if Ray5 format already fits your desk",
      "Useful when 20W job times block evening production batches",
      "Still far cheaper than enclosed or CO₂ routes",
    ],
    cons: [
      "Ultra-fine photo engraving may need slower settings than 10W",
      "Still a diode: clear cast acrylic wants CO₂",
      "Open frame: kids, pets, and smoke are not contained",
    ],
    editorialDepth: {
      advantages:
        "Pick 40W when Ray5's compact chassis works for you but 20W throughput is the bottleneck. You stay on Longer's entry hardware with the highest cut bias in the family.",
      limitations:
        "Frame flex and duty cycle matter more at 40W class power. Compare Longer Laser B1 or Sculpfun S30 Ultra if you need a larger bed. Enclosed buyers should look at xTool S1 instead of chasing watts on Ray5.",
    },
  },
  "longer-laser-b1-20w": {
    pros: [
      "Large-format Longer open frame for bigger panels than Ray5",
      "20W sweet spot for hobby side businesses on a budget",
      "Popular upgrade from Ray5 when bed size becomes the limit",
      "LightBurn workflow with documented Longer community groups",
    ],
    cons: [
      "Takes more desk space and assembly patience than Ray5",
      "Higher tiers (30W/40W) add cut speed if wood cutting dominates",
      "Open-frame ventilation and eye protection required",
    ],
    editorialDepth: {
      advantages:
        "B1 20W fits makers who need physical room for signs and jigs more than enclosure luxury. It is the logical Longer step-up when Ray5's 375 mm bed blocks your layouts.",
      limitations:
        "Not as stiff or community-supported as Ortur LM3 at similar watts. Cast acrylic production is still a CO₂ project. Confirm bundle contents: some listings ship without air assist.",
    },
  },
  "longer-laser-b1-30w": {
    pros: [
      "Compressed-diode class between 20W and 40W on the B1 frame",
      "Faster evening cuts on 6–8 mm basswood than B1 20W",
      "Large bed keeps panel layouts without jumping to CO₂",
      "Good mid-tier for makers who outgrew Ray5 but skip enclosure cost",
    ],
    cons: [
      "Photo engraving may need slower tuning than engraving-first modules",
      "Still open-frame with diode acrylic limits",
      "Compare S30 Ultra 22W and LM3 20W before checkout",
    ],
    editorialDepth: {
      advantages:
        "B1 30W targets cut-heavy weeks on a large Longer chassis without paying for 40W marketing peaks. Treat it as a throughput upgrade while you keep the same desk footprint class as B1 20W.",
      limitations:
        "Diode material limits unchanged. Apartment makers needing smoke containment should compare enclosed machines. Verify actual optical module in the box.",
    },
  },
  "longer-laser-b1-40w": {
    pros: [
      "Fastest B1 tier for thick soft-wood cutting in the Longer lineup",
      "Large work area suits multi-up gift production",
      "Strong value when you want speed without CO₂ ventilation projects",
      "Worth pairing with quality air assist and exterior exhaust",
    ],
    cons: [
      "Frame and motion system work harder: maintain belts and focus",
      "Clear acrylic and production signage still want CO₂",
      "Open-frame safety rules apply at full power",
    ],
    editorialDepth: {
      advantages:
        "B1 40W is for buyers already committed to Longer's large open frame who need maximum diode cutting on wood. Batch makers will feel the difference versus 20W on repeated 8 mm passes.",
      limitations:
        "Not a substitute for CO₂ acrylic shops. Fine photo work may look better on B1 20W with tuned speeds. Budget for exhaust upgrades when moving from Ray5.",
    },
  },
  "longer-nano-6w": {
    pros: [
      "Ultra-compact Longer engraver for travel and tiny gifts",
      "Low power draw and small desk footprint",
      "Good for leather tags, small plywood tests, and learning software",
    ],
    cons: [
      "Not a cutting or production machine",
      "Limited bed size blocks larger signs",
      "Open-frame eye protection still required",
    ],
    editorialDepth: {
      advantages:
        "Nano 6W sells portability and low risk entry. It fits makers who want to test laser workflows on small blanks before buying a full-size frame.",
      limitations:
        "Any paid cutting business should look at Ray5 20W minimum. Job times on photos scale with bed size and wattage. Treat combined-watt ads skeptically.",
    },
  },
  "longer-nano-pro-12w": {
    pros: [
      "Step up from Nano with more engraving speed in the same compact class",
      "Still portable compared with Ray5 or B1 frames",
      "Useful for craft fairs and small personalized goods",
    ],
    cons: [
      "Cutting depth remains hobby-level only",
      "Bed size limits sign and panel work",
      "Open-frame exhaust needed even for small jobs",
    ],
    editorialDepth: {
      advantages:
        "Nano Pro 12W bridges toy-class engravers and full-size diodes. You gain workable speeds on wood and leather gifts without dedicating half a desk.",
      limitations:
        "When you quote cut-out shapes to customers, move to Ray5 20W. Not comparable to enclosed apartment machines for smoke control.",
    },
  },
  "creality-falcon2-12w": {
    pros: [
      "Entry Falcon2 tier with Creality software hand-holding",
      "Built-in air assist on many bundles helps first cuts",
      "Engraving-first pricing under the 22W and 40W SKUs",
    ],
    cons: [
      "Limited cut depth versus 22W Falcon2 siblings",
      "Open-frame safety and ventilation on you",
      "Color-engrave marketing does not replace material limits",
    ],
    editorialDepth: {
      advantages:
        "Falcon2 12W suits Creality 3D printer owners who want one-brand laser learning. Air assist and structured chassis beat bare-bones 5W frames for first cuts.",
      limitations:
        "Side businesses cutting daily should compare 22W or open LM3 class value. Clear acrylic still needs CO₂.",
    },
  },
  "creality-falcon2-22w": {
    pros: [
      "Balanced Falcon2 tier before paying for Pro branding",
      "Built-in air assist and stiff frame for hobby cutting",
      "Color metal marking gimmick can help gift personalization",
      "Large bed versus Ray5 class machines",
    ],
    cons: [
      "Pro line adds features you may not need: compare pricing",
      "Still open-frame with diode acrylic limits",
      "Verify optical 22W, not headline combined watts",
    ],
    editorialDepth: {
      advantages:
        "Falcon2 22W is the value pick in Creality's open-frame line when you want air assist without Pro upsell. Good for mixed wood and dark acrylic experiments.",
      limitations:
        "Production shops may still prefer Sculpfun Ultra or LM3 community depth. Photo finesse can trail slower engraving-first modules.",
    },
  },
  "creality-falcon2-pro-22w": {
    pros: [
      "Creality's popular 22W open-frame tier with factory air assist",
      "Color engraving feature useful for stainless gift marks",
      "Large 400 mm class bed for signs and panels",
      "Structured frame versus budget Ortur-era designs",
      "Strong competitor to S30 Ultra 22W on sale weekends",
    ],
    cons: [
      "Open-frame: glasses, exhaust, and kid/pet rules are on you",
      "Clear cast acrylic still needs CO₂",
      "40W tier adds headroom if cutting pays your bills",
    ],
    editorialDepth: {
      advantages:
        "Falcon2 Pro 22W targets makers who want Creality ecosystem integration and out-of-box air assist. It is a credible cut-biased diode before CO₂ investment.",
      limitations:
        "Color marking is not fiber-depth engraving. Community recipes are thinner than Sculpfun or Ortur. Enclosed apartment buyers should compare Falcon A1 Pro.",
    },
  },
  "creality-falcon2-pro-40w": {
    pros: [
      "Top open-frame Creality diode for cut-heavy hobby businesses",
      "Highest throughput in the Falcon2 Pro line on wood",
      "Air assist and rigid frame included on most bundles",
      "Still below CO₂ pricing if ventilation is the blocker",
    ],
    cons: [
      "Fine photo work may need slower settings than 12W tier",
      "Diode limits on clear acrylic unchanged",
      "Open-frame smoke and beam safety not contained",
    ],
    editorialDepth: {
      advantages:
        "Choose 40W when Falcon2 Pro's format fits your shop and 22W job times hurt quotes. Creality's strongest diode argument is speed on organics with factory air assist.",
      limitations:
        "Sign shops cutting clear acrylic daily still need CO₂. Compare OMTech or xTool P2 lease costs before assuming 40W diode replaces them.",
    },
  },
  "creality-falcon-a1-pro-20w": {
    pros: [
      "Enclosed Creality with diode plus IR for broader material trials",
      "Safer around family than Falcon2 open frames at similar ambition",
      "Smaller bed suits apartment makers and gift focus",
      "Dual-source setup marks some metals plastics without full fiber",
    ],
    cons: [
      "250 mm class bed blocks large sign panels",
      "You must learn both diode and IR workflows",
      "Not a CO₂ replacement for clear acrylic production",
    ],
    editorialDepth: {
      advantages:
        "A1 Pro 20W fits buyers who want enclosure safety and material experiments without xTool pricing. IR adds marking options diode-only boxes cannot offer.",
      limitations:
        "Small bed is the real limiter for sign shops. Support and software polish trail xTool. Heavy cutting still needs ventilation despite enclosure.",
    },
  },
  "atomstack-a5-pro-5w": {
    pros: [
      "Classic budget Atomstack entry with huge community history",
      "Full-size bed at low price for learning LightBurn",
      "Proven frame for engraving coasters and leather gifts",
    ],
    cons: [
      "Minimal cutting ability versus 10W or 20W tiers",
      "Open-frame safety entirely on you",
      "Older design feels basic next to A40 Pro",
    ],
    editorialDepth: {
      advantages:
        "A5 Pro 5W remains relevant on deep discount: you get Atomstack's ecosystem and mods documentation at entry pricing.",
      limitations:
        "New buyers with budget for 10W should usually skip 5W. Production cutting is not realistic. Verify seller is not shipping a mismatched module.",
    },
  },
  "atomstack-a5-pro-10w": {
    pros: [
      "Most popular A5 Pro tier for engraving-first hobby sales",
      "Affordable full bed for Slate, wood, and leather gifts",
      "Massive third-party mod knowledge base online",
    ],
    cons: [
      "Cutting limited to thin stock",
      "Frame flex shows if you push aggressive cut speeds",
      "Upgrade to A40 Pro or 20W A5 when cutting dominates",
    ],
    editorialDepth: {
      advantages:
        "A5 Pro 10W is the engraving sweet spot in Atomstack's budget line. Ideal when you charge for marks, not thick cut-outs.",
      limitations:
        "Mixed cut/engrave businesses outgrow this tier quickly. Compare Ortur LM3 10W for stiffer frame at similar money.",
    },
  },
  "atomstack-a5-pro-20w": {
    pros: [
      "Highest A5 Pro module for moderate cutting on the classic frame",
      "Still among the cheapest 20W full-bed machines",
      "Community firmware and LightBurn profiles widely shared",
    ],
    cons: [
      "A40 Pro frame is stiffer for the same wattage class",
      "Open-frame exhaust and glasses mandatory",
      "SKU verification essential on marketplace listings",
    ],
    editorialDepth: {
      advantages:
        "A5 Pro 20W suits makers who already know the A5 ecosystem and need more cut without new chassis investment.",
      limitations:
        "Frame limitations versus LM3 or A40 Pro matter on thick cuts. Plan upgrade path when quotes include daily basswood panels.",
    },
  },
  "atomstack-a40-pro-20w": {
    pros: [
      "Stiffer Atomstack frame than A5 Pro at the same 20W class",
      "Large bed for signs and multi-up gift layouts",
      "Often priced competitively with Ortur LM3 20W",
      "Good mid-tier open frame before enclosed machines",
    ],
    cons: [
      "40W tier adds cut headroom if production grows",
      "Open-frame safety and ventilation not optional",
      "Clear acrylic production still wants CO₂",
    ],
    editorialDepth: {
      advantages:
        "A40 Pro 20W is Atomstack's balanced recommendation: better mechanics than A5 with 20W optical power for mixed hobby businesses.",
      limitations:
        "Community size trails Ortur. Enclosed buyers should compare xTool S1 20W. Confirm optical wattage, not '40W combined' ads alone.",
    },
  },
  "atomstack-a40-pro-40w": {
    pros: [
      "Fastest A40 Pro head for cut-focused makers",
      "Rigid frame handles higher speeds better than A5 line",
      "Strong value for wood-heavy Etsy batches",
      "LightBurn-ready for production-minded hobbyists",
    ],
    cons: [
      "Photo engraving may need slower passes than 20W",
      "Diode acrylic limits unchanged",
      "Open-frame smoke containment not included",
    ],
    editorialDepth: {
      advantages:
        "A40 Pro 40W is for buyers committed to Atomstack's larger frame who need maximum diode cutting without CO₂ setup.",
      limitations:
        "Still not sign-shop acrylic equipment. Compare Falcon2 Pro 40W and S30 Ultra 22W on bundle price and air assist quality.",
    },
  },
  "comgrow-z1-5w": {
    pros: [
      "Very low entry price for testing laser engraving",
      "Comgrow bundles often target first-time buyers",
      "Compact learning platform before Z1 10W",
    ],
    cons: [
      "Not suitable for paid cutting work",
      "Support and community smaller than Sculpfun or Ortur",
      "Open-frame safety on you from day one",
    ],
    editorialDepth: {
      advantages:
        "Z1 5W is a trial machine: prove you will use a laser before spending on 20W class hardware.",
      limitations:
        "Skip if you already know you need cutting. Reseller SKU confusion is common. Budget for glasses and exhaust immediately.",
    },
  },
  "comgrow-z1-10w": {
    pros: [
      "Affordable 10W engraver for gifts and learning",
      "Step up from 5W without full 20W pricing",
      "Works for leather, wood marks, and thin cuts",
    ],
    cons: [
      "Cutting depth limited versus Z1 20W",
      "Brand community thinner than major lines",
      "Open-frame rules apply",
    ],
    editorialDepth: {
      advantages:
        "Z1 10W fits casual engravers who want faster fills than 5W on a tight Comgrow deal.",
      limitations:
        "Businesses quoting cut-outs should buy 20W tier. Compare Sculpfun S9 on sale before committing.",
    },
  },
  "comgrow-z1-20w": {
    pros: [
      "Top Z1 tier for mixed engrave and light cutting on a budget",
      "Often among the lowest 20W full-bed prices online",
      "Good spare machine or gift-shop starter",
    ],
    cons: [
      "Build quality and support trail Ortur or Sculpfun",
      "Verify optical power and bundle contents carefully",
      "Open-frame exhaust required for regular cutting",
    ],
    editorialDepth: {
      advantages:
        "Z1 20W makes sense when price is the only decision variable and you accept thinner ecosystem support.",
      limitations:
        "Heavy users will outgrow frame and community resources. Compare LM3 20W for longevity. Not for enclosed apartment requirements.",
    },
  },
  "algolaser-alpha-mk2-10w": {
    pros: [
      "Algolaser compact platform with engraving-first 10W module",
      "Interesting option for makers exploring newer brands",
      "Suitable for detail gifts and leather work",
    ],
    cons: [
      "Less community depth than Ortur or Sculpfun",
      "Cutting limited: compare 20W or 40W tiers",
      "Open-frame ventilation required",
    ],
    editorialDepth: {
      advantages:
        "Alpha MK2 10W targets buyers curious about Algolaser industrial styling at hobby watts.",
      limitations:
        "Treat community size as a risk factor for troubleshooting. Production cutting wants higher tiers or established brands.",
    },
  },
  "algolaser-alpha-mk2-20w": {
    pros: [
      "Balanced MK2 tier for mixed hobby engraving and cutting",
      "Modern Algolaser frame versus legacy open designs",
      "Worth comparing on price against LM3 and Ray5 20W",
    ],
    cons: [
      "Smaller owner community than Ortur",
      "40W tier adds speed if cutting pays bills",
      "Open-frame safety not optional",
    ],
    editorialDepth: {
      advantages:
        "MK2 20W is the sensible Algolaser pick when you want their hardware without flagship watts.",
      limitations:
        "Verify warranty and seller support in your region. Clear acrylic and metal depth still need other laser categories.",
    },
  },
  "algolaser-alpha-mk2-40w": {
    pros: [
      "Highest MK2 throughput for wood-heavy hobby weeks",
      "Algolaser marketing focuses on cut speed at this tier",
      "Alternative to Creality 40W or S30 class if priced well",
    ],
    cons: [
      "Fine engraving may need slower tuning than 10W",
      "Diode material limits unchanged",
      "Community recipes still maturing versus Sculpfun",
    ],
    editorialDepth: {
      advantages:
        "MK2 40W suits buyers already sold on Algolaser design who need maximum diode cutting in that chassis.",
      limitations:
        "Not proven for production sign shops. Compare established 40W bundles with air assist and return policies.",
    },
  },
};

let updated = 0;
for (const [slug, pack] of Object.entries(PACKS)) {
  const filePath = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn("missing", slug);
    continue;
  }
  const machine = JSON.parse(fs.readFileSync(filePath, "utf8"));
  machine.pros = pack.pros;
  if (pack.cons) machine.cons = pack.cons;
  if (pack.editorialDepth) machine.editorialDepth = pack.editorialDepth;
  machine.tierEditorialOverride = true;
  fs.writeFileSync(filePath, `${JSON.stringify(machine, null, 2)}\n`, "utf8");
  updated++;
}
console.log(`Updated ${updated} tier profiles.`);
