import https from "https";
import fs from "fs";
import path from "path";

/** Direct product image URLs from manufacturer CDNs */
const DIRECT_IMAGES = {
  "xtool-d1-pro":
    "https://cdn.shopify.com/s/files/1/0467/7985/9095/files/mk-baidituyingyong_us_pc_d1pro20w_6738-20923.webp",
  "xtool-s1":
    "https://cdn.shopify.com/s/files/1/0467/7985/9095/files/mk-baidituyingyong_us_pc_s1_20w_6738-20950.webp",
  "sculpfun-icube-pro":
    "https://cdn.shopify.com/s/files/1/0628/0695/0066/files/1_f2e47135-1392-4f90-b9b6-9998e59285cb.jpg",
  "creality-falcon2-pro":
    "https://cdn.shopify.com/s/files/1/0508/3034/4080/files/creality-falcon2-pro-22w-laser-engraver-cutter-1.jpg",
  "laserpecker-4":
    "https://cdn.shopify.com/s/files/1/0569/7420/7637/files/LP4_1.jpg",
  "glowforge-aura":
    "https://cdn.shopify.com/s/files/1/0011/4562/9262/products/Glowforge_Aura_Studio_Profile_1200x1200.png",
  "monport-55w-co2":
    "https://cdn.shopify.com/s/files/1/0565/2003/9290/files/Monport_55W_CO2_Laser_Engraver_Cutter_with_Autofocus.jpg",
  "omtech-40w-co2":
    "https://cdn.shopify.com/s/files/1/0565/2003/9290/files/OMTech_K40_40W_CO2_Laser_Engraver.jpg",
  "wecreat-vision":
    "https://cdn.shopify.com/s/files/1/0800/8938/7050/files/wecreat-vision-1.jpg",
  "algolaser-alpha-mk2":
    "https://cdn.shopify.com/s/files/1/0612/8886/5114/files/Algolaser_Alpha_MK2_1.jpg",
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

const imagesDir = path.join(process.cwd(), "public", "machines");
const machinesDir = path.join(process.cwd(), "content", "machines");

for (const [slug, url] of Object.entries(DIRECT_IMAGES)) {
  const mp = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(mp)) {
    console.log(`skip ${slug} (no json)`);
    continue;
  }
  try {
    const buf = await download(url);
    if (buf.length < 1500) throw new Error("too small");
    const ext = url.includes(".png") ? "png" : url.includes(".webp") ? "webp" : "jpg";
    fs.writeFileSync(path.join(imagesDir, `${slug}.${ext}`), buf);
    const m = JSON.parse(fs.readFileSync(mp, "utf-8"));
    m.image = `/machines/${slug}.${ext}`;
    fs.writeFileSync(mp, JSON.stringify(m, null, 2) + "\n");
    console.log(`✓ ${slug}`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}

// xTool collection fallback for remaining xTool machines
const catalog = await download("https://www.xtool.com/collections/laser-cutter-and-engraver-machine/products.json?limit=50");
const products = JSON.parse(catalog.toString()).products;
const MAP = {
  "xtool-d1-pro": /d1.?pro/i,
  "xtool-s1": /^xTool S1[^a-z]/i,
  "xtool-f2-ultra": /f2.?ultra/i,
  "xtool-m1-ultra": /m1.?ultra/i,
};

for (const [slug, re] of Object.entries(MAP)) {
  const mp = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(mp)) continue;
  const m = JSON.parse(fs.readFileSync(mp, "utf-8"));
  if (/\.(jpg|png|webp)$/.test(m.image || "")) continue;
  const product = products.find((p) => re.test(p.title) && !/module|kit|accessory|feeder/i.test(p.title));
  if (!product?.images?.[0]?.src) {
    console.log(`✗ ${slug}: not in collection`);
    continue;
  }
  try {
    const src = product.images[0].src.split("?")[0];
    const buf = await download(src);
    const ext = src.includes(".webp") ? "webp" : src.includes(".png") ? "png" : "jpg";
    fs.writeFileSync(path.join(imagesDir, `${slug}.${ext}`), buf);
    m.image = `/machines/${slug}.${ext}`;
    fs.writeFileSync(mp, JSON.stringify(m, null, 2) + "\n");
    console.log(`✓ ${slug} (collection)`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
