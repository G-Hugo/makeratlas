import https from "https";

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

const urls = [
  ["omtech-fiber", "https://omtechlaser.com/collections/fiber-laser-engravers/products.json?limit=30"],
  ["omtech-all", "https://omtechlaser.com/collections/all/products.json?limit=250"],
  ["commarker", "https://www.commarker.com/collections/all/products.json?limit=50"],
  ["commarker-store", "https://store.commarker.com/collections/all/products.json?limit=50"],
];

for (const [label, url] of urls) {
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      console.log(label, status);
      continue;
    }
    const products = JSON.parse(body.toString()).products || [];
    const hits = products.filter(
      (p) =>
        /fiber|uv|mopa|galvo|355/i.test(`${p.title} ${p.handle}`) &&
        !/glass|goggle|extractor|filter|lens|module|attachment|nozzle|chuck|axis|fume|parts/i.test(p.title),
    );
    console.log(`\n=== ${label} (${hits.length}) ===`);
    for (const p of hits.slice(0, 10)) {
      console.log(p.handle);
      console.log(" ", p.title.slice(0, 70));
    }
  } catch (e) {
    console.log(label, "ERR", e.message);
  }
}
