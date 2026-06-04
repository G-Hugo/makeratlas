import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "translations", "fr", "machines");
const EN_PATTERNS = [
  /\bMYMEMORY\b/i,
  /\b(Mid-tier|Step up|Honest advice|Choose \w+ over|Skip if|Umbrella for|Select \d|Index for|Full-size bed|Huge community|Early adopters|Risk-tolerant|calculated risk|works well|still growing|Verify optical|Stiffen frame|Buy if you|Buy from seller|not recommended as|aggressive pricing|unproven long-term|competitive specs)\b/i,
  /\b(with better|for engraving|laser engraver by)\b/i,
  /\b(Fine gravure|Fast fill|LightBurn-first|speed-focused)\b/i,
  /\bopen-frame layout\b/i,
  /\bOpen-frame layout\b/i,
  /\bmid-tier\b/i,
  /\bplybois\b/i,
  /\b(bassbois|découper-out|Laser graveuse)\b/i,
];

const issues = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const hits = EN_PATTERNS.filter((p) => p.test(raw)).map((p) => p.source);
  if (hits.length) issues.push({ file: file.replace(".json", ""), hits: hits.length });
}

console.log(`Files with quality flags: ${issues.length}`);
if (issues.length) {
  issues.sort((a, b) => b.hits - a.hits).forEach((i) => console.log(`  ${i.file} (${i.hits} patterns)`));
  process.exit(1);
}
console.log("All files pass quality audit.");
