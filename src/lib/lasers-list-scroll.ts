/** Persist catalog list position when opening a machine — restore on browser back. */

export type LasersListScrollState = {
  slug: string;
  listPath: string;
  search?: string;
  workFocus?: string;
  powerBand?: string;
  sort?: string;
};

const STORAGE_KEY = "makeratlas:lasers-list-scroll";

export function saveLasersListScroll(state: LasersListScrollState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private browsing */
  }
}

export function readLasersListScroll(listPath: string): LasersListScrollState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as LasersListScrollState;
    if (state.listPath !== listPath) return null;
    return state;
  } catch {
    return null;
  }
}

export function clearLasersListScroll(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
