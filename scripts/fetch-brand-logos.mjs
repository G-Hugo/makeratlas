/**
 * Downloads brand logos into public/brands/logos/{slug}.{png|svg|webp}
 */
import fs from "fs";
import path from "path";

const OUT_DIR = path.join("public", "brands", "logos");
const catalog = JSON.parse(fs.readFileSync("content/brands/catalog.json", "utf8"));
const overridesPath = "content/brands/logo-overrides.json";
const overrides = fs.existsSync(overridesPath)
  ? JSON.parse(fs.readFileSync(overridesPath, "utf8"))
  : {};
const UA = "MakerAtlas/1.0 (brand logo fetch)";

fs.mkdirSync(OUT_DIR, { recursive: true });

function hostname(website) {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function absolutize(baseUrl, href) {
  try {
    return new URL(href.replace(/&amp;/g, "&"), baseUrl).href;
  } catch {
    return null;
  }
}

function shopifyLogoVariants(url) {
  if (!url.includes("/cdn/shop/")) return [url];
  const variants = new Set([url]);
  const base = url.split("?")[0].replace(/_\d+x\d+(?=\.\w+)/, "");
  variants.add(base);
  variants.add(`${base}?width=480`);
  variants.add(url.replace(/([?&])width=\d+/g, "$1width=480"));
  return [...variants];
}

function scoreUrl(url) {
  let score = 0;
  const lower = url.toLowerCase();
  if (lower.includes("logo")) score += 1200;
  if (lower.includes("brand")) score += 300;
  if (lower.includes("favicon") || lower.includes("icon")) score += 150;
  if (lower.includes("apple-touch")) score += 200;
  if (/banner|hero|slide|product|_PC_|\/T0\d|weaver|cart\//i.test(url)) score -= 1500;
  if (lower.endsWith(".svg")) score += 100;
  const w = url.match(/width=(\d+)/i)?.[1];
  if (w) score += Math.min(Number(w), 320);
  return score;
}

function extForType(type) {
  if (type.includes("svg")) return "svg";
  if (type.includes("webp")) return "webp";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  return "png";
}

async function fetchImage(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) return null;
  return { buf, type, ext: extForType(type), url };
}

function linksFromHtml(html, baseUrl) {
  const scored = [];
  const linkRe = /<link\s+[^>]*>/gi;
  let m;
  while ((m = linkRe.exec(html))) {
    const tag = m[0];
    const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href) continue;
    const abs = absolutize(baseUrl, href);
    if (!abs) continue;
    let baseScore = rel.includes("apple-touch-icon") ? 250 : rel.includes("icon") ? 120 : 0;
    for (const variant of shopifyLogoVariants(abs)) {
      scored.push({ url: variant, score: baseScore + scoreUrl(variant) });
    }
  }

  const imgRe = /<img\s+[^>]*>/gi;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    const src = /src=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!src) continue;
    const abs = absolutize(baseUrl, src);
    if (!abs) continue;
    const hint = `${tag} ${abs}`.toLowerCase();
    if (!hint.includes("logo") && !hint.includes("brand")) continue;
    for (const variant of shopifyLogoVariants(abs)) {
      scored.push({ url: variant, score: 500 + scoreUrl(variant) });
    }
  }

  return [...new Map(scored.sort((a, b) => b.score - a.score).map((s) => [s.url, s])).values()];
}

async function discoverCandidates(website) {
  const host = hostname(website);
  if (!host) return [];
  const bases = [`https://${host}/`, `https://www.${host}/`, website.endsWith("/") ? website : `${website}/`];
  const out = [];
  for (const base of bases) {
    try {
      const res = await fetch(base, { headers: { "User-Agent": UA }, redirect: "follow" });
      if (!res.ok) continue;
      out.push(...linksFromHtml(await res.text(), res.url).map((s) => s.url));
    } catch {
      /* next */
    }
  }
  return [...new Set(out)];
}

function writeWordmarkSvg(brand) {
  const safeName = brand.name.replace(/[<>&"']/g, "");
  const fontSize = safeName.length > 12 ? 28 : safeName.length > 8 ? 34 : 40;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120" role="img" aria-label="${safeName}">
  <rect width="320" height="120" rx="16" fill="#ffffff"/>
  <text x="160" y="72" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-weight="700" font-size="${fontSize}" fill="#1c1917">${safeName}</text>
</svg>
`;
  fs.writeFileSync(path.join(OUT_DIR, `${brand.slug}.svg`), svg);
}

function clearBrandFiles(slug) {
  for (const ext of ["png", "svg", "webp", "jpg", "jpeg"]) {
    const p = path.join(OUT_DIR, `${slug}.${ext}`);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

async function saveBest(slug, candidates) {
  let best = null;
  for (const url of candidates) {
    try {
      const img = await fetchImage(url);
      if (!img) continue;
      const quality = scoreUrl(url) + Math.min(img.buf.length, 80000) / 100;
      if (img.buf.length > 350000 && scoreUrl(url) < 800) continue;
      if (!best || quality > best.quality) best = { ...img, quality };
    } catch {
      /* next */
    }
  }
  if (!best) return false;
  const out = path.join(OUT_DIR, `${slug}.${best.ext}`);
  fs.writeFileSync(out, best.buf);
  console.log(`ok  ${slug} (${best.buf.length}b, .${best.ext}) <- ${best.url}`);
  return true;
}

async function fetchBrand(brand) {
  clearBrandFiles(brand.slug);

  if (overrides[brand.slug] && (await saveBest(brand.slug, [overrides[brand.slug]]))) {
    return;
  }

  const host = hostname(brand.website);
  const candidates = [
    ...(await discoverCandidates(brand.website)),
    host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : null,
    host ? `https://${host}/apple-touch-icon.png` : null,
  ].filter(Boolean);

  if (await saveBest(brand.slug, candidates)) return;

  writeWordmarkSvg(brand);
  console.log(`svg ${brand.slug} <- wordmark`);
}

for (const brand of catalog.brands) {
  await fetchBrand(brand);
}

console.log("Done.");
