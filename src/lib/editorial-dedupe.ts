import type { MachineEditorialDepth } from "@/types/machine";

const GENERIC_PRO_PATTERNS = [
  /Maker Atlas/i,
  /fiche avec limites matériaux/i,
  /profile includes material limits/i,
  /compare benchmarks and material limits on this profile/i,
];

function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9àâäçéèêëîïôùûüœæ\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordOverlap(a: string, b: string): boolean {
  const wa = new Set(normalizeKey(a).split(" ").filter((w) => w.length > 3));
  const wb = new Set(normalizeKey(b).split(" ").filter((w) => w.length > 3));
  if (wa.size === 0 || wb.size === 0) return false;
  let shared = 0;
  for (const w of wa) {
    if (wb.has(w)) shared++;
  }
  const ratio = shared / Math.min(wa.size, wb.size);
  return ratio >= 0.55;
}

function isSubstringDuplicate(a: string, b: string): boolean {
  const na = normalizeKey(a);
  const nb = normalizeKey(b);
  if (na.length < 24 || nb.length < 24) return false;
  const short = na.length <= nb.length ? na : nb;
  const long = na.length > nb.length ? na : nb;
  return long.includes(short.slice(0, Math.min(48, short.length)));
}

function isGenericFiller(line: string): boolean {
  return GENERIC_PRO_PATTERNS.some((re) => re.test(line));
}

/** Drop near-duplicate bullets and generic catalog filler lines. */
export function dedupeBulletList(items: string[], minKeep = 3): string[] {
  const out: string[] = [];
  for (const raw of items) {
    const item = raw.trim();
    if (!item) continue;
    if (isGenericFiller(item)) continue;
    const dup = out.some(
      (existing) => isSubstringDuplicate(item, existing) || wordOverlap(item, existing),
    );
    if (!dup) out.push(item);
  }
  if (out.length >= minKeep) return out;
  for (const raw of items) {
    if (out.length >= minKeep) break;
    const item = raw.trim();
    if (!item || isGenericFiller(item)) continue;
    const dup = out.some(
      (existing) => isSubstringDuplicate(item, existing) || wordOverlap(item, existing),
    );
    if (!dup) out.push(item);
  }
  return out.length > 0 ? out : items.filter((i) => i.trim()).slice(0, minKeep);
}

/** Remove pros/cons already covered by editorialDepth narrative. */
export function filterBulletsAgainstDepth(
  items: string[],
  depth?: MachineEditorialDepth | null,
  side: "pro" | "con" = "pro",
): string[] {
  const narrative =
    side === "con" ? (depth?.limitations ?? "") : (depth?.advantages ?? "");
  if (!narrative.trim()) {
    return dedupeBulletList(items, side === "con" ? 2 : 3);
  }
  const context = normalizeKey(narrative);
  const filtered = items.filter((item) => {
    if (wordOverlap(item, narrative)) return false;
    const key = normalizeKey(item).slice(0, 36);
    if (key.length < 14) return true;
    return !context.includes(key);
  });
  const minKeep = side === "con" ? 2 : 3;
  const deduped = dedupeBulletList(filtered.length >= minKeep ? filtered : items, minKeep);
  return deduped;
}
