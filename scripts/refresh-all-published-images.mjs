/**
 * Full image refresh for all published lasers:
 * curate OEM URLs → download galleries → sync card/detail heroes → audit.
 *
 * Run: npm run refresh:all-images
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const machinesDir = path.join(process.cwd(), "content", "machines");

const published = fs
  .readdirSync(machinesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(machinesDir, f), "utf8")))
  .filter((m) => m.status === "published")
  .map((m) => m.slug)
  .sort();

console.log(`Refreshing ${published.length} published machines…\n`);

execSync("node scripts/curate-all-published-galleries.mjs", { stdio: "inherit" });

const batchSize = 25;
for (let i = 0; i < published.length; i += batchSize) {
  const batch = published.slice(i, i + batchSize);
  console.log(`\n--- Fetch batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(published.length / batchSize)} (${batch.length} slugs) ---`);
  execSync("node scripts/fetch-machine-gallery.mjs", {
    stdio: "inherit",
    env: { ...process.env, SLUGS: batch.join(",") },
  });
}

execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });
execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });

console.log("\n--- Post-audit ---");
try {
  execSync("node scripts/audit-published-images.mjs", { stdio: "inherit" });
} catch {
  console.log("\nAudit reported issues — see list above.");
}

console.log("\nAll published laser images refreshed.");
