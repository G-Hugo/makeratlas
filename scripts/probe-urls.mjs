import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        get(next).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    }).on("error", reject);
  });
}

async function shopifyImage(pageUrl) {
  const { status, body } = await get(pageUrl.replace(/\/?$/, ".json"));
  if (status !== 200) return null;
  try {
    const p = JSON.parse(body).product;
    return p?.featured_image || p?.images?.[0]?.src;
  } catch {
    return null;
  }
}

const urls = [
  "https://omtech.com/products/40w-co2-laser-engraver-cutter-usb-032b-us",
  "https://omtech.com/products/polar-55w-desktop-laser-cutter-engraver-with-rotary",
  "https://omtech.com/products/omtech-polar-lite-55w-desktop-co2-laser-engraver-and-cutter",
  "https://omtech.com/products/80w-co2-laser-engraver-cutter",
  "https://monportlaser.com/products/monport-40w-pro-lightburn-supported-co2-laser-engraver-cutter",
  "https://monportlaser.com/products/monport-55w-co2-laser-engraver-cutter-with-autofocus",
  "https://monportlaser.com/products/monport-megas-55w-co2-laser-engraver-cutter",
  "https://store.creality.com/products/creality-falcon2-pro-22w-laser-engraver-cutter",
  "https://www.creality.com/products/creality-falcon2-pro-22w-laser-engraver-cutter",
  "https://longer3d.com/products/ray5-20w-laser-engraver",
  "https://www.xtool.com/products/xtool-p2s-55w-co2-laser-cutter",
  "https://www.xtool.com/products/xtool-f1-portable-laser-engraver",
  "https://sculpfun.com/products/sculpfun-s30-ultra-22w-laser-engraving-and-cutting-machine-lightburn-core-license-key",
];

for (const url of urls) {
  const img = await shopifyImage(url);
  console.log(img ? "✓" : "✗", url.split("/products/")[1]?.slice(0, 50));
  if (img) console.log(" ", img.split("?")[0]);
}
