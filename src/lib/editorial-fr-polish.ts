/** Normalize FR overlay / generated copy: loanwords and residual EN markers. */
export function polishFrenchEditorialText(value: string): string {
  return value
    .replace(/\bOpen-frame\s*:/gi, "Châssis ouvert :")
    .replace(/\bopen-frame\s*:/gi, "châssis ouvert :")
    .replace(/\bopen frame\s*:/gi, "châssis ouvert :")
    .replace(/\bqu'une open-frame\b/gi, "qu'un châssis ouvert")
    .replace(/\bqu'une Open-frame\b/gi, "qu'un châssis ouvert")
    .replace(/\bMaker Atlas\b/gi, "cette fiche")
    .replace(/\bsur cette fiche sur cette fiche\b/gi, "sur cette fiche")
    .replace(/\bSide business\b/gi, "Petite activité")
    .replace(/\bPhoto & logo\b/gi, "Photo et logo")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function polishFrenchEditorialList(items: string[]): string[] {
  return items.map((item) => polishFrenchEditorialText(item)).filter(Boolean);
}

const EN_RESIDUE =
  /\b(the |and |with |for |your |without |before buying|Everyday |High-quality |Use air assist|Treat engraving|Run material test|Compare benchmark|Engraving-focused|Flagship high-power|Swappable head|Best value in)\b/i;

const FRENCH_MARKERS = /\b(avec|pour|et|les|des|découpe|gravure|atelier|puissance|enceinte|châssis|module|convient|prévoyez)\b/i;

export function looksEnglishEditorial(value: string | undefined): boolean {
  if (!value?.trim()) return true;
  return EN_RESIDUE.test(value) && !FRENCH_MARKERS.test(value);
}
