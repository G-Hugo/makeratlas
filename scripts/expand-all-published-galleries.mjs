/**
 * Multi-photo pass for every published laser (up to 4 OEM angles each).
 * Run: node scripts/expand-all-published-galleries.mjs
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const machinesDir = path.join(process.cwd(), "content", "machines");

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
  .filter((m) => m.status === "published")
  .map((m) => m.slug)
  .sort();

console.log(`Expanding galleries for ${published.length} published machines…\n`);

execSync("node scripts/curate-all-published-galleries.mjs", { stdio: "inherit" });

const batchSize = 20;
for (let i = 0; i < published.length; i += batchSize) {
  const batch = published.slice(i, i + batchSize);
  console.log(
    `\n--- Download ${Math.floor(i / batchSize) + 1}/${Math.ceil(published.length / batchSize)} ---`,
  );
  execSync("node scripts/fetch-machine-gallery.mjs", {
    stdio: "inherit",
    env: { ...process.env, SLUGS: batch.join(",") },
  });
}

execSync("node scripts/ensure-min-gallery-photos.mjs", { stdio: "inherit" });
execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });

let under3 = 0;
for (const slug of published) {
  const m = JSON.parse(
    fs.readFileSync(path.join(machinesDir, `${slug}.json`), "utf8"),
  );
  if ((m.images?.length || 0) < 3) under3 += 1;
}

console.log(
  under3 === 0
    ? `\nDone. All ${published.length} published lasers have at least 3 photos.`
    : `\nDone. ${under3} machine(s) still below 3 photos — run: npm run ensure:galleries`,
);
