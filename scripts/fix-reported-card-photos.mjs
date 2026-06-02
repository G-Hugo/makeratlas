/**
 * Refresh all catalog card heroes + OEM availability pass.
 * Run: npm run fix:card-photos
 */

import { execSync } from "child_process";

execSync("node scripts/curate-all-published-galleries.mjs", { stdio: "inherit" });
execSync("node scripts/apply-catalog-metadata.mjs", { stdio: "inherit" });
execSync("node scripts/verify-oem-availability.mjs --apply", { stdio: "inherit" });
execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });
execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });
console.log("Card photos + OEM availability pass complete.");
