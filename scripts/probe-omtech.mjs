import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

const { body } = await get("https://omtechlaser.com/collections/all/products.json?limit=250");
const products = JSON.parse(body.toString()).products;

for (const p of products) {
  if (!/40w|k40|co2.*engrav/i.test(p.title)) continue;
  if (/tube|lens|honeycomb|motherboard|power supply|alignment|polar|pronto|filter|mirror|chiller|extractor/i.test(p.title))
    continue;
  console.log(p.handle);
  console.log(" ", p.title);
}

console.log("\n--- 032b product images ---");
const { body: b2 } = await get(
  "https://omtechlaser.com/products/40w-co2-laser-engraver-cutter-usb-032b-us.json",
);
const prod = JSON.parse(b2.toString()).product;
console.log(prod?.title);
for (const [i, img] of (prod?.images || []).entries()) {
  console.log(i, img.src?.split("?")[0]);
}
