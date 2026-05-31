import https from "https";
import fs from "fs";
import path from "path";

const MORE = {
  "xtool-d1-pro": [
    "https://www.xtool.com/products/xtool-d1-pro-20w-laser-engraver-and-cutter.json",
    "https://www.xtool.com/products/d1-pro-20w-laser-engraver.json",
    "https://us.xtool.com/products/xtool-d1-pro-20w.json",
  ],
  "xtool-s1": [
    "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver-cutter-with-air-purifier.json",
    "https://www.xtool.com/products/xtool-s1-enclosed-laser-engraver.json",
  ],
  "xtool-f2-ultra": ["https://www.xtool.com/products/xtool-f2-ultra-20w-fiber-diode-dual-laser-engraver.json"],
  "xtool-m1-ultra": ["https://www.xtool.com/products/xtool-m1-ultra-laser-blade-cutter.json"],
  "creality-falcon2-pro": [
    "https://store.creality.com/products/creality-falcon2-pro-22w-laser-engraver-and-cutter-machine.json",
    "https://store.creality.com/products/falcon2-pro-22w-laser-engraver-cutter.json",
  ],
  "creality-falcon2-12w": ["https://store.creality.com/products/creality-falcon2-12w-laser-engraver-cutter.json"],
  "laserpecker-4": [
    "https://laserpecker.net/products/laserpecker-4.json",
    "https://www.laserpecker.net/products/laserpecker-4-pro-portable-laser-engraver.json",
  ],
  "atomstack-a5-pro": ["https://atomstack.com/products/a5-pro.json"],
  "atomstack-a40-pro": ["https://atomstack.com/products/a40-pro-laser-engraver.json"],
  "longer-ray5": ["https://longer3d.com/products/longer-ray5-20w-laser-engraver-cutter.json"],
  "wecreat-vision": ["https://wecreat.com/products/wecreat-vision-enclosed-laser-engraver-cutter.json"],
  "glowforge-aura": ["https://glowforge.com/products/glowforge-aura-co2-laser-cutter.json"],
  "sculpfun-icube-pro": ["https://www.sculpfun.com/products/sculpfun-icube-pro-20w-laser-engraver.json"],
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        get(res.headers.location.startsWith("http") ? res.headers.location : new URL(res.headers.location, url).href)
          .then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

const imagesDir = path.join(process.cwd(), "public", "machines");
const machinesDir = path.join(process.cwd(), "content", "machines");

for (const [slug, urls] of Object.entries(MORE)) {
  const mp = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(mp)) continue;
  const m = JSON.parse(fs.readFileSync(mp, "utf-8"));
  if (/\.(jpg|png|webp)$/.test(m.image || "")) {
    console.log(`skip ${slug}`);
    continue;
  }
  let done = false;
  for (const url of urls) {
    try {
      const { status, body } = await get(url);
      if (status !== 200) continue;
      const data = JSON.parse(body.toString());
      const src = (data.product?.image?.src || data.product?.images?.[0]?.src)?.split("?")[0];
      if (!src) continue;
      const img = await get(src);
      if (img.status !== 200 || img.body.length < 2000) continue;
      const ext = src.includes(".png") ? "png" : "jpg";
      fs.writeFileSync(path.join(imagesDir, `${slug}.${ext}`), img.body);
      m.image = `/machines/${slug}.${ext}`;
      fs.writeFileSync(mp, JSON.stringify(m, null, 2) + "\n");
      console.log(`✓ ${slug}`);
      done = true;
      break;
    } catch { /* try next */ }
  }
  if (!done) console.log(`✗ ${slug}`);
}
