import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "content", "machines");
const rows = [];

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
  if (m.status !== "published") continue;
  const rel = (m.image || "").replace(/^\//, "");
  const disk = path.join(process.cwd(), "public", rel);
  if (!fs.existsSync(disk)) {
    rows.push({ slug: m.slug, missing: true });
    continue;
  }
  const buf = fs.readFileSync(disk);
  const meta = await sharp(buf).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  rows.push({
    slug: m.slug,
    w,
    h,
    ratio: h ? (w / h).toFixed(2) : "?",
    kb: Math.round(buf.length / 1024),
    ext: path.extname(disk),
    svg: rel.endsWith(".svg"),
  });
}

rows.sort((a, b) => (b.kb ?? 0) - (a.kb ?? 0));
console.log("=== Largest ===");
for (const r of rows.filter((r) => !r.missing).slice(0, 20)) {
  console.log(`${r.slug}\t${r.w}x${r.h}\tr=${r.ratio}\t${r.kb}kb\t${r.ext}`);
}
console.log("\n=== Missing / SVG ===");
for (const r of rows.filter((r) => r.missing || r.svg)) {
  console.log(r.slug, r.missing ? "MISSING" : "SVG");
}
console.log("\n=== Wide/tall (likely banners) ===");
for (const r of rows.filter((r) => !r.missing && r.w && r.h)) {
  const ratio = r.w / r.h;
  if (ratio > 2.2 || ratio < 0.45) console.log(`${r.slug}\t${r.w}x${r.h}\tr=${r.ratio}`);
}
