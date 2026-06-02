import fs from "fs";
import path from "path";
import { STORES } from "./manufacturer-sources.mjs";
import https from "https";

const machinesDir = path.join(process.cwd(), "content", "machines");
const existing = new Set(
  fs
    .readdirSync(machinesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", "")),
);

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
              resolve(JSON.parse(d));
            } catch {
              resolve(null);
            }
          }
        });
      })
      .on("error", reject);
  });
}

const searches = [
  ["xtool", /d1[^-]|m1[^-]|p3|f2[^-]|s1 compact/i],
  ["sculpfun", /s30 pro[^u]|s6 pro|s10 pro|s30 pro max|t1/i],
  ["atomstack", /a20|a24|x20|x30|s20|hurr|p2|m1/i],
  ["ortur", /lm2|aufero l2|h20/i],
  ["longer", /nano duo|b2|ray6/i],
  ["crealityfalcon", /mini|falcon 10|falcon3|ender/i],
  ["monport", /onyx|ga-|reno|k40/i],
  ["omtech", /k40|polar|fc-|fury/i],
  ["laserpecker", /lp2|lp1|laserpecker 2/i],
  ["gweike", /g1|cloud|f1/i],
  ["algolaser", /delta|diy|omega|jpt/i],
  ["foxalien", /reizer|reisler|masuter.*laser|20w laser/i],
  ["wecreat", /get|makeit/i],
  ["acmer", /s3|m1|laser pecker/i],
];

for (const [store, pat] of searches) {
  const base = STORES[store];
  if (!base) continue;
  const data = await get(`${base}/collections/all/products.json?limit=250`);
  const products = data?.products || [];
  const hits = products.filter(
    (p) =>
      pat.test(`${p.title} ${p.handle}`) &&
      !/module|kit|refurb|accessory|feeder|belt|tube|lens|board|filter|paper|mat|course|warranty|replacement|part|spare|honeycomb|chiller|pump|extractor|extension|rotary only|air assist|purifier|enclosure only|cover|plate|gift|bundle only/i.test(
        p.title,
      ),
  );
  if (!hits.length) continue;
  console.log(`\n=== ${store} ===`);
  for (const p of hits.slice(0, 12)) {
    const slugGuess = p.handle.slice(0, 40);
    const exists = [...existing].some((s) => p.handle.includes(s) || s.includes(p.handle.split("-")[0]));
    console.log(exists ? "  [have?]" : "  +", p.handle);
    console.log("      ", p.title.slice(0, 65));
  }
}
