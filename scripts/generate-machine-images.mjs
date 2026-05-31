/**
 * Generates SVG product placeholders in public/machines/{slug}.svg
 * Run: node scripts/generate-machine-images.mjs
 */

import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");
const outDir = path.join(process.cwd(), "public", "machines");

const BRAND_COLORS = {
  xTool: { bg: "#FFF7ED", accent: "#F59E0B", text: "#78350F" },
  Ortur: { bg: "#EFF6FF", accent: "#3B82F6", text: "#1E3A5F" },
  Sculpfun: { bg: "#F0FDF4", accent: "#22C55E", text: "#14532D" },
  Atomstack: { bg: "#FAF5FF", accent: "#A855F7", text: "#581C87" },
  Glowforge: { bg: "#FFF1F2", accent: "#F43F5E", text: "#881337" },
  OMTech: { bg: "#F8FAFC", accent: "#64748B", text: "#0F172A" },
  Monport: { bg: "#ECFEFF", accent: "#06B6D4", text: "#164E63" },
  Creality: { bg: "#EEF2FF", accent: "#6366F1", text: "#312E81" },
  Longer: { bg: "#FEF3C7", accent: "#D97706", text: "#92400E" },
  WeCreat: { bg: "#FDF4FF", accent: "#D946EF", text: "#701A75" },
  LaserPecker: { bg: "#FFF7ED", accent: "#EA580C", text: "#7C2D12" },
  TwoTrees: { bg: "#F0FDFA", accent: "#14B8A6", text: "#134E4A" },
  Acmer: { bg: "#F1F5F9", accent: "#475569", text: "#0F172A" },
  Algolaser: { bg: "#EFF6FF", accent: "#2563EB", text: "#1E3A8A" },
  Flux: { bg: "#F5F5F4", accent: "#78716C", text: "#292524" },
  Hawk: { bg: "#FEF2F2", accent: "#DC2626", text: "#7F1D1D" },
  default: { bg: "#FAFAF9", accent: "#F59E0B", text: "#44403C" },
};

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function svgForMachine({ name, brand, laserType }) {
  const colors = BRAND_COLORS[brand] ?? BRAND_COLORS.default;
  const safeName = escapeXml(name);
  const safeBrand = escapeXml(brand);
  const type = escapeXml(laserType.toUpperCase());

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg}"/>
      <stop offset="100%" style="stop-color:#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <rect x="40" y="40" width="720" height="320" rx="16" fill="#FFFFFF" stroke="${colors.accent}" stroke-width="2" opacity="0.9"/>
  <rect x="80" y="100" width="400" height="8" rx="4" fill="${colors.accent}" opacity="0.3"/>
  <rect x="80" y="130" width="280" height="6" rx="3" fill="${colors.accent}" opacity="0.2"/>
  <rect x="520" y="80" width="200" height="200" rx="8" fill="${colors.bg}" stroke="${colors.accent}" stroke-width="1.5"/>
  <circle cx="620" cy="160" r="40" fill="none" stroke="${colors.accent}" stroke-width="3" opacity="0.6"/>
  <circle cx="620" cy="160" r="8" fill="${colors.accent}"/>
  <text x="80" y="280" font-family="system-ui,sans-serif" font-size="14" fill="${colors.text}" opacity="0.6">${safeBrand}</text>
  <text x="80" y="310" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="${colors.text}">${safeName}</text>
  <rect x="80" y="330" width="120" height="28" rx="14" fill="${colors.accent}"/>
  <text x="140" y="349" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#FFFFFF">${type}</text>
  <text x="400" y="470" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#A8A29E">makeratlas.com</text>
</svg>`;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const machine = JSON.parse(fs.readFileSync(path.join(machinesDir, file), "utf-8"));
  const svg = svgForMachine(machine);
  const outPath = path.join(outDir, `${machine.slug}.svg`);
  fs.writeFileSync(outPath, svg);
  console.log(`Generated ${outPath}`);
}

console.log(`Done — ${files.length} images in public/machines/`);
