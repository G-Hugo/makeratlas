/** Resolve OEM Shopify handle for a catalog slug. */

import { PRODUCT_HANDLES } from "./manufacturer-sources.mjs";

const VARIANT_ALIASES = {
  "atomstack-a5-pro-5w": "atomstack-a5-pro",
  "atomstack-a5-pro-10w": "atomstack-a5-pro",
  "atomstack-a5-pro-20w": "atomstack-a5-pro",
  "xtool-d1-pro-5w": "xtool-d1-pro",
  "xtool-d1-pro-10w": "xtool-d1-pro",
  "xtool-d1-pro-20w": "xtool-d1-pro",
  "ortur-laser-master-h10-10w": "ortur-laser-master-h10-20w",
  "ortur-laser-master-h10-40w": "ortur-laser-master-h10-20w",
  "sculpfun-s9-5w": "sculpfun-s9-10w",
  "twotrees-tts-55-10w": "twotrees-tts-55-20w",
  "twotrees-tts-55-40w": "twotrees-tts-55-20w",
  "two-trees-tts-55-pro-10w": "two-trees-tts-55-pro-20w",
  "monport-gt-60w-fiber": "monport-gt-100w-fiber",
  "monport-gt-50w-fiber": "monport-gt-30w-fiber",
};

export function resolveProductHandleEntry(slug, machine = {}) {
  if (PRODUCT_HANDLES[slug]) return PRODUCT_HANDLES[slug];

  const alias = VARIANT_ALIASES[slug];
  if (alias && PRODUCT_HANDLES[alias]) return PRODUCT_HANDLES[alias];

  const line = machine.modelLine;
  if (line && PRODUCT_HANDLES[line]) return PRODUCT_HANDLES[line];

  return null;
}
