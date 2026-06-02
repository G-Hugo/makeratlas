/**
 * Fix catalog cards that show promos/bundles/accessories instead of the machine.
 * Only touches CARD_HERO_FIX_SLUGS — run: node scripts/fix-non-machine-card-heroes.mjs
 */

import { execSync } from "child_process";
import { CARD_HERO_FIX_SLUGS } from "./card-hero-manual.mjs";

const slugs = CARD_HERO_FIX_SLUGS.join(",");
console.log(`Fixing ${CARD_HERO_FIX_SLUGS.length} machine(s)…\n`);

execSync("node scripts/fetch-machine-gallery.mjs", {
  stdio: "inherit",
  env: { ...process.env, SLUGS: slugs },
});

execSync("node scripts/sync-umbrella-card-images.mjs", { stdio: "inherit" });
execSync("node scripts/sync-machine-hero-image.mjs", { stdio: "inherit" });

console.log("\nNon-machine card hero fix complete.");
