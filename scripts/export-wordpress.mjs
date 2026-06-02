/**
 * WordPress export script
 *
 * Reads structured content from /content and outputs JSON files
 * ready for WordPress import (WP All Import, REST API, or custom plugin).
 *
 * Usage: npm run export:wordpress
 */

import fs from "fs";
import path from "path";

const root = process.cwd();
const contentDir = path.join(root, "content");
const outputDir = path.join(root, "export", "wordpress");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid frontmatter");

  const data = {};
  for (const line of match[1].split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim().replace(/^"|"$/g, "");
    data[key] = value;
  }

  return { data, content: match[2].trim() };
}

function exportMachines() {
  const machinesDir = path.join(contentDir, "machines");
  const files = fs.readdirSync(machinesDir).filter((f) => f.endsWith(".json"));
  const exports = [];

  for (const file of files) {
    const machine = JSON.parse(
      fs.readFileSync(path.join(machinesDir, file), "utf-8"),
    );

    const postContent = [
      `## TL;DR\n\n${machine.tldr}`,
      `## Primary use\n\n${machine.primaryUse}`,
      `## Beginner notes\n\n${machine.beginnerNotes}`,
      `## Pro tips\n\n${machine.proTips}`,
      `## Pros\n\n${machine.pros.map((p) => `- ${p}`).join("\n")}`,
      `## Cons\n\n${machine.cons.map((c) => `- ${c}`).join("\n")}`,
    ].join("\n\n");

    exports.push({
      post_type: "machine",
      post_title: machine.name,
      post_name: machine.slug,
      post_status: machine.status === "published" ? "publish" : "draft",
      post_content: postContent,
      acf: {
        brand: machine.brand,
        laser_type: machine.laserType,
        image: machine.image,
        images: machine.images ?? [{ src: machine.image, alt: `${machine.name} by ${machine.brand}` }],
        main_objective: machine.mainObjective,
        tagline: machine.tagline,
        tldr: machine.tldr,
        best_for: machine.bestFor,
        price_min: machine.priceRange.min,
        price_max: machine.priceRange.max,
        price_currency: machine.priceRange.currency,
        price_note: machine.priceRange.note ?? "",
        specs: machine.specs,
        performance: machine.specs.performance,
        materials: machine.materials,
        rating: machine.rating,
        primary_use: machine.primaryUse,
        beginner_notes: machine.beginnerNotes,
        pro_tips: machine.proTips,
        affiliate_url: machine.affiliateUrl ?? "",
        last_updated: machine.lastUpdated,
      },
      taxonomies: {
        laser_type: machine.laserType,
        brand: machine.brand,
        category: machine.category,
      },
    });
  }

  fs.writeFileSync(
    path.join(outputDir, "machines.json"),
    JSON.stringify(exports, null, 2),
  );

  console.log(`Exported ${exports.length} machines → export/wordpress/machines.json`);
}

function exportGuides() {
  const guidesDir = path.join(contentDir, "guides");
  const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".md"));
  const exports = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(guidesDir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);

    exports.push({
      post_type: "guide",
      post_title: data.title,
      post_name: data.slug,
      post_status: data.status === "published" ? "publish" : "draft",
      post_content: content,
      acf: {
        description: data.description,
        category: data.category,
        read_time: data.readTime,
        last_updated: data.lastUpdated,
      },
    });
  }

  fs.writeFileSync(
    path.join(outputDir, "guides.json"),
    JSON.stringify(exports, null, 2),
  );

  console.log(`Exported ${exports.length} guides → export/wordpress/guides.json`);
}

function exportAcfFieldMap() {
  const fieldMap = {
    description: "ACF field group mapping for WordPress import",
    post_types: {
      machine: {
        fields: [
          "brand", "laser_type", "tagline", "tldr", "best_for",
          "price_min", "price_max", "price_currency", "price_note",
          "specs", "materials", "rating", "primary_use",
          "beginner_notes", "pro_tips", "affiliate_url", "last_updated",
        ],
      },
      guide: {
        fields: ["description", "category", "read_time", "last_updated"],
      },
    },
    taxonomies: ["laser_type", "brand", "category"],
    import_plugins: [
      "WP All Import (recommended for JSON)",
      "Custom REST API script",
      "Advanced Custom Fields (ACF) Pro for field groups",
    ],
  };

  fs.writeFileSync(
    path.join(outputDir, "acf-field-map.json"),
    JSON.stringify(fieldMap, null, 2),
  );

  console.log("Exported ACF field map → export/wordpress/acf-field-map.json");
}

ensureDir(outputDir);
exportMachines();
exportGuides();
exportAcfFieldMap();
console.log("\nWordPress export complete.");
