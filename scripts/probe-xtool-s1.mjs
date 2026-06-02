import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

const body = await get(
  "https://www.xtool.com/collections/laser-cutter-and-engraver-machine/products.json?limit=50",
);
for (const p of JSON.parse(body.toString()).products.filter((x) => /s1/i.test(x.title))) {
  console.log(p.handle, "|", p.title);
  console.log(" ", p.images[0]?.src?.split("?")[0].slice(-60));
}
