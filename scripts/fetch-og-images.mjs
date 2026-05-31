/**
 * Fetch og:image from product pages for machines still on SVG
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

const PAGES = {
  "xtool-d1-pro": "https://www.xtool.com/products/xtool-d1-pro-20w-laser-engraver",
  "xtool-s1": "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver",
  "xtool-f1-ultra": "https://www.xtool.com/products/xtool-f1-ultra-portable-laser-engraver",
  "xtool-f2-ultra": "https://www.xtool.com/products/xtool-f2-ultra",
  "xtool-m1-ultra": "https://www.xtool.com/products/xtool-m1-ultra",
  "sculpfun-s30-ultra": "https://sculpfun.com/products/sculpfun-s30-pro-ultra-20w-laser-engraver",
  "creality-falcon2-pro": "https://store.creality.com/products/creality-falcon2-pro-22w-laser-engraver-and-cutter",
  "laserpecker-4": "https://laserpecker.net/products/laserpecker-4",
  "glowforge-aura": "https://glowforge.com/products/glowforge-aura",
  "glowforge-pro": "https://glowforge.com/products/glowforge-pro",
  "longer-ray5": "https://longer3d.com/products/longer-ray5-20w-laser-engraver",
  "wecreat-vision": "https://wecreat.com/products/wecreat-vision",
  "monport-55w-co2": "https://monportlaser.com/products/monport-55w-co2-laser-engraver",
  "omtech-40w-co2": "https://omtechlaser.com/products/omtech-k40-40w-co2-laser-engraver",
  "twotrees-tts-55": "https://twotrees3dofficial.com/products/two-trees-tts-55-pro",
  "acmer-p3": "https://acmerlaser.com/products/acmer-p3-laser-engraver",
  "algolaser-alpha-mk2": "https://algolaser.com/products/algolaser-alpha-mk2",
  "sculpfun-icube-pro": "https://sculpfun.com/products/sculpfun-icube-pro",
  "atomstack-a40-pro": "https://atomstack.com/products/atomstack-a40-pro",
  "creality-falcon2-12w": "https://store.creality.com/products/creality-falcon2-12w-laser-engraver",
  "hawk-20": "https://www.amazon.com/dp/B0CXXXXXXX",
};

function get(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; MakerAtlas/1.0)" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          get(next).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf-8").slice(0, 500000) }));
      })
      .on("error", reject);
  });
}

function extractOgImage(html) {
  const m =
    html.match(/property="og:image"\s+content="([^"]+)"/) ||
    html.match(/content="([^"]+)"\s+property="og:image"/) ||
    html.match(/"featured_image"\s*:\s*"([^"]+)"/) ||
    html.match(/"src"\s*:\s*"(https:\/\/cdn\.shopify\.com[^"]+\.(?:jpg|png|webp))"/);
  return m?.[1]?.replace(/\\u0026/g, "&").split("?")[0] || null;
}

async function downloadBinary(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadBinary(res.headers.location).then(resolve).catch(reject);
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

for (const [slug, pageUrl] of Object.entries(PAGES)) {
  if (slug === "hawk-20") continue;
  const machinePath = path.join(machinesDir, `${slug}.json`);
  if (!fs.existsSync(machinePath)) continue;
  const m = JSON.parse(fs.readFileSync(machinePath, "utf-8"));
  if (m.image?.endsWith(".jpg") || m.image?.endsWith(".png") || m.image?.endsWith(".webp")) {
    console.log(`skip ${slug} (has photo)`);
    continue;
  }
  try {
    const { status, body } = await get(pageUrl);
    if (status !== 200) {
      console.log(`✗ ${slug}: HTTP ${status}`);
      continue;
    }
    const imgUrl = extractOgImage(body);
    if (!imgUrl) {
      console.log(`✗ ${slug}: no og:image`);
      continue;
    }
    const buf = await downloadBinary(imgUrl);
    if (buf.length < 2000) {
      console.log(`✗ ${slug}: image too small`);
      continue;
    }
    const ext = imgUrl.includes(".png") ? "png" : "jpg";
    fs.writeFileSync(path.join(imagesDir, `${slug}.${ext}`), buf);
    m.image = `/machines/${slug}.${ext}`;
    fs.writeFileSync(machinePath, JSON.stringify(m, null, 2) + "\n");
    console.log(`✓ ${slug}`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
