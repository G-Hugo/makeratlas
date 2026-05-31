/**
 * Updates performance schema: friendly time examples + technical in pro section.
 * Downloads product photos from manufacturer Shopify stores where available.
 *
 * Run: node scripts/update-performance-and-images.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const machinesDir = path.join(process.cwd(), "content", "machines");
const imagesDir = path.join(process.cwd(), "public", "machines");

/** Friendly examples + technical specs per slug */
const DATA = {
  "xtool-d1-pro": {
    engraveExample: { description: "Photo engrave on birch plywood", size: "10 × 10 cm (4 × 4 in)", time: "~8–12 min" },
    cutExample: { description: "Cut a name sign from basswood", size: "15 × 8 cm, 3 mm thick", time: "~3–5 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "400 mm/s", avgEngraveSpeed: "80–180 mm/s fill", avgCutSpeed: "4–12 mm/s on 3 mm wood" },
    shopify: "https://www.xtool.com/products/xtool-d1-pro-20w.json",
  },
  "xtool-p2": {
    engraveExample: { description: "Logo fill on acrylic", size: "12 × 12 cm", time: "~4–6 min" },
    cutExample: { description: "Cut acrylic keychain shapes", size: "10 × 10 cm, 3 mm clear acrylic", time: "~2–4 min" },
    technical: { spotSize: "~0.15 mm CO₂ spot", maxSpeed: "600 mm/s", avgEngraveSpeed: "150–300 mm/s fill", avgCutSpeed: "15–40 mm/s on 3 mm acrylic" },
    shopify: "https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter.json",
  },
  "xtool-f1-ultra": {
    engraveExample: { description: "Logo on stainless steel tag", size: "3 × 2 cm", time: "~20–40 sec" },
    cutExample: { description: "Not a cutting machine", size: "—", time: "Use a diode or CO₂ for cuts" },
    technical: { spotSize: "~0.02 mm fiber spot", maxSpeed: "15,000 mm/s", avgEngraveSpeed: "500–2,000 mm/s marking", avgCutSpeed: "N/A" },
    shopify: "https://www.xtool.com/products/xtool-f1-ultra-20w-fiber-diode-dual-laser.json",
  },
  "xtool-f2-ultra": {
    engraveExample: { description: "Batch mark aluminum tags", size: "3 × 2 cm each", time: "~15–30 sec each" },
    cutExample: { description: "Not designed for cutting", size: "—", time: "Diode module: thin wood only" },
    technical: { spotSize: "~0.02 mm fiber spot", maxSpeed: "18,000 mm/s", avgEngraveSpeed: "800–3,000 mm/s marking", avgCutSpeed: "N/A" },
    shopify: "https://www.xtool.com/products/xtool-f2-ultra.json",
  },
  "xtool-s1": {
    engraveExample: { description: "Photo on wood coaster", size: "10 × 10 cm", time: "~8–12 min" },
    cutExample: { description: "Cut basswood ornament", size: "8 × 8 cm, 3 mm thick", time: "~3–5 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "400 mm/s", avgEngraveSpeed: "80–180 mm/s fill", avgCutSpeed: "4–12 mm/s on 3 mm wood" },
    shopify: "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver.json",
  },
  "xtool-m1-ultra": {
    engraveExample: { description: "Name on leather patch", size: "8 × 3 cm", time: "~1–2 min" },
    cutExample: { description: "Vinyl sticker sheet (blade)", size: "A5 sheet", time: "~2–4 min" },
    technical: { spotSize: "~0.08 mm laser spot", maxSpeed: "400 mm/s laser", avgEngraveSpeed: "60–120 mm/s fill", avgCutSpeed: "Blade 30–80 mm/s · Laser 3–8 mm/s" },
    shopify: "https://www.xtool.com/products/xtool-m1-ultra.json",
  },
  "ortur-laser-master-3": {
    engraveExample: { description: "Text + logo on birch", size: "10 × 10 cm", time: "~10–15 min" },
    cutExample: { description: "Cut simple wood shape", size: "12 × 12 cm, 3 mm basswood", time: "~4–7 min" },
    technical: { spotSize: "~0.1 mm spot", maxSpeed: "333 mm/s", avgEngraveSpeed: "70–150 mm/s fill", avgCutSpeed: "3–10 mm/s on 3 mm wood" },
    imageUrl: "https://ortur.net/cdn/shop/files/LM3-20W_1.jpg?v=1700000000",
  },
  "sculpfun-s30-ultra": {
    engraveExample: { description: "Detailed line art on wood", size: "10 × 10 cm", time: "~8–14 min" },
    cutExample: { description: "Cut 5 mm basswood piece", size: "10 × 10 cm", time: "~6–10 min (multi-pass)" },
    technical: { spotSize: "~0.08 mm compressed beam", maxSpeed: "167 mm/s", avgEngraveSpeed: "80–160 mm/s fill", avgCutSpeed: "5–14 mm/s on 3–6 mm wood" },
  },
  "atomstack-a5-pro": {
    engraveExample: { description: "Simple text on wood", size: "8 × 8 cm", time: "~12–18 min" },
    cutExample: { description: "Cut thin plywood shape", size: "8 × 8 cm, 2 mm thick", time: "~5–8 min" },
    technical: { spotSize: "~0.1 mm spot", maxSpeed: "200 mm/s", avgEngraveSpeed: "50–120 mm/s fill", avgCutSpeed: "2–6 mm/s on 2–3 mm wood" },
  },
  "atomstack-a40-pro": {
    engraveExample: { description: "Gift box lid design", size: "10 × 10 cm", time: "~10–15 min" },
    cutExample: { description: "Cut basswood coaster blank", size: "10 × 10 cm, 4 mm", time: "~5–9 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "250 mm/s", avgEngraveSpeed: "60–140 mm/s fill", avgCutSpeed: "4–10 mm/s on 3–5 mm wood" },
  },
  "glowforge-aura": {
    engraveExample: { description: "Engrave leather wallet", size: "10 × 6 cm", time: "~5–8 min" },
    cutExample: { description: "Cut plywood earring shapes", size: "8 × 8 cm, 3 mm", time: "~3–5 min" },
    technical: { spotSize: "~0.2 mm CO₂ spot", maxSpeed: "300 mm/s", avgEngraveSpeed: "100–200 mm/s fill", avgCutSpeed: "8–20 mm/s on 3 mm plywood" },
    shopify: "https://glowforge.com/products/glowforge-aura.json",
  },
  "glowforge-pro": {
    engraveExample: { description: "Engrave long wooden sign", size: "40 × 8 cm (passthrough)", time: "~12–18 min" },
    cutExample: { description: "Cut acrylic display stand", size: "15 × 10 cm, 5 mm", time: "~4–7 min" },
    technical: { spotSize: "~0.18 mm CO₂ spot", maxSpeed: "400 mm/s", avgEngraveSpeed: "120–250 mm/s fill", avgCutSpeed: "12–35 mm/s on 3 mm acrylic" },
  },
  "omtech-40w-co2": {
    engraveExample: { description: "Logo on wood plaque", size: "15 × 10 cm", time: "~5–8 min" },
    cutExample: { description: "Cut acrylic sign blank", size: "20 × 15 cm, 3 mm", time: "~3–6 min" },
    technical: { spotSize: "~0.2 mm CO₂ spot", maxSpeed: "400 mm/s", avgEngraveSpeed: "120–250 mm/s fill", avgCutSpeed: "10–30 mm/s on 3 mm acrylic" },
  },
  "omtech-80w-co2": {
    engraveExample: { description: "Large wood panel engraving", size: "30 × 20 cm", time: "~8–12 min" },
    cutExample: { description: "Cut thick acrylic sheet", size: "25 × 15 cm, 6 mm", time: "~4–8 min" },
    technical: { spotSize: "~0.15 mm CO₂ spot", maxSpeed: "600 mm/s", avgEngraveSpeed: "180–350 mm/s fill", avgCutSpeed: "20–55 mm/s on 6 mm acrylic" },
  },
  "monport-55w-co2": {
    engraveExample: { description: "Shop sign on plywood", size: "20 × 15 cm", time: "~6–10 min" },
    cutExample: { description: "Cut acrylic product display", size: "20 × 12 cm, 4 mm", time: "~3–5 min" },
    technical: { spotSize: "~0.15 mm CO₂ spot", maxSpeed: "500 mm/s", avgEngraveSpeed: "150–300 mm/s fill", avgCutSpeed: "15–45 mm/s on 3 mm acrylic" },
  },
  "creality-falcon2-pro": {
    engraveExample: { description: "Photo on wood slice", size: "10 × 10 cm", time: "~8–14 min" },
    cutExample: { description: "Cut basswood puzzle piece", size: "12 × 12 cm, 5 mm", time: "~6–10 min" },
    technical: { spotSize: "~0.06 mm compressed spot", maxSpeed: "417 mm/s", avgEngraveSpeed: "90–180 mm/s fill", avgCutSpeed: "6–15 mm/s on 3–6 mm wood" },
  },
  "creality-falcon2-12w": {
    engraveExample: { description: "Name on bamboo cutting board", size: "10 × 5 cm", time: "~10–15 min" },
    cutExample: { description: "Cut thin plywood shape", size: "8 × 8 cm, 2 mm", time: "~6–10 min" },
    technical: { spotSize: "~0.1 mm spot", maxSpeed: "300 mm/s", avgEngraveSpeed: "65–140 mm/s fill", avgCutSpeed: "3–8 mm/s on 2–4 mm wood" },
  },
  "longer-ray5": {
    engraveExample: { description: "Coaster text engraving", size: "8 × 8 cm", time: "~12–18 min" },
    cutExample: { description: "Cut small felt shape", size: "6 × 6 cm", time: "~2–4 min" },
    technical: { spotSize: "~0.1 mm spot", maxSpeed: "200 mm/s", avgEngraveSpeed: "60–130 mm/s fill", avgCutSpeed: "3–8 mm/s on 2–4 mm wood" },
  },
  "laserpecker-4": {
    engraveExample: { description: "Logo on metal card", size: "5 × 3 cm", time: "~1–3 min" },
    cutExample: { description: "Not for cutting", size: "—", time: "Engraving-only portable" },
    technical: { spotSize: "~0.12 mm portable spot", maxSpeed: "200 mm/s", avgEngraveSpeed: "30–80 mm/s", avgCutSpeed: "N/A" },
  },
  "wecreat-vision": {
    engraveExample: { description: "Photo on wood gift box", size: "10 × 10 cm", time: "~9–14 min" },
    cutExample: { description: "Cut basswood tag", size: "8 × 5 cm, 3 mm", time: "~4–6 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "350 mm/s", avgEngraveSpeed: "75–160 mm/s fill", avgCutSpeed: "4–10 mm/s on 3 mm wood" },
  },
  "twotrees-tts-55": {
    engraveExample: { description: "Simple text on plywood", size: "8 × 8 cm", time: "~15–22 min" },
    cutExample: { description: "Cut thin basswood piece", size: "6 × 6 cm, 2 mm", time: "~6–10 min" },
    technical: { spotSize: "~0.1 mm spot", maxSpeed: "200 mm/s", avgEngraveSpeed: "45–110 mm/s fill", avgCutSpeed: "2–5 mm/s on 2–3 mm wood" },
  },
  "acmer-p3": {
    engraveExample: { description: "Family photo on wood", size: "10 × 10 cm", time: "~10–15 min" },
    cutExample: { description: "Cut ornament from basswood", size: "10 × 10 cm, 3 mm", time: "~4–7 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "350 mm/s", avgEngraveSpeed: "70–150 mm/s fill", avgCutSpeed: "4–11 mm/s on 3 mm wood" },
  },
  "algolaser-alpha-mk2": {
    engraveExample: { description: "Fine detail line art", size: "10 × 10 cm", time: "~7–12 min" },
    cutExample: { description: "Cut basswood sign", size: "12 × 8 cm, 4 mm", time: "~5–8 min" },
    technical: { spotSize: "~0.06 mm compressed spot", maxSpeed: "400 mm/s", avgEngraveSpeed: "90–200 mm/s fill", avgCutSpeed: "5–13 mm/s on 3–6 mm wood" },
  },
  "sculpfun-icube-pro": {
    engraveExample: { description: "Keychain text on wood", size: "6 × 3 cm", time: "~2–4 min" },
    cutExample: { description: "Cut small leather patch", size: "5 × 5 cm", time: "~2–3 min" },
    technical: { spotSize: "~0.08 mm spot", maxSpeed: "300 mm/s", avgEngraveSpeed: "75–160 mm/s fill", avgCutSpeed: "4–12 mm/s on 3 mm wood" },
  },
  "hawk-20": {
    engraveExample: { description: "Logo on birch plywood", size: "10 × 10 cm", time: "~11–16 min" },
    cutExample: { description: "Cut wood gift tag", size: "8 × 5 cm, 3 mm", time: "~4–7 min" },
    technical: { spotSize: "~0.09 mm spot", maxSpeed: "350 mm/s", avgEngraveSpeed: "70–150 mm/s fill", avgCutSpeed: "4–11 mm/s on 3 mm wood" },
  },
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "MakerAtlas/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchUrl(res.headers.location).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function getShopifyImage(shopifyUrl) {
  try {
    const buf = await fetchUrl(shopifyUrl);
    const data = JSON.parse(buf.toString());
    const img = data.product?.image?.src || data.product?.images?.[0]?.src;
    return img?.split("?")[0] || null;
  } catch {
    return null;
  }
}

async function downloadImage(url, destPath) {
  try {
    const buf = await fetchUrl(url);
    if (buf.length < 1000) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

function formatExample(ex) {
  if (ex.time.startsWith("Not") || ex.time.startsWith("Use") || ex.time.startsWith("Engraving") || ex.time.startsWith("N/A") || ex.time.startsWith("—") || ex.size === "—") {
    return ex.time;
  }
  return `${ex.time} · ${ex.size}`;
}

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const files = fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const filePath = path.join(machinesDir, file);
  const machine = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const data = DATA[machine.slug];
  if (!data) {
    console.warn(`No data for ${machine.slug}`);
    continue;
  }

  const { precision } = machine.specs.performance;

  machine.specs.performance = {
    precision,
    engraveExample: data.engraveExample,
    cutExample: data.cutExample,
    technical: data.technical,
  };

  // Try to download real photo
  let imageUrl = data.imageUrl || null;
  if (!imageUrl && data.shopify) {
    imageUrl = await getShopifyImage(data.shopify);
  }

  const ext = imageUrl?.includes(".png") ? "png" : "jpg";
  const localPath = path.join(imagesDir, `${machine.slug}.${ext}`);
  const publicPath = `/machines/${machine.slug}.${ext}`;

  if (imageUrl) {
    const ok = await downloadImage(imageUrl, localPath);
    if (ok) {
      machine.image = publicPath;
      console.log(`Photo: ${machine.slug} ← ${imageUrl.slice(0, 60)}...`);
    } else {
      console.log(`Photo failed for ${machine.slug}, keeping ${machine.image}`);
    }
  } else {
    console.log(`No photo URL for ${machine.slug}, keeping SVG`);
  }

  fs.writeFileSync(filePath, JSON.stringify(machine, null, 2) + "\n");
}

console.log("Done.");
