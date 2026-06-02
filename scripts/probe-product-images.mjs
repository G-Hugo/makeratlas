import https from "https";

const PRODUCTS = {
  "xtool-s1": "https://www.xtool.com/products/xtool-s1-laser-cutter.json",
  "xtool-s1-20w": "https://www.xtool.com/products/xtool-s1-20w-enclosed-laser-engraver.json",
  "sculpfun-icube-pro": "https://www.sculpfun.com/products/sculpfun-icube-pro-5w-portable-laser-engraving-machine.json",
  "laserpecker-4": "https://laserpecker.net/products/laserpecker-lp4-portable-ir-diode-dual-laser.json",
  "laserpecker-5": "https://laserpecker.net/products/laserpecker-lp5-smart-20w-fiber-diode-laser-engraver.json",
  "omtech-40w-co2": "https://omtechlaser.com/products/40w-co2-laser-engraver-cutter-usb-032b-us.json",
  "omtech-k40": "https://omtechlaser.com/products/omtech-k40-40w-co2-laser-engraver.json",
  "omtech-032b": "https://omtechlaser.com/products/40w-co2-laser-engraver-cutter-with-lightburn-software.json",
};

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : new URL(res.headers.location, url).href;
          get(next).then(resolve).catch(reject);
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on("error", reject);
  });
}

for (const [slug, url] of Object.entries(PRODUCTS)) {
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      console.log(`\n=== ${slug} HTTP ${status} ===`);
      continue;
    }
    const p = JSON.parse(body.toString()).product;
    console.log(`\n=== ${slug}: ${p.title} ===`);
    for (const [i, img] of (p.images || []).slice(0, 12).entries()) {
      const src = img.src?.split("?")[0] || "";
      const tail = src.slice(-55);
      console.log(`${i}\t${(img.alt || "(no alt)").slice(0, 70)}\t${tail}`);
    }
  } catch (e) {
    console.log(`\n=== ${slug} ERR ${e.message} ===`);
  }
}
