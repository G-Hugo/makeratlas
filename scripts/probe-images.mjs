import https from "https";
import fs from "fs";
import path from "path";

const PROBES = {
  "sculpfun-s30-ultra": "https://www.sculpfun.com/products/sculpfun-s30-ultra-33w-laser-engraving-and-cutting-machine-lightburn-core-license-key.json",
  "xtool-p2": "https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter.json",
  "xtool-d1-pro": "https://ca.xtool.com/products/xtool-d1-pro-20w-laser-engraver-cutting-machine.json",
  "xtool-s1": "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver-cutter-with-air-purifier.json",
  "xtool-f1-ultra": "https://www.xtool.com/products/xtool-f1-ultra-20w-fiber-diode-dual-laser-engraver.json",
  "creality-falcon2-pro": "https://store.creality.com/products/creality-falcon2-pro-22w-laser-engraver-cutter.json",
  "atomstack-a5-pro": "https://atomstack.com/products/atomstack-a5-pro-40w-laser-engraver.json",
  "laserpecker-4": "https://laserpecker.net/products/laserpecker-4-pro.json",
  "glowforge-aura": "https://glowforge.com/products/aura.json",
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        get(res.headers.location).then(resolve).catch(reject);
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

for (const [slug, url] of Object.entries(PROBES)) {
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      console.log(`✗ ${slug}: HTTP ${status}`);
      continue;
    }
    const data = JSON.parse(body.toString());
    const src = (data.product?.image?.src || data.product?.images?.[0]?.src)?.split("?")[0];
    if (!src) {
      console.log(`✗ ${slug}: no image in JSON`);
      continue;
    }
    const imgBuf = await get(src);
    if (imgBuf.status !== 200) {
      console.log(`✗ ${slug}: image download ${imgBuf.status}`);
      continue;
    }
    const ext = src.includes(".png") ? "png" : "jpg";
    fs.writeFileSync(path.join(imagesDir, `${slug}.${ext}`), imgBuf.body);
    const mp = path.join(machinesDir, `${slug}.json`);
    if (fs.existsSync(mp)) {
      const m = JSON.parse(fs.readFileSync(mp, "utf-8"));
      m.image = `/machines/${slug}.${ext}`;
      fs.writeFileSync(mp, JSON.stringify(m, null, 2) + "\n");
    }
    console.log(`✓ ${slug}`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
