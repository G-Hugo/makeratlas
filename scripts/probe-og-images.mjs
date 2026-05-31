import https from "https";
import http from "http";

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          fetchUrl(next, maxRedirects - 1).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString(), url }));
      })
      .on("error", reject);
  });
}

function imageFromHtml(html) {
  const patterns = [
    /property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image:secure_url["']/i,
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].split("?")[0];
  }
  return null;
}

async function imageFromShopifyJson(pageUrl) {
  const jsonUrl = pageUrl.replace(/\/?$/, ".json");
  const { status, body } = await fetchUrl(jsonUrl);
  if (status !== 200) return null;
  try {
    const data = JSON.parse(body);
    const src = data.product?.featured_image || data.product?.images?.[0]?.src;
    return src?.split("?")[0] || null;
  } catch {
    return null;
  }
}

const pages = [
  ["omtech-40w-co2", "https://omtechlaser.com/products/omtech-k40-40w-co2-laser-engraver"],
  ["omtech-80w-co2", "https://omtechlaser.com/products/omtech-80w-co2-laser-engraver-cutter"],
  ["omtech-polar", "https://omtechlaser.com/products/omtech-polar-desktop-co2-laser-engraver"],
  ["monport-40w-co2", "https://monportlaser.com/products/monport-40w-desktop-co2-laser-engraver"],
  ["monport-55w-co2", "https://monportlaser.com/products/monport-55w-co2-laser-engraver-cutter"],
  ["glowforge-aura", "https://shop.glowforge.com/products/glowforge-aura"],
  ["glowforge-pro", "https://shop.glowforge.com/products/glowforge-pro"],
  ["creality-falcon2-pro", "https://store.creality.com/products/creality-falcon-2-pro-22w-laser-engraver-cutter"],
  ["creality-falcon2-12w", "https://store.creality.com/products/creality-falcon-2-12w-laser-engraver-cutter"],
  ["comgrow-z1", "https://comgrow.com/products/comgrow-z1-laser-engraver"],
  ["atezr-p2", "https://www.atezr.com/products/atezr-p2-laser-engraver"],
  ["nubur-n4060", "https://www.nubur.com/products/n4060-laser-engraver"],
  ["xtool-p2s", "https://www.xtool.com/products/xtool-p2s-55w-co2-laser-cutter"],
  ["xtool-f1", "https://www.xtool.com/products/xtool-f1-portable-laser-engraver"],
  ["foxaliens-reisler-2", "https://www.foxalien.com/products/foxalien-reizer-20w-laser-engraver-1"],
  ["longer-ray5", "https://longer3d.com/products/longer-ray5-20w-laser-engraver"],
  ["laserpecker-5", "https://laserpecker.net/products/laserpecker-lp5-smart-20w-fiber-diode-laser-engraver"],
  ["algolaser-alpha-mk2", "https://algolaser.com/products/algolaser-alpha-mk2-40w-diode-laser-cutter-and-engraver"],
  ["acmer-p3", "https://acmerlaser.com/products/acmer-p3-48w-diode-enclosed-laser-engraver"],
  ["gweike-cloud-pro", "https://gweikecloud.com/products/gweike-cloud-pro-bundle"],
  ["two-trees-tts-55-pro", "https://twotrees3dofficial.com/products/tts-55-pro-tts-10-pro-diode-laser-engraver-twotrees"],
  ["twotrees-tts-55", "https://twotrees3dofficial.com/products/twotrees-ts2-20w-laser-engraver"],
];

for (const [slug, url] of pages) {
  try {
    const fromJson = await imageFromShopifyJson(url);
    if (fromJson) {
      console.log(`✓ ${slug} (json): ${fromJson}`);
      continue;
    }
    const { status, body } = await fetchUrl(url);
    const img = imageFromHtml(body);
    console.log(`${status === 200 && img ? "✓" : "✗"} ${slug} (${status}): ${img || "none"}`);
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
