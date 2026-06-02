import { STORES } from "./manufacturer-sources.mjs";
import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            resolve({ ok: false, status: res.statusCode });
            return;
          }
          try {
            resolve({ ok: true, product: JSON.parse(d).product });
          } catch {
            resolve({ ok: false });
          }
        });
      })
      .on("error", reject);
  });
}

const handles = [
  ["ortur", "ortur-h20-laser-engraver-cutter-machine"],
  ["sculpfun", "sculpfun-s10-20w-laser-engraver"],
  ["sculpfun", "sculpfun-s10-pro-20w-laser-engraving-machine"],
  ["sculpfun", "sculpfun-s6-pro-laser-engraver"],
  ["atomstack", "atomstack-hurricane-55w-laser-engraver"],
  ["atomstack", "atomstack-p1-dual-laser-engraver"],
  ["atomstack", "atomstack-p1-5w-laser-engraver"],
  ["crealityfalcon", "falcon-a1-10w-laser-engraver"],
  ["crealityfalcon", "falcon-a1-laser-engraver-and-cutter"],
  ["acmer", "acmer-s2-24w-laser-engraver"],
  ["acmer", "acmer-p2-24w-laser-engraver"],
  ["acmer", "acmer-p1-10w-diode-laser-engraver"],
  ["laserpecker", "laserpecker-3"],
  ["laserpecker", "laserpecker-lp3-portable-laser-engraver"],
  ["algolaser", "algolaser-diy-kit-mk2"],
  ["algolaser", "diy-kit-mk2-10w-smart-enclosed-diode-laser-engraver"],
  ["longer", "longer-nano-pro-12w-laser-engraver"],
  ["longer", "longer-nano-6w-laser-engraver"],
  ["wecreat", "wecreat-get-20w-laser-engraver"],
  ["foxalien", "masuter-3-20w-laser-engraver"],
];

for (const [store, handle] of handles) {
  const base = STORES[store];
  if (!base) {
    console.log("no store", store);
    continue;
  }
  const r = await get(`${base}/products/${handle}.json`);
  if (!r.ok) {
    console.log("✗", store, handle);
    continue;
  }
  const img = r.product.images?.[0]?.src?.split("?")[0].replace(/.*\/files\//, "files/");
  console.log("✓", handle, "|", r.product.title?.slice(0, 55), "|", img);
}
