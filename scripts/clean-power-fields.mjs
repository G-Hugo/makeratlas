import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "content", "machines");

function stripInternalPowerNotes(value) {
  let s = value;

  s = s.replace(/\([^)]+\)/g, (paren) => {
    const inner = paren.slice(1, -1);
    if (/consumer|verify|typical|sku|claimed|optical|class|rated|approx|configuration|depending on|actual|typical entry|platform/i.test(inner)) {
      if (/compress/i.test(inner) && !/optical|class|verify|consumer/i.test(inner)) {
        return " (compressed)";
      }
      return "";
    }
    return paren;
  });

  s = s
    .replace(/\s*—\s*verify\s+sku[^,;)]*/gi, "")
    .replace(/\bconsumer[- ]?rated\b/gi, "")
    .replace(/\bverify\s+sku\b/gi, "")
    .replace(/\btypical\s+sku\b/gi, "")
    .replace(/\boptical\s+class\b/gi, "")
    .replace(/\bcombined\s+optical\s+class\b/gi, "")
    .replace(/\bUV\s+class\b/gi, "UV")
    .replace(/\bCO₂\s+class\b/gi, "CO₂")
    .replace(/\bCO2\s+class\b/gi, "CO₂")
    .replace(/\bfiber\s+class\b/gi, "fiber")
    .replace(/\bdiode\s+class\b/gi, "diode")
    .replace(/\s+\(class\)/gi, "")
    .replace(/\bclass\b/gi, "")
    .replace(/\(\s*approx\.?\s*\)/gi, "")
    .replace(/\s*~\d+W\s+typical/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .replace(/[;,]\s*$/g, "")
    .trim();

  return s;
}

const manual = {
  "omtech-fc105-fiber.json": "1000W–3000W fiber (industrial sheet cutter)",
  "creality-falcon-t1.json": "20W diode",
  "omtech-fc-510-intelli.json": "510W fiber",
  "glowforge-aura.json": "6.8W CO₂ laser",
  "glowforge-pro.json": "45W CO₂",
  "htouroy-40w.json": "40W diode (compressed)",
  "sculpfun-s70-max-70w.json": "70W diode (compressed)",
  "atomstack-x30-pro.json": "160W diode (compressed)",
};

let changed = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
  const data = JSON.parse(raw);
  if (!data.specs?.power) continue;

  const before = data.specs.power;
  const after = manual[file] ?? stripInternalPowerNotes(before);
  if (after !== before) {
    data.specs.power = after;
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
    changed++;
    console.log(`${file}: ${before} -> ${after}`);
  }
}

console.log(`Updated ${changed} machine power fields.`);
