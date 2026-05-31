import https from "https";

const searches = [
  ["ortur", "https://ortur.net/collections/all/products.json?limit=100", /Laser Master 3|LM3|H10|H20/i],
  ["monport", "https://monportlaser.com/collections/all/products.json?limit=250", /55W|40W Pro|40W CO2|Polar|Desktop CO2/i],
  ["omtech", "https://omtechlaser.com/collections/all/products.json?limit=250", /K40|Polar|40W CO2|80W CO2|40W Desktop/i],
  ["longer", "https://longer3d.com/collections/all/products.json?limit=250", /Ray5|Ray 5|B1/i],
  ["twotrees", "https://twotrees3dofficial.com/collections/all/products.json?limit=250", /TTS-55|TS2|TS3|laser engraver/i],
  ["algolaser", "https://algolaser.com/collections/all/products.json?limit=250", /Alpha|MK2|Delta/i],
  ["acmer", "https://acmerlaser.com/collections/all/products.json?limit=250", /P3|P2|S1|A500/i],
  ["laserpecker", "https://laserpecker.net/collections/all/products.json?limit=50", /LP5|LP4/i],
  ["gweike", "https://gweikecloud.com/collections/all/products.json?limit=250", /Cloud Pro|Cloud Basic|G7|G6/i],
  ["atomstack", "https://atomstack.com/collections/all/products.json?limit=250", /A5 Pro|A40|Hurricane|A20/i],
  ["sculpfun", "https://www.sculpfun.com/collections/all/products.json?limit=250", /S30 Ultra|iCube Pro|S9/i],
  ["eu-sculpfun", "https://eu.sculpfun.com/collections/all/products.json?limit=250", /S30 Ultra|iCube Pro/i],
  ["foxalien", "https://www.foxalien.com/collections/all/products.json?limit=100", /Reisler|Masuter|laser/i],
  ["comgrow", "https://comgrow.com/collections/all/products.json?limit=100", /Z1|laser/i],
  ["atezr", "https://atezr.com/collections/all/products.json?limit=100", /P2|P1|laser/i],
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

for (const [name, url, re] of searches) {
  try {
    const { status, body } = await get(url);
    if (status !== 200) {
      console.log(`\n=== ${name} HTTP ${status} ===`);
      continue;
    }
    const products = JSON.parse(body.toString()).products;
    const matches = products.filter((p) => re.test(p.title));
    console.log(`\n=== ${name} (${matches.length} matches) ===`);
    for (const p of matches.slice(0, 10)) {
      console.log(p.handle);
      console.log(" ", p.title.slice(0, 70));
      console.log(" ", p.images[0]?.src?.split("?")[0]);
    }
  } catch (e) {
    console.log(`\n=== ${name} ERR: ${e.message} ===`);
  }
}
