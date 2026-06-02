/**
 * Quick probe: list Shopify product images for hero picking.
 * node scripts/probe-product-heroes.mjs monport-reno45-pro-45w
 */

import https from "https";
import fs from "fs";
import path from "path";
import { PRODUCT_HANDLES, STORES } from "./manufacturer-sources.mjs";
import { pickBestImage } from "./pick-card-hero-url.mjs";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/probe-product-heroes.mjs <slug>");
  process.exit(1);
}

const entry = PRODUCT_HANDLES[slug];
if (!entry) {
  console.error("No PRODUCT_HANDLES for", slug);
  process.exit(1);
}

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", () => resolve({ status: 0, body: "" }));
  });
}

const { status, body } = await get(
  `${STORES[entry.store]}/products/${entry.handle}.json`,
);
if (status !== 200) {
  console.error("HTTP", status);
  process.exit(1);
}

const product = JSON.parse(body).product;
const best = pickBestImage(product.images, slug);
console.log("Title:", product.title);
console.log("Best:", best?.src, "score", best?.score);
for (const img of product.images.slice(0, 12)) {
  const f = img.src.split("/files/")[1]?.split("?")[0] || img.src;
  console.log("-", f, "|", (img.alt || "").slice(0, 70));
}
