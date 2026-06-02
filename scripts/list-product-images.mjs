import { STORES, PRODUCT_HANDLES } from "./manufacturer-sources.mjs";
import https from "https";

const slug = process.argv[2];
const { store, handle } = PRODUCT_HANDLES[slug];
const url = `${STORES[store]}/products/${handle}.json`;

const body = await new Promise((resolve, reject) => {
  https
    .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(d));
    })
    .on("error", reject);
});

const product = JSON.parse(body).product;
for (const [i, img] of (product.images || []).entries()) {
  console.log(i, img.src?.split("?")[0]);
}
