import https from "https";

const stores = [
  ["sculpfun", "https://www.sculpfun.com/collections/all/products.json?limit=100"],
  ["ortur", "https://ortur.net/collections/all/products.json?limit=100"],
  ["monport", "https://monportlaser.com/collections/all/products.json?limit=100"],
  ["omtech", "https://omtechlaser.com/collections/all/products.json?limit=100"],
  ["longer", "https://longer3d.com/collections/all/products.json?limit=100"],
  ["twotrees", "https://twotrees3dofficial.com/collections/all/products.json?limit=100"],
  ["algolaser", "https://algolaser.com/collections/all/products.json?limit=100"],
  ["acmer", "https://acmerlaser.com/collections/all/products.json?limit=100"],
  ["laserpecker", "https://laserpecker.net/collections/all/products.json?limit=100"],
  ["gweike", "https://gweikecloud.com/collections/all/products.json?limit=100"],
  ["atomstack", "https://atomstack.com/collections/all/products.json?limit=100"],
  ["eu-sculpfun", "https://eu.sculpfun.com/collections/all/products.json?limit=100"],
];

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
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

for (const [name, url] of stores) {
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      console.log(name, "HTTP", status);
      continue;
    }
    const products = JSON.parse(body.toString()).products;
    console.log(`\n=== ${name} (${products.length}) ===`);
    for (const p of products.slice(0, 15)) {
      console.log(p.handle, "|", p.title.slice(0, 55));
    }
  } catch (e) {
    console.log(name, "ERR", e.message);
  }
}
