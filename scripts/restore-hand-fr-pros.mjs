/**
 * Restore hand-written FR pros for tierEditorialOverride machines (from git before clean pass).
 * Run once: node scripts/restore-hand-fr-pros.mjs
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const frDir = path.join(process.cwd(), "content", "translations", "fr", "machines");
const REF = "7d1eb5b"; // commit before editorial clean

const slugs = [
  "xtool-s1-20w",
  "xtool-s1-40w",
  "xtool-s1-10w",
  "xtool-d1-pro-20w",
  "xtool-d1-pro-40w",
  "xtool-d1-pro-10w",
  "xtool-d1-pro-5w",
  "xtool-p2",
  "xtool-p2s",
  "xtool-p3",
  "creality-falcon-t1-20w-fiber",
  "ortur-h20-20w",
];

for (const slug of slugs) {
  const file = `content/translations/fr/machines/${slug}.json`;
  try {
    const raw = execSync(`git show ${REF}:${file}`, { encoding: "utf8" });
    const old = JSON.parse(raw);
    const currentPath = path.join(frDir, `${slug}.json`);
    if (!fs.existsSync(currentPath) || !old.pros?.length) continue;
    const current = JSON.parse(fs.readFileSync(currentPath, "utf8"));
    current.pros = old.pros;
    if (old.cons?.length >= 2) current.cons = old.cons;
    fs.writeFileSync(currentPath, `${JSON.stringify(current, null, 2)}\n`, "utf8");
    console.log(`Restored pros: ${slug}`);
  } catch {
    console.log(`Skip: ${slug}`);
  }
}
