import fs from "fs";
import path from "path";

const LOGO_DIR = path.join(process.cwd(), "public", "brands", "logos");
const LOGO_EXTENSIONS = ["svg", "webp", "png", "jpg", "jpeg"] as const;

/** Public URL for a committed brand logo, if the file exists. */
export function getBrandLogoSrc(slug: string): string | undefined {
  for (const ext of LOGO_EXTENSIONS) {
    const filePath = path.join(LOGO_DIR, `${slug}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/brands/logos/${slug}.${ext}`;
    }
  }
  return undefined;
}
