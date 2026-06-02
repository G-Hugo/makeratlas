/**
 * Probe image sources for machines missing heroes.
 * Run: node scripts/probe-placeholder-images.mjs
 */

import https from "https";

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          rejectUnauthorized: options.rejectUnauthorized !== false,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }),
          );
        },
      )
      .on("error", reject);
  });
}

async function shopifyJson(pageUrl) {
  const { status, body } = await fetchUrl(`${pageUrl.replace(/\/$/, "")}.json`);
  if (status !== 200) return null;
  try {
    return JSON.parse(body).product;
  } catch {
    return null;
  }
}

async function ogImage(pageUrl, options) {
  const { status, body } = await fetchUrl(pageUrl, options);
  if (status !== 200) return null;
  const patterns = [
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const m = body.match(re);
    if (m?.[1]) return m[1].split("?")[0];
  }
  return null;
}

const probes = [
  ["comgrow-z1", "https://comgrow.com/products/comgrow-z1-laser-engraver", {}],
  ["atezr-p2", "https://www.atezr.com/products/atezr-p2-laser-engraver", {}],
  ["nubur-n4060", "https://www.nubur.com/products/n4060-laser-engraver", { rejectUnauthorized: false }],
  ["hawk-20", "https://www.htouroy.com/products/hawk-20w-laser-engraver", {}],
  ["htouroy-40w", "https://www.htouroy.com/products/htouroy-40w-laser-engraver", {}],
];

function shopifyFromHtml(html) {
  const m = html.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i);
  return m?.[0]?.split("?")[0] || null;
}

const extra = [
  ["htouroy-store", "https://www.htouroy.com/collections/all/products.json?limit=50", {}],
  ["comgrow-html", "https://comgrow.com/products/comgrow-z1-laser-engraver", {}],
  ["atezr-html", "https://atezr.com/products/atezr-p2-laser-engraver", {}],
];

for (const [slug, url, opts] of [...probes, ...extra]) {
  try {
    const isCollectionJson = url.includes("products.json");
    const json = isCollectionJson ? null : await shopifyJson(url);
    const { body } = await fetchUrl(url, opts);
    const og = isCollectionJson ? null : await ogImage(url, opts);
    const embedded = isCollectionJson ? null : shopifyFromHtml(body);
    console.log(`\n${slug}`);
    if (json?.images?.[0]) {
      console.log("  json[0]:", json.images[0].src?.split("?")[0]);
    } else if (url.endsWith("products.json") && body) {
      try {
        const products = JSON.parse(body).products || [];
        const hits = products.filter((p) =>
          /hawk|n4060|40w|z1|p2/i.test(`${p.title} ${p.handle}`),
        );
        for (const p of hits.slice(0, 4)) {
          console.log("  product:", p.handle, p.images?.[0]?.src?.split("?")[0]);
        }
      } catch {
        /* */
      }
    }
    if (og) console.log("  og:", og);
    if (embedded) console.log("  html cdn:", embedded);
    if (!json?.images?.[0] && !og && !embedded && !url.endsWith("products.json")) {
      console.log("  (none)");
    }
  } catch (e) {
    console.log(`\n${slug} ERR:`, e.message);
  }
}
