/**
 * Discover and download product images from Shopify .json endpoints
 */
import https from "https";
import fs from "fs";
import path from "path";

const SHOPIFY = {
  "xtool-d1-pro": [
    "https://www.xtool.com/products/xtool-d1-pro-20w-laser-engraver.json",
    "https://www.xtool.com/products/xtool-d1-pro.json",
    "https://ca.xtool.com/products/xtool-d1-pro-20w.json",
  ],
  "xtool-s1": [
    "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver.json",
    "https://www.xtool.com/products/xtool-s1.json",
  ],
  "xtool-f1-ultra": [
    "https://www.xtool.com/products/xtool-f1-ultra-portable-laser-engraver.json",
    "https://www.xtool.com/products/xtool-f1-ultra.json",
  ],
  "xtool-f2-ultra": ["https://www.xtool.com/products/xtool-f2-ultra.json"],
  "xtool-m1-ultra": ["https://www.xtool.com/products/xtool-m1-ultra.json"],
  "glowforge-aura": ["https://glowforge.com/products/glowforge-aura.json"],
  "sculpfun-s30-ultra": [
    "https://sculpfun.com/products/sculpfun-s30-pro-ultra.json",
    "https://www.sculpfun.com/products/sculpfun-s30-ultra-20w.json",
  ],
  "laserpecker-4": [
    "https://laserpecker.net/products/laserpecker-4.json",
    "https://www.laserpecker.net/products/laserpecker-4-pro.json",
  ],
  "creality-falcon2-pro": [
    "https://store.creality.com/products/creality-falcon2-pro-22w.json",
    "https://www.creality.com/products/creality-falcon2-pro-laser-engraver.json",
  ],
  "atomstack-a5-pro": [
    "https://atomstack.com/products/atomstack-a5-pro.json",
    "https://www.atomstack.com/products/a5-pro-40w-laser-engraver.json",
  ],
  "longer-ray5": ["https://longer3d.com/products/longer-ray5.json"],
  "wecreat-vision": ["https://wecreat.com/products/wecreat-vision-enclosed-laser-engraver.json"],
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

async function findImage(urls) {
  for (const url of urls) {
    try {
      const { status, body } = await get(url);
      if (status !== 200) continue;
      const data = JSON.parse(body.toString());
      const src = data.product?.image?.src || data.product?.images?.[0]?.src;
      if (src) return src.split("?")[0];
    } catch { /* next */ }
  }
  return null;
}

async function download(url, dest) {
  const { status, body } = await get(url);
  if (status !== 200 || body.length < 2000) return false;
  fs.writeFileSync(dest, body);
  return true;
}

const imagesDir = path.join(process.cwd(), "public", "machines");
const machinesDir = path.join(process.cwd(), "content", "machines");

for (const [slug, urls] of Object.entries(SHOPIFY)) {
  const img = await findImage(urls);
  if (!img) {
    console.log(`✗ ${slug}: no image found`);
    continue;
  }
  const ext = img.includes(".png") ? "png" : "jpg";
  const dest = path.join(imagesDir, `${slug}.${ext}`);
  const ok = await download(img, dest);
  if (!ok) {
    console.log(`✗ ${slug}: download failed`);
    continue;
  }
  const machinePath = path.join(machinesDir, `${slug}.json`);
  if (fs.existsSync(machinePath)) {
    const m = JSON.parse(fs.readFileSync(machinePath, "utf-8"));
    m.image = `/machines/${slug}.${ext}`;
    fs.writeFileSync(machinePath, JSON.stringify(m, null, 2) + "\n");
  }
  console.log(`✓ ${slug}`);
}
