import {
  MAX_COMPARE_MACHINES,
  parseCompareIdsParam,
  serializeCompareIds,
} from "@/lib/machine-compare";

const STORAGE_KEY = "makeratlas:compare-session";

export type CompareSessionMode = "versus" | "browse";

export interface CompareSession {
  slugs: string[];
  mode?: CompareSessionMode;
}

function normalizeSlugs(slugs: string[]): string[] {
  return parseCompareIdsParam(serializeCompareIds(slugs));
}

export function readCompareSession(): CompareSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CompareSession>;
    if (!Array.isArray(parsed.slugs)) return null;

    const slugs = normalizeSlugs(parsed.slugs);
    const mode: CompareSessionMode = parsed.mode === "browse" ? "browse" : "versus";

    if (slugs.length === 0 && mode !== "browse") return null;

    return { slugs, mode };
  } catch {
    return null;
  }
}

export function writeCompareSession(session: CompareSession): void {
  if (typeof window === "undefined") return;

  try {
    const slugs = normalizeSlugs(session.slugs);
    if (slugs.length === 0 && session.mode !== "browse") {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        slugs,
        mode: session.mode ?? "versus",
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function mergeCompareSessionSlug(slug: string): string[] {
  const session = readCompareSession();
  const current = session?.slugs ?? [];
  if (current.includes(slug)) return current;
  return [...current, slug].slice(0, MAX_COMPARE_MACHINES);
}

/** Toggle a slug in the stored selection and persist it. Returns the new selection. */
export function toggleCompareSessionSlug(slug: string): string[] {
  const session = readCompareSession();
  const current = session?.slugs ?? [];
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : current.length >= MAX_COMPARE_MACHINES
      ? current
      : [...current, slug];
  writeCompareSession({ slugs: next, mode: session?.mode });
  return next;
}

export function buildCompareHref(slug: string): string {
  const slugs = mergeCompareSessionSlug(slug);
  return `/compare?ids=${serializeCompareIds(slugs)}`;
}
