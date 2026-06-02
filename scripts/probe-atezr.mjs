import https from "https";

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve({ status: res.statusCode, body: d }));
      })
      .on("error", reject);
  });
}

for (const handle of [
  "atezr-p10-10w-laser-engraving-machine",
  "atezr-p20-plus-20w-laser-engraving-machine",
  "atezr-p2-laser-engraver",
]) {
  const { status, body } = await get(`https://atezr.com/products/${handle}.json`);
  console.log(handle, status);
  if (status === 200) {
    const p = JSON.parse(body).product;
    console.log(" ", p.title);
    console.log(" ", p.images?.[0]?.src?.split("?")[0]);
  }
}
