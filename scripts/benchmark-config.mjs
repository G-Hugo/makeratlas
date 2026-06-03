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
  "xtool-s1-10w": { engraveTime: "~14–21 min", cutTime: "~7–12 min", cutType: "wood" },
  "xtool-s1-20w": { engraveTime: "~9–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "xtool-s1-40w": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "wood" },
  "xtool-f1-ultra": { engraveTime: "~3–6 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "xtool-f2-ultra": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "xtool-m1-ultra": { engraveTime: "~10–14 min", cutTime: "Blade only (~2 min vinyl)", cutType: "none" },
  "ortur-laser-master-3-10w": { engraveTime: "~15–23 min", cutTime: "~8–12 min", cutType: "wood" },
  "ortur-laser-master-3-20w": { engraveTime: "~10–15 min", cutTime: "~5–8 min", cutType: "wood" },
  "sculpfun-s30-ultra-10w": { engraveTime: "~11–18 min", cutTime: "~7–11 min", cutType: "wood" },
  "sculpfun-s30-ultra-20w": { engraveTime: "~7–12 min", cutTime: "~4–7 min", cutType: "wood" },
  "sculpfun-s30-ultra-22w": { engraveTime: "~7–11 min", cutTime: "~4–7 min", cutType: "wood" },
  "sculpfun-icube-pro": { engraveTime: "~9–13 min", cutTime: "~5–7 min", cutType: "wood" },
  "atomstack-a5-pro": { engraveTime: "~14–20 min", cutTime: "~7–11 min", cutType: "wood" },
  "atomstack-a40-pro": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "glowforge-aura": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "wood" },
  "glowforge-pro": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "omtech-40w-co2": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "omtech-80w-co2": { engraveTime: "~4–6 min", cutTime: "~1–3 min", cutType: "acrylic" },
  "monport-55w-co2": { engraveTime: "~4–7 min", cutTime: "~2–3 min", cutType: "acrylic" },
  "creality-falcon2-pro": { engraveTime: "~8–12 min", cutTime: "~5–8 min", cutType: "wood" },
  "creality-falcon2-12w": { engraveTime: "~17–26 min", cutTime: "~9–15 min", cutType: "wood" },
  "longer-ray5": { engraveTime: "~12–18 min", cutTime: "~7–10 min", cutType: "wood" },
  "laserpecker-4": { engraveTime: "~18–25 min", cutTime: "Not a cutter", cutType: "none" },
  "wecreat-vision": { engraveTime: "~9–14 min", cutTime: "~5–7 min", cutType: "wood" },
  "twotrees-tts-55": { engraveTime: "~16–24 min", cutTime: "~9–14 min", cutType: "wood" },
  "acmer-p3": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "algolaser-alpha-mk2": { engraveTime: "~7–11 min", cutTime: "~4–7 min", cutType: "wood" },
  "algolaser-alpha-mk2-10w": { engraveTime: "~14–21 min", cutTime: "~7–14 min", cutType: "wood" },
  "algolaser-alpha-mk2-20w": { engraveTime: "~9–14 min", cutTime: "~5–9 min", cutType: "wood" },
  "algolaser-alpha-mk2-40w": { engraveTime: "~6–9 min", cutTime: "~3–6 min", cutType: "wood" },
  "xtool-d1-pro-40w": { engraveTime: "~7–10 min", cutTime: "~4–6 min", cutType: "wood" },
  "hawk-20": { engraveTime: "~11–16 min", cutTime: "~5–8 min", cutType: "wood" },
  // New machines
  "xtool-p2s": { engraveTime: "~3–5 min", cutTime: "~1–2 min", cutType: "acrylic" },
  "xtool-f1": { engraveTime: "~4–8 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "gweike-cloud-pro": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "foxaliens-reisler-2": { engraveTime: "~9–13 min", cutTime: "~5–7 min", cutType: "wood" },
  "comgrow-z1": { engraveTime: "~11–16 min", cutTime: "~6–9 min", cutType: "wood" },
  "atezr-p2": { engraveTime: "~8–12 min", cutTime: "~5–8 min", cutType: "wood" },
  "laserpecker-5": { engraveTime: "~3–6 min", cutTime: "~15–22 min", cutType: "wood", engraveType: "metal" },
  "omtech-polar": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "acrylic" },
  "monport-40w-co2": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "acrylic" },
  "nubur-n4060": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "two-trees-tts-55-pro": { engraveTime: "~12–17 min", cutTime: "~6–9 min", cutType: "wood" },
  "htouroy-40w": { engraveTime: "~14–20 min", cutTime: "~7–10 min", cutType: "wood" },
  "ortur-laser-master-h10": { engraveTime: "~8–12 min", cutTime: "~4–7 min", cutType: "wood" },
  "ortur-aufero-al1": { engraveTime: "~18–28 min", cutTime: "~12–18 min", cutType: "wood" },
  "longer-laser-b1": { engraveTime: "~9–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "atomstack-a20-pro": { engraveTime: "~10–14 min", cutTime: "~5–8 min", cutType: "wood" },
  "sculpfun-s9": { engraveTime: "~14–22 min", cutTime: "~8–12 min", cutType: "wood" },
  "two-trees-ts2-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "commarker-b4-20w": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "commarker-b6-mopa-30w": { engraveTime: "~2–4 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "gweike-g2-20w": { engraveTime: "~4–9 min", cutTime: "Not a cutter", cutType: "none" },
  "gweike-g6-split-30w": { engraveTime: "~4–11 min", cutTime: "Not a cutter", cutType: "none" },
  "monport-gt-30w-fiber": { engraveTime: "~4–11 min", cutTime: "Not a cutter", cutType: "none" },
  "omtech-fc105-fiber": { engraveTime: "N/A", cutTime: "Production sheet cut", cutType: "none", engraveType: "metal" },
  "commarker-omni-x-uv": { engraveTime: "~6–12 min", cutTime: "Not a cutter", cutType: "none" },
  "commarker-omni-1-uv": { engraveTime: "~8–14 min", cutTime: "Not a cutter", cutType: "none" },
  "commarker-omni-xe-uv": { engraveTime: "~6–12 min", cutTime: "Not a cutter", cutType: "none" },
  "xtool-m2": { engraveTime: "~10–14 min", cutTime: "~6–9 min", cutType: "wood" },
  "xtool-f2": { engraveTime: "~3–6 min", cutTime: "~8–12 min", cutType: "wood", engraveType: "metal" },
  "creality-falcon-t1": { engraveTime: "~3–6 min", cutTime: "~6–10 min", cutType: "wood", engraveType: "metal" },
  "creality-falcon-t1-40w": { engraveTime: "~2–4 min", cutTime: "~4–7 min", cutType: "wood" },
  "creality-falcon-t1-20w-fiber": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "creality-falcon-t1-60w-mopa": { engraveTime: "~1–3 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "creality-falcon-t1-5w-uv": { engraveTime: "~5–10 min", cutTime: "Not a cutter", cutType: "none" },
  "sculpfun-s40-max-48w": { engraveTime: "~6–9 min", cutTime: "~3–5 min", cutType: "wood" },
  "sculpfun-s70-max-70w": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "wood" },
  "atomstack-a70-max": { engraveTime: "~5–8 min", cutTime: "~2–4 min", cutType: "wood" },
  "sculpfun-s10-10w": { engraveTime: "~12–18 min", cutTime: "~7–11 min", cutType: "wood" },
  "xtool-p3": { engraveTime: "~3–5 min", cutTime: "~1–2 min", cutType: "acrylic" },
  "xtool-p3-5w-ir": { engraveTime: "~4–8 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" },
  "acmer-p1-10w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "acmer-p1-20w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "acmer-p2-20w": { engraveTime: "~16–25 min", cutTime: "~8–14 min", cutType: "wood" },
  "acmer-p2-33w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "acmer-s2-pro-36w": { engraveTime: "~14–22 min", cutTime: "~7–12 min", cutType: "wood" },
  "acmer-s2-pro-48w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "atomstack-a40-pro-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "atomstack-a40-pro-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "atomstack-a5-pro-10w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "atomstack-a5-pro-20w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "atomstack-a5-pro-5w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "comgrow-z1-10w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "comgrow-z1-20w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "comgrow-z1-5w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "creality-falcon-a1-10w": { engraveTime: "~12–18 min", cutTime: "~6–11 min", cutType: "wood" },
  "creality-falcon-a1-pro-20w": { engraveTime: "~8–12 min", cutTime: "~4–7 min", cutType: "wood" },
  "creality-falcon2-22w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "creality-falcon2-pro-22w": { engraveTime: "~17–26 min", cutTime: "~9–14 min", cutType: "wood" },
  "creality-falcon2-pro-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "gweike-g2-30w": { engraveTime: "~3–7 min", cutTime: "Not a cutter", cutType: "none" },
  "gweike-g2-50w": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none" },
  "gweike-g6-split-100w": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none" },
  "gweike-g6-split-50w": { engraveTime: "~3–8 min", cutTime: "Not a cutter", cutType: "none" },
  "gweike-g6-split-70w": { engraveTime: "~2–6 min", cutTime: "Not a cutter", cutType: "none" },
  "longer-laser-b1-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "longer-laser-b1-30w": { engraveTime: "~14–22 min", cutTime: "~7–12 min", cutType: "wood" },
  "longer-laser-b1-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "longer-nano-6w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "longer-nano-pro-12w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "longer-ray5-10w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "longer-ray5-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "longer-ray5-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "longer-ray5-5w": { engraveTime: "~44–65 min", cutTime: "~22–36 min", cutType: "wood" },
  "monport-gt-100w-fiber": { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none" },
  "monport-gt-50w-fiber": { engraveTime: "~3–8 min", cutTime: "Not a cutter", cutType: "none" },
  "monport-gt-60w-fiber": { engraveTime: "~3–7 min", cutTime: "Not a cutter", cutType: "none" },
  "nubur-n4060-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "nubur-n4060-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "ortur-h20-10w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "ortur-h20-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "ortur-h20-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "ortur-laser-master-h10-10w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "ortur-laser-master-h10-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "ortur-laser-master-h10-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "ortur-lm2-s2-10w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "ortur-lm2-s2-5w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "sculpfun-icube-pro-10w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "sculpfun-icube-pro-5w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "sculpfun-s9-10w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "sculpfun-s9-5w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "two-trees-ts2-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "two-trees-tts-55-pro-10w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "two-trees-tts-55-pro-20w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "twotrees-tts-55-10w": { engraveTime: "~28–43 min", cutTime: "~14–24 min", cutType: "wood" },
  "twotrees-tts-55-20w": { engraveTime: "~18–28 min", cutTime: "~9–15 min", cutType: "wood" },
  "twotrees-tts-55-40w": { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" },
  "xtool-d1-pro-10w": { engraveTime: "~17–24 min", cutTime: "~9–14 min", cutType: "wood" },
  "xtool-d1-pro-20w": { engraveTime: "~11–15 min", cutTime: "~6–9 min", cutType: "wood" },
  "xtool-d1-pro-5w": { engraveTime: "~25–36 min", cutTime: "~15–22 min", cutType: "wood" },
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
  if (laserType === "fiber") return { engraveTime: "~2–5 min", cutTime: "Not a cutter", cutType: "none", engraveType: "metal" };
  if (laserType === "uv") return { engraveTime: "~6–12 min", cutTime: "Not a cutter", cutType: "none" };
  if (laserType === "hybrid") return { engraveTime: "~8–12 min", cutTime: "~4–7 min", cutType: "wood" };
  return { engraveTime: "~12–18 min", cutTime: "~6–10 min", cutType: "wood" };
}
