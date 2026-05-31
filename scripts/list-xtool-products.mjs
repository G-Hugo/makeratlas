import https from "https";
import fs from "fs";
import path from "path";

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
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

const buf = await get("https://www.xtool.com/collections/all/products.json?limit=250");
const data = JSON.parse(buf.toString());
for (const p of data.products) {
  console.log(p.handle, "→", p.images[0]?.src?.split("?")[0]?.slice(-60));
}
