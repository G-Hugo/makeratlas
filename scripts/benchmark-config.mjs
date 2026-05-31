/**
 * Standard reference benchmarks — same size on every machine for fair comparison.
 * Only the TIME varies per machine.
 */
export const BENCHMARK = {
  engrave: {
    size: "10 × 10 cm (4 × 4 in)",
    description: "Filled photo or logo on birch plywood",
  },
  cutWood: {
    size: "10 × 10 cm (4 × 4 in)",
    description: "Simple square cut-out from 3 mm basswood",
  },
  cutAcrylic: {
    size: "10 × 10 cm (4 × 4 in)",
    description: "Simple square cut-out from 3 mm acrylic",
  },
  cutMetalMark: {
    size: "10 × 10 cm (4 × 4 in)",
    description: "Filled logo on stainless steel plate",
  },
};

/** @type {Record<string, { engraveTime: string, cutTime: string, cutType?: 'wood'|'acrylic'|'none'|'metal', engraveType?: 'wood'|'metal' }>} */
export const BENCHMARK_TIMES = {
  "xtool-p2": { engraveTime: "~4–6 min", cutTime: "~1–2 min", cutType: "acrylic", engraveType: "wood" },
  "xtool-d1-pro": { engraveTime: "~8–12 min", cutTime: "~4–6 min", cutType: "wood" },
  "xtool-s1": { engraveTime: "~8–12 min", cutTime: "~4–6 min", cutType: "wood" },
  "xtool-f1-ultra": { engraveTime: "~3–6 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "xtool-f2-ultra": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "xtool-m1-ultra": { engraveTime: "~10–14 min", cutTime: "Blade only (~2 min vinyl)", cutType: "none" },
  "ortur-laser-master-3": { engraveTime: "~10–15 min", cutTime: "~5–8 min", cutType: "wood" },
  "sculpfun-s30-ultra": { engraveTime: "~8–12 min", cutTime: "~5–8 min", cutType: "wood" },
  "sculpfun-icube-pro": { engraveTime: "~9–13 min", cutTime: "~5–7 min", cutType: "wood" },
  "atomstack-a5-pro": { engraveTime: "~14–20 min", cutTime: "~7–11 min", cutType: "wood" },
  "atomstack-a40-pro": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "glowforge-aura": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "wood" },
  "glowforge-pro": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "omtech-40w-co2": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "omtech-80w-co2": { engraveTime: "~4–6 min", cutTime: "~1–3 min", cutType: "acrylic" },
  "monport-55w-co2": { engraveTime: "~4–7 min", cutTime: "~2–3 min", cutType: "acrylic" },
  "creality-falcon2-pro": { engraveTime: "~8–12 min", cutTime: "~5–8 min", cutType: "wood" },
  "creality-falcon2-12w": { engraveTime: "~12–18 min", cutTime: "~8–12 min", cutType: "wood" },
  "longer-ray5": { engraveTime: "~12–18 min", cutTime: "~7–10 min", cutType: "wood" },
  "laserpecker-4": { engraveTime: "~18–25 min", cutTime: "Not a cutter", cutType: "none" },
  "wecreat-vision": { engraveTime: "~9–14 min", cutTime: "~5–7 min", cutType: "wood" },
  "twotrees-tts-55": { engraveTime: "~16–24 min", cutTime: "~9–14 min", cutType: "wood" },
  "acmer-p3": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "algolaser-alpha-mk2": { engraveTime: "~7–11 min", cutTime: "~4–7 min", cutType: "wood" },
  "hawk-20": { engraveTime: "~11–16 min", cutTime: "~5–8 min", cutType: "wood" },
  // New machines
  "xtool-p2s": { engraveTime: "~3–5 min", cutTime: "~1–2 min", cutType: "acrylic" },
  "xtool-f1": { engraveTime: "~4–8 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "gweike-cloud-pro": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "foxaliens-reisler-2": { engraveTime: "~9–13 min", cutTime: "~5–7 min", cutType: "wood" },
  "comgrow-z1": { engraveTime: "~11–16 min", cutTime: "~6–9 min", cutType: "wood" },
  "atezr-p2": { engraveTime: "~8–12 min", cutTime: "~5–8 min", cutType: "wood" },
  "laserpecker-5": { engraveTime: "~15–22 min", cutTime: "Not a cutter", cutType: "none" },
  "omtech-polar": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "monport-40w-co2": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "acrylic" },
  "nubur-n4060": { engraveTime: "~13–19 min", cutTime: "~7–11 min", cutType: "wood" },
  "two-trees-tts-55-pro": { engraveTime: "~12–17 min", cutTime: "~6–9 min", cutType: "wood" },
  "htouroy-40w": { engraveTime: "~14–20 min", cutTime: "~7–10 min", cutType: "wood" },
  "ortur-laser-master-h10": { engraveTime: "~8–12 min", cutTime: "~4–7 min", cutType: "wood" },
  "ortur-aufero-al1": { engraveTime: "~18–28 min", cutTime: "~12–18 min", cutType: "wood" },
  "longer-laser-b1": { engraveTime: "~9–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "atomstack-a20-pro": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "sculpfun-s9": { engraveTime: "~14–22 min", cutTime: "~8–12 min", cutType: "wood" },
  "two-trees-ts2-20w": { engraveTime: "~10–15 min", cutTime: "~5–8 min", cutType: "wood" },
};

export function buildExamples(slug, laserType) {
  const t = BENCHMARK_TIMES[slug] || defaultTimes(laserType);
  const engrave =
    t.engraveType === "metal"
      ? {
          description: BENCHMARK.cutMetalMark.description,
          size: BENCHMARK.cutMetalMark.size,
          time: t.engraveTime,
        }
      : {
          description: BENCHMARK.engrave.description,
          size: BENCHMARK.engrave.size,
          time: t.engraveTime,
        };

  let cut;
  if (t.cutType === "none" || t.cutTime.includes("Not") || t.cutTime.includes("Blade")) {
    cut = {
      description: t.cutTime.includes("Blade") ? "Vinyl cut (blade, not laser)" : "Laser cutting",
      size: t.cutTime.includes("Blade") ? BENCHMARK.cutWood.size : "—",
      time: t.cutTime,
    };
  } else if (t.cutType === "acrylic") {
    cut = {
      description: BENCHMARK.cutAcrylic.description,
      size: BENCHMARK.cutAcrylic.size,
      time: t.cutTime,
    };
  } else {
    cut = {
      description: BENCHMARK.cutWood.description,
      size: BENCHMARK.cutWood.size,
      time: t.cutTime,
    };
  }

  return { engraveExample: engrave, cutExample: cut };
}

function defaultTimes(laserType) {
  if (laserType === "co2") return { engraveTime: "~6–10 min", cutTime: "~3–5 min", cutType: "acrylic" };
  if (laserType === "fiber") return { engraveTime: "~30–60 sec", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" };
  if (laserType === "hybrid") return { engraveTime: "~8–12 min", cutTime: "~4–7 min", cutType: "wood" };
  return { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" };
}
