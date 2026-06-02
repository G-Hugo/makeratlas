import { STORES } from "./manufacturer-sources.mjs";
import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          if (res.statusCode !== 200) resolve(null);
          else {
            try {
              resolve(JSON.parse(d).product);
            } catch {
              resolve(null);
            }
          }
        });
      })
      .on("error", reject);
  });
}

const handles = [
  ["sculpfun", "sculpfun-s30-pro-max-laser-engraver-machine"],
  ["atomstack", "atomstack-a24-pro"],
  ["atomstack", "atomstack-a24-ultra"],
  ["atomstack", "atomstack-x30-pro-160w-6-core-laser-engraving-and-cutting-machine"],
  ["atomstack", "atomstack-ace-pro-v2"],
  ["crealityfalcon", "low-wattage-laser-engraver-cutter-cr-falcon-10w-machine"],
  ["longer", "longer-nano-duo-ai-laser-engraver"],
  ["laserpecker", "laserpecker-lp2-plus-10w-diode-laser-engraver"],
  ["laserpecker", "laserpecker-lp1-pro-pocket-diode-laser-engraver"],
  ["algolaser", "algolaser-delta-22w-diode-laser-engraver"],
  ["foxalien", "foxalien-reizer-40w-laser-engraver"],
  ["foxalien", "foxalien-laser-engraving-machine-le-4040-pro-20w-laser"],
  ["omtech", "fc-105sa-fiber-laser-cutting-machine"],
  ["omtech", "fc-44-intelli-fiber-laser-cutting-machine"],
  [
    "monport",
    "bundle-sale-monport-reno45-pro-vision-45w-desktop-co2-laser-engraver-cutter-16-x-12-with-8mp-hd-camera-and-magnetic-assisted-autofocus",
  ],
  ["monport", "bundle-sale-monport-ga-100w-mopa-fiber-laser-engraver"],
  ["xtool", "xtool-p3-55w-co2-laser-cutter"],
  ["xtool", "xtool-d1-10w-laser-engraver"],
  ["xtool", "xtool-m1-10w-laser-blade-cutter"],
  ["gweike", "gweike-cloud-55w-co2-laser-cutter-engraver-with-rotary"],
  ["ortur", "laser-master-2-pro"],
  ["sculpfun", "sculpfun-s30-pro-20w-laser-engraver"],
  ["atomstack", "atomstack-a20-pro-1064nm"],
];

for (const [store, handle] of handles) {
  const p = await get(`${STORES[store]}/products/${handle}.json`);
  if (p) console.log("OK", handle, p.title?.slice(0, 50));
  else console.log("NO", handle);
}
