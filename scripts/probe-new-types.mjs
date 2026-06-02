import https from "https";

const stores = {
  commarker: "https://www.commarker.com",
  monport: "https://monportlaser.com",
  omtech: "https://omtechlaser.com",
  xtool: "https://www.xtool.com",
  gweike: "https://gweikecloud.com",
};

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

for (const [name, base] of Object.entries(stores)) {
  try {
    const { status, body } = await get(`${base}/collections/all/products.json?limit=250`);
    if (status !== 200) {
      console.log(`\n${name} HTTP ${status}`);
      continue;
    }
    const products = JSON.parse(body.toString()).products;
    const hits = products.filter((p) => /fiber|uv|mopa|galvo|355/i.test(p.title) && !/module|lens|part|tube|refill/i.test(p.title));
    console.log(`\n=== ${name} (${hits.length}) ===`);
    for (const p of hits.slice(0, 8)) {
      console.log(p.handle, "|", p.title.slice(0, 65));
      console.log(" ", p.images[0]?.src?.split("?")[0]?.slice(-55));
    }
  } catch (e) {
    console.log(`\n${name} ERR`, e.message);
  }
}
